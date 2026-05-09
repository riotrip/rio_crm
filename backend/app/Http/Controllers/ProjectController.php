<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectItem;
use App\Models\Lead;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $query = Project::with(['lead', 'sales', 'approver']); 

        if ($user->role === 'sales') {
            $query->where('id_sales', $user->id); //
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate(10) 
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_lead' => 'required|exists:leads,id',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id_product' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.nego_price' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {
            $project = Project::create([
                'id_lead' => $validated['id_lead'],
                'id_sales' => Auth::id(),
                'status' => 'process',
                'notes' => $validated['notes'],
            ]);

            foreach ($validated['items'] as $item) {
                $product = Product::find($item['id_product']);
                ProjectItem::create([
                    'id_project' => $project->id,
                    'id_product' => $product->id,
                    'qty' => $item['qty'],
                    'selling_price' => $product->selling_price,
                    'nego_price' => $item['nego_price'],
                    'needs_approval' => $item['nego_price'] < $product->selling_price ? 1 : 0,
                ]);
            }

            return response()->json(['success' => true, 'data' => $project->load('items')], 201);
        });
    }

    public function show($id)
    {
        $project = Project::with([
            'lead',
            'sales',
            'approver',        // ← tambahkan ini
            'items.product'
        ])->find($id);

        if (!$project) {
            return response()->json(['message' => 'Project tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $project
        ]);
    }

    public function update(Request $request, Project $project)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected,process,waiting_approval',
            'notes' => 'nullable|string'
        ]);

        if (in_array($validated['status'], ['approved', 'rejected'])) {
            return DB::transaction(function () use ($project, $validated, $user) {
                $project->update([
                    'status' => $validated['status'],
                    'id_approved_by' => $user->id,
                    'approved_at' => now(),
                    'notes' => $validated['notes'] ?? $project->notes
                ]);

                if ($validated['status'] === 'approved') {
                    Customer::firstOrCreate(
                        ['id_lead' => $project->id_lead],
                        [
                            'id_project' => $project->id,
                            'id_sales'   => $project->id_sales,
                            'name'       => $project->lead->name,
                            'contact'    => $project->lead->contact,
                            'address'    => $project->lead->address,
                            'joined_at'  => now()->toDateString(),
                        ]
                    );
                    $project->lead->update(['status' => 'deal']);
                } else {
                    $project->lead->update(['status' => 'lost']);
                }

                return response()->json(['success' => true, 'data' => $project->load(['lead', 'sales', 'approver'])]);
            });
        }
        if ($user->role === 'sales') {
            if ($project->status !== 'process') {
                return response()->json(['message' => 'Project yang sudah diajukan tidak dapat diubah'], 422);
            }

            $validated = $request->validate([
                'id_lead' => 'required|exists:leads,id',
                'notes' => 'nullable|string',
                'items' => 'required|array|min:1',
                'items.*.id_product' => 'required|exists:products,id',
                'items.*.qty' => 'required|integer|min:1',
                'items.*.nego_price' => 'required|numeric',
            ]);

            return DB::transaction(function () use ($project, $validated) {
                $project->update([
                    'id_lead' => $validated['id_lead'],
                    'notes' => $validated['notes']
                ]);

                $project->items()->delete();
                foreach ($validated['items'] as $item) {
                    $product = Product::find($item['id_product']);
                    ProjectItem::create([
                        'id_project' => $project->id,
                        'id_product' => $product->id,
                        'qty' => $item['qty'],
                        'selling_price' => $product->selling_price,
                        'nego_price' => $item['nego_price'],
                        'needs_approval' => $item['nego_price'] < $product->selling_price ? 1 : 0,
                    ]);
                }
                return response()->json(['success' => true, 'data' => $project->load('items')]);
            });
        }

        return response()->json(['message' => 'Forbidden'], 403);
    }

    public function destroy(Project $project)
    {
        if (Auth::user()->role !== 'manager') return response()->json(['message' => 'Forbidden'], 403);
        
        $project->delete();
        return response()->json(['success' => true]);
    }
}