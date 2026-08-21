<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = $request->user()
            ->cart()
            ->with('items.product.images')
            ->first();

        if (!$cart) {
            return response()->json([
                'items' => [],
                'message' => 'Cart is empty',
            ]);
        }

        return response()->json($cart);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($product->stock < $validated['quantity']) {
            return response()->json([
                'message' => 'Insufficient stock',
            ], 422);
        }

        $cart = $request->user()
            ->cart()
            ->firstOrCreate();

        $item = $cart->items()->updateOrCreate(
            [
                'product_id' => $product->id,
            ],
            [
                'quantity' => $validated['quantity'],
                'price' => $product->price,
            ]
        );

        return response()->json([
            'message' => 'Product added to cart',
            'item' => $item->load('product'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = $request->user()->cart;

        $item = $cart->items()->findOrFail($id);

        $item->update([
            'quantity' => $validated['quantity'],
        ]);

        return response()->json([
            'message' => 'Cart updated',
            'item' => $item,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $cart = $request->user()->cart;

        $item = $cart->items()->findOrFail($id);

        $item->delete();

        return response()->json([
            'message' => 'Cart item removed',
        ]);
    }
}
