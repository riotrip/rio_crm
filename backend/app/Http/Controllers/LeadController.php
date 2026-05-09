<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Project;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $query = Lead::with(['sales']);

        if ($user->role === 'sales') {
            $query->where('id_sales', $user->id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('contact', 'ilike', "%{$search}%");
            });
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate(10)
        ]);
    }

public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:100',
        'contact' => 'required|string|max:100',
        'address' => 'nullable|string',
        'requirement' => 'nullable|string',
    ]);

    $validated['id_sales'] = Auth::id();
    $validated['status'] = 'new'; // 1. Otomatis menjadi 'new'

    $lead = Lead::create($validated);
    return response()->json(['success' => true, 'data' => $lead], 201);
}

    public function show(Lead $lead)
    {
        return response()->json(['success' => true, 'data' => $lead->load('sales')]);
    }

    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'contact' => 'sometimes|required|string|max:100',
            'address' => 'nullable|string',
            'requirement' => 'nullable|string',
        ]);

        $lead->update($validated);
        return response()->json(['success' => true, 'data' => $lead]);
    }

    public function destroy(Lead $lead)
    {
        if (Auth::user()->role !== 'manager' && $lead->id_sales !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $lead->delete();
        return response()->json(['success' => true]);
    }
}