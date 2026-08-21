<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Collection;
use App\Models\Product;

class ImportEsteleCollections extends Command
{
    protected $signature = 'estele:import-collections
                            {--limit=250 : Maximum number of collections to process}';

    protected $description = 'Import actual collections and their products from Estele website';

    public function handle()
    {
        $limit = (int) $this->option('limit');

        $this->info('Connecting to Estele collections...');

        $url = 'https://estele.co/collections.json?limit=250';

        try {

            /*
            |--------------------------------------------------------------------------
            | Fetch Collections
            |--------------------------------------------------------------------------
            */

            $response = Http::timeout(30)
                ->retry(3, 1000)
                ->get($url);

            if (!$response->successful()) {

                $this->error(
                    'Unable to fetch collections. HTTP Status: ' .
                    $response->status()
                );

                return self::FAILURE;
            }

            $data = $response->json();

            if (empty($data['collections'])) {

                $this->error(
                    'Collections data was not found in the response.'
                );

                return self::FAILURE;
            }

            $collections = collect($data['collections'])
                ->take($limit);

            $this->info(
                'Found ' . $collections->count() . ' collections.'
            );

            $processed = 0;
            $mappedProducts = 0;

            /*
            |--------------------------------------------------------------------------
            | Process Each Collection
            |--------------------------------------------------------------------------
            */

            foreach ($collections as $item) {

                if (
                    empty($item['title']) ||
                    empty($item['handle'])
                ) {
                    continue;
                }

                /*
                |--------------------------------------------------------------------------
                | Create / Update Collection
                |--------------------------------------------------------------------------
                */

                $collection = Collection::updateOrCreate(
                    [
                        'slug' => $item['handle'],
                    ],
                    [
                        'name' => $item['title'],
                        'description' => $item['body_html'] ?? null,
                        'image' => $item['image']['src'] ?? null,
                    ]
                );

                $this->line(
                    "Collection: {$collection->name}"
                );

                /*
                |--------------------------------------------------------------------------
                | Fetch Products Belonging To Collection
                |--------------------------------------------------------------------------
                */

                $productsUrl =
                    'https://estele.co/collections/' .
                    $item['handle'] .
                    '/products.json?limit=250';

                $productResponse = Http::timeout(30)
                    ->retry(3, 1000)
                    ->get($productsUrl);

                if (!$productResponse->successful()) {

                    $this->warn(
                        "Could not fetch products for: {$collection->name}"
                    );

                    $processed++;

                    continue;
                }

                $productData = $productResponse->json();

                if (empty($productData['products'])) {

                    $this->warn(
                        "No products returned for: {$collection->name}"
                    );

                    $processed++;

                    continue;
                }

                /*
                |--------------------------------------------------------------------------
                | Match Remote Products With Existing DB Products
                |--------------------------------------------------------------------------
                */

                $productIds = [];

                foreach ($productData['products'] as $remoteProduct) {

                    $handle = $remoteProduct['handle'] ?? null;

                    if (!$handle) {
                        continue;
                    }

                    /*
                    | Existing products were imported using Shopify handle
                    | as their slug, so match using slug.
                    */

                    $product = Product::where(
                        'slug',
                        $handle
                    )->first();

                    if ($product) {

                        $productIds[] = $product->id;

                        $mappedProducts++;
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Attach Products To Collection
                |--------------------------------------------------------------------------
                */

                if (!empty($productIds)) {

                    $collection
                        ->products()
                        ->syncWithoutDetaching(
                            array_unique($productIds)
                        );

                    $this->info(
                        '  → Mapped ' .
                        count(array_unique($productIds)) .
                        ' products'
                    );

                } else {

                    $this->warn(
                        '  → No existing products matched'
                    );
                }

                $processed++;
            }

            /*
            |--------------------------------------------------------------------------
            | Final Result
            |--------------------------------------------------------------------------
            */

            $this->newLine();

            $this->info(
                '=============================================='
            );

            $this->info(
                'Collection import completed successfully.'
            );

            $this->info(
                'Collections processed: ' . $processed
            );

            $this->info(
                'Products mapped: ' . $mappedProducts
            );

            $this->info(
                '=============================================='
            );

            return self::SUCCESS;

        } catch (\Throwable $e) {

            $this->error(
                'Collection import failed.'
            );

            $this->error(
                $e->getMessage()
            );

            return self::FAILURE;
        }
    }
}
