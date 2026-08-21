<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CollectionResource;
use App\Models\Collection;

class CollectionController extends Controller
{
    public function index()
    {
        $collections = Collection::withCount('products')
            ->latest()
            ->get();

        return CollectionResource::collection($collections);
    }

    public function show(string $slug)
    {
        $collection = Collection::with([
            'products.images',
            'products.category',
        ])
        ->where('slug', $slug)
        ->firstOrFail();

        return new CollectionResource($collection);
    }
}
