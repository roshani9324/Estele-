<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = Product::with([
            'category',
            'images',
            'variants',
            'collections',
        ])
        ->when($request->filled('search'), function ($query) use ($request) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        })
        ->when($request->filled('category_id'), function ($query) use ($request) {
            $query->where('category_id', $request->category_id);
        })
        ->when($request->filled('status'), function ($query) use ($request) {
            $query->where('status', $request->status);
        })
        ->latest()
        ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'mrp' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'string', 'max:50'],

            'images' => ['nullable', 'array'],
            'images.*.image_url' => ['required', 'string', 'max:2048'],
            'images.*.sort_order' => ['nullable', 'integer', 'min:0'],

            'variants' => ['nullable', 'array'],
            'variants.*.name' => ['required', 'string', 'max:255'],
            'variants.*.sku' => ['nullable', 'string', 'max:255', 'unique:product_variants,sku'],
            'variants.*.price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock' => ['nullable', 'integer', 'min:0'],

            'collection_ids' => ['nullable', 'array'],
            'collection_ids.*' => ['integer', 'exists:collections,id'],
        ]);

        $product = DB::transaction(function () use ($validated) {
            $product = Product::create([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'slug' => $validated['slug'] ?? Str::slug($validated['name']),
                'sku' => $validated['sku'],
                'description' => $validated['description'] ?? null,
                'price' => $validated['price'],
                'mrp' => $validated['mrp'] ?? null,
                'stock' => $validated['stock'],
                'status' => $validated['status'],
            ]);

            foreach ($validated['images'] ?? [] as $image) {
                $product->images()->create([
                    'image_url' => $image['image_url'],
                    'sort_order' => $image['sort_order'] ?? 0,
                ]);
            }

            foreach ($validated['variants'] ?? [] as $variant) {
                $product->variants()->create([
                    'name' => $variant['name'],
                    'sku' => $variant['sku'] ?? null,
                    'price' => $variant['price'] ?? null,
                    'stock' => $variant['stock'] ?? 0,
                ]);
            }

            if (!empty($validated['collection_ids'])) {
                $product->collections()->sync($validated['collection_ids']);
            }

            return $product;
        });

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully.',
            'data' => $product->load([
                'category',
                'images',
                'variants',
                'collections',
            ]),
        ], 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $product->load([
                'category',
                'images',
                'variants',
                'collections',
                'reviews.user',
            ]),
        ]);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'slug')->ignore($product->id),
            ],
            'sku' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'sku')->ignore($product->id),
            ],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'mrp' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'status' => ['sometimes', 'required', 'string', 'max:50'],

            'images' => ['nullable', 'array'],
            'images.*.image_url' => ['required', 'string', 'max:2048'],
            'images.*.sort_order' => ['nullable', 'integer', 'min:0'],

            'variants' => ['nullable', 'array'],
            'variants.*.name' => ['required', 'string', 'max:255'],
            'variants.*.sku' => ['nullable', 'string', 'max:255'],
            'variants.*.price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock' => ['nullable', 'integer', 'min:0'],

            'collection_ids' => ['nullable', 'array'],
            'collection_ids.*' => ['integer', 'exists:collections,id'],
        ]);

        DB::transaction(function () use ($product, $validated) {
            $product->update(collect($validated)
                ->except([
                    'images',
                    'variants',
                    'collection_ids',
                ])
                ->toArray());

            if (array_key_exists('images', $validated)) {
                $product->images()->delete();

                foreach ($validated['images'] ?? [] as $image) {
                    $product->images()->create([
                        'image_url' => $image['image_url'],
                        'sort_order' => $image['sort_order'] ?? 0,
                    ]);
                }
            }

            if (array_key_exists('variants', $validated)) {
                $product->variants()->delete();

                foreach ($validated['variants'] ?? [] as $variant) {
                    $product->variants()->create([
                        'name' => $variant['name'],
                        'sku' => $variant['sku'] ?? null,
                        'price' => $variant['price'] ?? null,
                        'stock' => $variant['stock'] ?? 0,
                    ]);
                }
            }

            if (array_key_exists('collection_ids', $validated)) {
                $product->collections()->sync(
                    $validated['collection_ids'] ?? []
                );
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully.',
            'data' => $product->fresh()->load([
                'category',
                'images',
                'variants',
                'collections',
            ]),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        try {
            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully.',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product cannot be deleted because it is used in existing orders.',
            ], 409);
        }
    }
}
