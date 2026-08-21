<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            Category::withCount('products')->latest()->get()
        );
    }

    public function show(string $slug)
    {
        $category = Category::with([
            'products.images',
            'products.category',
        ])
        ->where('slug', $slug)
        ->firstOrFail();

        return response()->json($category);
    }
}
