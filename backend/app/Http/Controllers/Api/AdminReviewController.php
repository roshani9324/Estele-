<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $reviews = Review::with([
            'user:id,name,email',
            'product:id,name,slug',
        ])
        ->when($request->filled('status'), function ($query) use ($request) {
            $query->where('status', $request->status);
        })
        ->when($request->filled('rating'), function ($query) use ($request) {
            $query->where('rating', $request->rating);
        })
        ->latest()
        ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ]);
    }

    public function show(Review $review): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $review->load([
                'user',
                'product',
            ]),
        ]);
    }

    public function updateStatus(
        Request $request,
        Review $review
    ): JsonResponse {
        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                Rule::in([
                    'pending',
                    'approved',
                    'rejected',
                ]),
            ],
        ]);

        $review->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review status updated successfully.',
            'data' => $review->fresh(),
        ]);
    }

    public function destroy(Review $review): JsonResponse
    {
        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully.',
        ]);
    }
}
