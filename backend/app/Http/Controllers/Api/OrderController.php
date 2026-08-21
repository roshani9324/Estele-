<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with(['items', 'address'])
            ->latest()
            ->get();

        return OrderResource::collection($orders);
    }

    public function show(Request $request, $id)
    {
        $order = $request->user()
            ->orders()
            ->with(['items.product', 'address'])
            ->findOrFail($id);

        return new OrderResource($order);
    }

    public function store(OrderRequest $request)
    {
        $order = DB::transaction(function () use ($request) {

            $total = 0;

            $order = $request->user()->orders()->create([
                'address_id' => $request->address_id,
                'order_number' => 'EST-' . strtoupper(uniqid()),
                'total' => 0,
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

            foreach ($request->items as $item) {

                $product = Product::findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    abort(422, "Insufficient stock for {$product->name}");
                }

                $itemTotal = $product->price * $item['quantity'];

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'total' => $itemTotal,
                ]);

                $product->decrement('stock', $item['quantity']);

                $total += $itemTotal;
            }

            $order->update([
                'total' => $total,
            ]);

            return $order;
        });

        return new OrderResource(
            $order->load(['items.product', 'address'])
        );
    }
}
