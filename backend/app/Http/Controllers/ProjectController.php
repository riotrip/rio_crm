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
        
        $query = Project::with(['lead', 'sales', 'approver', 'items.product']);
        
        if ($user->role === 'sales') {
            $query->where('id_sales', $user->id);
        }
        
        if ($request->filled('id_sales') && $user->role === 'manager') {
            $query->where('id_sales', $request->id_sales);
        }
        
        if ($request->filled('month') && $request->month !== '') {
            $query->whereMonth('created_at', $request->month);
        }
        
        if ($request->filled('year') && $request->year !== '') {
            $query->whereYear('created_at', $request->year);
        }
        
        if ($request->filled('search') && $request->search !== '') {
            $search = $request->search;
            $query->whereHas('lead', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%");
            });
        }
        
        $projects = $query->latest()->paginate(10);
        
        return response()->json([
            'success' => true,
            'data' => $projects->items(),
            'pagination' => [
                'currentPage' => $projects->currentPage(),
                'lastPage' => $projects->lastPage(),
                'total' => $projects->total(),
                'perPage' => $projects->perPage(),
            ]
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
                'status' => 'waiting_approval', 
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
            
            $project->load('lead'); 
            if ($project->lead) {
                $project->lead->update(['status' => 'contacted']);
            }

            return response()->json(['success' => true, 'data' => $project->load('items')], 201);
        });
    }

    public function show($id)
    {
        $project = Project::with([
            'lead',
            'sales',
            'approver',       
            'items.product'
        ])->find($id);

        if (!$project) {
            return response()->json(['success' => false, 'message' => 'Project tidak ditemukan'], 404);
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

        if ($request->has('status') && in_array($request->status, ['approved', 'rejected'])) {
            if ($user->role !== 'manager') {
                return response()->json(['success' => false, 'message' => 'Hanya Manager yang dapat menyetujui project'], 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:approved,rejected',
                'notes' => 'nullable|string'
            ]);

            return DB::transaction(function () use ($project, $validated, $user) {
                $project->update([
                    'status' => $validated['status'],
                    'id_approved_by' => $user->id,
                    'approved_at' => now(),
                    'notes' => $validated['notes'] ?? $project->notes
                ]);

                if ($validated['status'] === 'approved') {
                    $project->load('lead');

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
        
                } else if ($validated['status'] === 'rejected') {
                    $project->load('lead');
                    $project->lead->update(['status' => 'lost']);
                }

                return response()->json(['success' => true, 'data' => $project->load(['lead', 'sales', 'approver'])]);
            });
        }
        
        if ($user->role === 'sales') {
            if ($project->status !== 'process') {
                return response()->json(['success' => false, 'message' => 'Project yang sudah diajukan tidak dapat diubah'], 422);
            }

            $validated = $request->validate([
                'id_lead' => 'required|exists:leads,id',
                'notes' => 'nullable|string',
                'items' => 'required|array|min:1',
                'items.*.id_product' => 'required|exists:products,id',
                'items.*.qty' => 'required|integer|min:1',
                'items.*.nego_price' => 'required|numeric|min:0',
            ]);

            return DB::transaction(function () use ($project, $validated) {
                $project->update([
                    'id_lead' => $validated['id_lead'],
                    'notes' => $validated['notes']
                ]);

                // Hapus items lama, buat baru
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

        return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
    }

    public function destroy(Project $project)
    {
        if (Auth::user()->role !== 'manager') {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }
        
        $project->delete();
        return response()->json(['success' => true, 'message' => 'Project deleted successfully']);
    }
}