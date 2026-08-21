<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use Illuminate\Support\Str;

class ImportEsteleProducts extends Command
{
    protected $signature = 'estele:import-products
                            {--limit=50 : Maximum number of products to process}';

    protected $description = 'Import actual products from Estele website';

    public function handle()
    {
        $limit = (int) $this->option('limit');

        $this->info('Connecting to Estele website...');

        $url = 'https://estele.co/products.json?limit=250';

        try {
            $response = Http::timeout(30)
                ->retry(3, 1000)
                ->get($url);

            if (!$response->successful()) {
                $this->error(
                    'Unable to fetch products. HTTP Status: ' .
                    $response->status()
                );

                return self::FAILURE;
            }

            $data = $response->json();

            if (!isset($data['products'])) {
                $this->error('Products data was not found in the response.');

                return self::FAILURE;
            }

            $products = collect($data['products'])
                ->take($limit);

            $this->info(
                'Found ' . $products->count() . ' products to process.'
            );

            $imported = 0;
            $skipped = 0;

            foreach ($products as $item) {

                if (empty($item['title'])) {
                    continue;
                }

                /*
                |--------------------------------------------------------------------------
                | Category
                |--------------------------------------------------------------------------
                */

                $categoryName = 'Uncategorized';

                if (!empty($item['product_type'])) {
                    $categoryName = $item['product_type'];
                }

                $category = Category::firstOrCreate(
                    [
                        'slug' => Str::slug($categoryName),
                    ],
                    [
                        'name' => $categoryName,
                    ]
                );

                /*
                |--------------------------------------------------------------------------
                | Product data
                |--------------------------------------------------------------------------
                */

                $variant = $item['variants'][0] ?? [];

                $price = $variant['price'] ?? 0;
                $sku = $variant['sku'] ?? null;
                $slug = $item['handle'] ?? Str::slug($item['title']);

                /*
                |--------------------------------------------------------------------------
                | Duplicate SKU protection
                |--------------------------------------------------------------------------
                |
                | If Estele has another product with the same SKU,
                | don't create fake SKU. Simply skip that product.
                |
                */

                if (!empty($sku)) {

                    $existingProduct = Product::where('sku', $sku)
                        ->where('slug', '!=', $slug)
                        ->first();

                    if ($existingProduct) {

                        $skipped++;

                        $this->warn(
                            "Skipped duplicate SKU: {$sku} | {$item['title']}"
                        );

                        continue;
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Product
                |--------------------------------------------------------------------------
                */

                $product = Product::updateOrCreate(
                    [
                        'slug' => $slug,
                    ],
                    [
                        'category_id' => $category->id,
                        'name' => $item['title'],
                        'slug' => $slug,
                        'sku' => $sku,
                        'description' => $item['body_html'] ?? null,
                        'price' => $price,
                        'mrp' => $price,
                        'stock' => 0,
                        'status' => 'active',
                    ]
                );

                /*
                |--------------------------------------------------------------------------
                | Product Images
                |--------------------------------------------------------------------------
                */

                if (!empty($item['images'])) {

                    foreach ($item['images'] as $index => $image) {

                        $imageUrl = $image['src'] ?? null;

                        if (!$imageUrl) {
                            continue;
                        }

                        ProductImage::updateOrCreate(
                            [
                                'product_id' => $product->id,
                                'image_url' => $imageUrl,
                            ],
                            [
                                'sort_order' => $index,
                            ]
                        );
                    }
                }

                $imported++;

                $this->line(
                    "Imported: {$product->name}"
                );
            }

            $this->newLine();

            $this->info(
                "Import completed."
            );

            $this->info(
                "Products imported/updated: {$imported}"
            );

            $this->info(
                "Products skipped because of duplicate SKU: {$skipped}"
            );

            return self::SUCCESS;

        } catch (\Throwable $e) {

            $this->error('Import failed.');
            $this->error($e->getMessage());

            return self::FAILURE;
        }
    }
}
