<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    /**
     * Admin Dashboard Statistics
     */
    public function index(Request $request): JsonResponse
    {
        $stats = [
            'products' => Product::count(),
            'categories' => Category::count(),
            'collections' => Collection::count(),
            'orders' => Order::count(),
            'customers' => User::where('is_admin', false)->count(),
            'reviews' => Review::count(),
            'blogs' => Blog::count(),
        ];

        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer' => $order->user?->name ?? 'Guest',
                    'email' => $order->user?->email ?? null,
                    'status' => $order->status ?? 'Pending',
                    'total' => $order->total ?? 0,
                    'created_at' => $order->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Admin dashboard data retrieved successfully.',
            'data' => [
                'stats' => $stats,
                'recent_orders' => $recentOrders,
            ],
        ]);
    }
}
