<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'description' => $this->description,
            'price' => $this->price,
            'mrp' => $this->mrp,
            'stock' => $this->stock,
            'status' => $this->status,

            'category' => $this->whenLoaded('category'),
            'images' => $this->whenLoaded('images'),
            'variants' => $this->whenLoaded('variants'),
            'collections' => $this->whenLoaded('collections'),
            'reviews' => $this->whenLoaded('reviews'),
        ];
    }
}
