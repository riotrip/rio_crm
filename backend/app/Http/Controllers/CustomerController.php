<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $query = Customer::with(['lead', 'sales', 'project.items.product']);

        if ($user->role === 'sales') {
            $query->where('id_sales', $user->id);
        }

        if ($request->filled('search') && $request->search !== '') {
            $query->where('name', 'LIKE', "%{$request->search}%");
        }

        if ($request->filled('month') && $request->month !== '') {
            $query->whereMonth('joined_at', $request->month);
        }

        if ($request->filled('year') && $request->year !== '') {
            $query->whereYear('joined_at', $request->year);
        }

        if ($request->filled('id_sales') && $user->role === 'manager') {
            $query->where('id_sales', $request->id_sales);
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate(10)
        ]);
    }

    public function show(Request $request, Customer $customer)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role === 'sales' && $customer->id_sales !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $customer->load(['lead', 'sales', 'project.items.product']);

        return response()->json([
            'success' => true,
            'data' => $customer
        ]);
    }
}