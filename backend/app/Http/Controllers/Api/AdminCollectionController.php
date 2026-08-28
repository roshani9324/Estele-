<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class AdminCollectionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $collections = Collection::withCount('products')
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $collections,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:collections,slug'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:2048'],
            'product_ids' => ['nullable', 'array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
        ]);

        $collection = Collection::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'] ?? Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'image' => $validated['image'] ?? null,
        ]);

        $collection->products()->sync($validated['product_ids'] ?? []);

        return response()->json([
            'success' => true,
            'message' => 'Collection created successfully.',
            'data' => $collection->load('products'),
        ], 201);
    }

    public function show(Collection $collection): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $collection->load('products.images'),
        ]);
    }

    public function update(Request $request, Collection $collection): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('collections', 'slug')->ignore($collection->id),
            ],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:2048'],
            'product_ids' => ['nullable', 'array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
        ]);

        $collection->update(
            collect($validated)
                ->except('product_ids')
                ->toArray()
        );

        if (array_key_exists('product_ids', $validated)) {
            $collection->products()->sync($validated['product_ids'] ?? []);
        }

        return response()->json([
            'success' => true,
            'message' => 'Collection updated successfully.',
            'data' => $collection->fresh()->load('products'),
        ]);
    }

    public function destroy(Collection $collection): JsonResponse
    {
        $collection->products()->detach();
        $collection->delete();

        return response()->json([
            'success' => true,
            'message' => 'Collection deleted successfully.',
        ]);
    }
}
