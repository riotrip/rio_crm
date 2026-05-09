<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeadController extends Controller
{
 public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $query = Lead::with('sales:id,name');

        if ($user->role !== 'manager') {
            $query->where('id_sales', $user->id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('contact', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $stats = [
            'total' => (clone $query)->count(),
            'deal' => (clone $query)->where('status', 'deal')->count(),
            'customer' => (clone $query)->whereIn('status', ['qualified', 'deal'])->count(),
        ];

        $leads = $query->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'data' => $leads 
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'required|string',
            'address' => 'nullable|string',
            'requirement' => 'nullable|string',
            'status' => 'required|in:new,contacted,qualified,deal,lost'
        ]);

        $validated['id_sales'] = Auth::id();

        $lead = Lead::create($validated);
        $lead->load('sales:id,name');

        return response()->json([
            'success' => true,
            'message' => 'Lead berhasil ditambahkan',
            'data' => $lead
        ], 201);
    }

    public function show(Lead $lead)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role !== 'manager' && $lead->id_sales !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true, 
            'data' => $lead->load('sales:id,name')
        ]);
    }

    public function update(Request $request, Lead $lead)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role !== 'manager' && $lead->id_sales !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'contact' => 'sometimes|required|string',
            'address' => 'nullable|string',
            'requirement' => 'nullable|string',
            'status' => 'sometimes|required|in:new,contacted,qualified,deal,lost'
        ]);

        $lead->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diperbarui',
            'data' => $lead->load('sales:id,name') 
        ]);
    }

    public function destroy(Lead $lead)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role !== 'manager' && $lead->id_sales !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $lead->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lead berhasil dihapus'
        ]);
    }
}