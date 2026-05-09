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

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
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