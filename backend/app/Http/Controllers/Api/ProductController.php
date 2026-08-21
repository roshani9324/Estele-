<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with([
            'category',
            'images',
            'variants',
            'collections',
        ])
        ->when($request->filled('search'), function ($query) use ($request) {
            $query->where('name', 'like', '%' . $request->search . '%');
        })
        ->latest()
        ->paginate(12);

        return ProductResource::collection($products);
    }

    public function show(string $slug)
    {
        $product = Product::with([
            'category',
            'images',
            'variants',
            'collections',
            'reviews',
        ])
        ->where('slug', $slug)
        ->firstOrFail();

        return new ProductResource($product);
    }

    public function search(Request $request)
    {
        $request->validate([
            'q' => ['required', 'string', 'min:1'],
        ]);

        $products = Product::with([
            'category',
            'images',
        ])
        ->where('name', 'like', '%' . $request->q . '%')
        ->latest()
        ->paginate(12);

        return ProductResource::collection($products);
    }
}
