<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $query = Product::query();

        if ($user->role === 'sales') {
            $query->where('is_active', true);
        }

        if ($request->filled('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                ->orWhere('code', 'LIKE', "%{$search}%");
            });
        }
        if ($request->filled('is_active') && $request->is_active !== '') {
            $query->where('is_active', $request->is_active === 'true' ? 1 : 0);
        }

        if ($request->boolean('all')) {
            return response()->json(['success' => true, 'data' => $query->get()]);
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate(10)
        ]);
    }

    public function store(Request $request)
    {
        if (Auth::user()->role !== 'manager') return response()->json(['message' => 'Forbidden'], 403);

        $validated = $request->validate([
            'code' => 'required|string|unique:products,code',
            'name' => 'required|string|max:255',
            'hpp' => 'required|numeric|min:0',
            'margin' => 'required|numeric|min:0|max:999.99',
            'description' => 'nullable|string',
        ]);

        $validated['selling_price'] = $validated['hpp'] + ($validated['hpp'] * ($validated['margin'] / 100));
        $validated['is_active'] = true;

        $product = Product::create($validated);
        return response()->json(['success' => true, 'data' => $product], 201);
    }

    public function update(Request $request, Product $product)
    {
        if (Auth::user()->role !== 'manager') return response()->json(['message' => 'Forbidden'], 403);

        $validated = $request->validate([
            'code' => 'sometimes|required|string|unique:products,code,' . $product->id,
            'name' => 'sometimes|required|string|max:255',
            'hpp' => 'sometimes|required|numeric|min:0',
            'margin' => 'sometimes|required|numeric|min:0|max:999.99',
        ]);

        $hpp = $validated['hpp'] ?? $product->hpp;
        $margin = $validated['margin'] ?? $product->margin;
        $validated['selling_price'] = $hpp + ($hpp * ($margin / 100));

        $product->update($validated);
        return response()->json(['success' => true, 'data' => $product]);
    }

    public function toggleActive(Product $product)
    {
        if (Auth::user()->role !== 'manager') return response()->json(['message' => 'Forbidden'], 403);

        $product->update(['is_active' => !$product->is_active]);
        return response()->json(['success' => true, 'data' => $product]);
    }

    public function destroy(Product $product)
    {
        if (Auth::user()->role !== 'manager') return response()->json(['message' => 'Forbidden'], 403);
        $product->delete();
        return response()->json(['success' => true]);
    }
}