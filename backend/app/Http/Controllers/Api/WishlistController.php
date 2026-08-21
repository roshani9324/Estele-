<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlist = $request->user()
            ->wishlist()
            ->with('items.product.images')
            ->first();

        if (!$wishlist) {
            return response()->json([
                'items' => [],
                'message' => 'Wishlist is empty',
            ]);
        }

        return response()->json($wishlist);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
        ]);

        $wishlist = $request->user()
            ->wishlist()
            ->firstOrCreate();

        $item = $wishlist->items()->firstOrCreate([
            'product_id' => $validated['product_id'],
        ]);

        return response()->json([
            'message' => 'Product added to wishlist',
            'item' => $item->load('product'),
        ], 201);
    }

    public function destroy(Request $request, $product)
    {
        $wishlist = $request->user()->wishlist;

        if (!$wishlist) {
            return response()->json([
                'message' => 'Wishlist is empty',
            ], 404);
        }

        $wishlist->items()
            ->where('product_id', $product)
            ->delete();

        return response()->json([
            'message' => 'Product removed from wishlist',
        ]);
    }
}
