<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function index(): JsonResponse
    {
        /*
        |--------------------------------------------------------------------------
        | Categories
        |--------------------------------------------------------------------------
        */

        $categories = Category::query()
            ->withCount('products')
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'products_count' => $category->products_count,
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | Collections
        |--------------------------------------------------------------------------
        */

        $collections = Collection::query()
            ->withCount('products')
            ->has('products')
            ->orderBy('name')
            ->get()
            ->map(function ($collection) {
                return [
                    'id' => $collection->id,
                    'name' => $collection->name,
                    'slug' => $collection->slug,
                    'description' => $collection->description,
                    'image' => $collection->image,
                    'products_count' => $collection->products_count,
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | Products
        |--------------------------------------------------------------------------
        */

        $products = Product::query()
            ->with(['images', 'category'])
            ->where('status', 'active')
            ->latest()
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'sku' => $product->sku,
                    'description' => $product->description,
                    'price' => $product->price,
                    'mrp' => $product->mrp,
                    'stock' => $product->stock,

                    'category' => $product->category
                        ? [
                            'id' => $product->category->id,
                            'name' => $product->category->name,
                            'slug' => $product->category->slug,
                        ]
                        : null,

                    'images' => $product->images
                        ->sortBy('sort_order')
                        ->values()
                        ->map(function ($image) {
                            return [
                                'url' => $image->image_url,
                                'sort_order' => $image->sort_order,
                            ];
                        }),
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | Home Response
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,

            'data' => [
                'categories' => $categories,
                'collections' => $collections,
                'products' => $products,
            ],
        ]);
    }
}
