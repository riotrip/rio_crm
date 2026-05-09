<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeadController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $query = Lead::with('sales:id,name');

        if ($user->role !== 'manager') {
            $query->where('id_sales', $user->id);
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->get()
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
}