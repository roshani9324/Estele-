<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $customers = User::query()
            ->where('is_admin', false)
            ->withCount('orders')
            ->withSum('orders', 'total')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;

                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $customers,
        ]);
    }

    public function show(User $customer): JsonResponse
    {
        if ($customer->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin users are not customer records.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'data' => $customer->load([
                'orders.items.product',
                'addresses',
                'reviews.product',
            ]),
        ]);
    }
}
