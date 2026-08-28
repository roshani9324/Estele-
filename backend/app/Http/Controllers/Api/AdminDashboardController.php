<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Contact;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $stats = [
            'products' => Product::count(),
            'categories' => Category::count(),
            'collections' => Collection::count(),

            'orders' => Order::count(),

            'customers' => User::where('is_admin', false)->count(),

            'reviews' => Review::count(),
            'blogs' => Blog::count(),

            'newsletter_subscribers' => NewsletterSubscriber::count(),
            'contact_messages' => Contact::count(),

            'revenue' => (float) Order::whereIn('status', [
                'paid',
                'processing',
                'shipped',
                'delivered',
            ])->sum('total'),
        ];

        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer' => $order->user?->name ?? 'Guest',
                'email' => $order->user?->email,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total' => $order->total,
                'created_at' => $order->created_at,
            ]);

        $lowStockProducts = Product::query()
            ->where('stock', '<=', 5)
            ->orderBy('stock')
            ->take(10)
            ->get([
                'id',
                'name',
                'sku',
                'stock',
                'status',
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Dashboard data retrieved successfully.',
            'data' => [
                'stats' => $stats,
                'recent_orders' => $recentOrders,
                'low_stock_products' => $lowStockProducts,
            ],
        ]);
    }
}
