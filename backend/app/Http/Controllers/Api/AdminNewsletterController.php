<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminNewsletterController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $subscribers = NewsletterSubscriber::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(
                    'email',
                    'like',
                    '%' . $request->search . '%'
                );
            })
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $subscribers,
        ]);
    }

    public function destroy(
        NewsletterSubscriber $subscriber
    ): JsonResponse {
        $subscriber->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subscriber deleted successfully.',
        ]);
    }

    public function export()
    {
        $subscribers = NewsletterSubscriber::latest()->get();

        return response()->streamDownload(function () use ($subscribers) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'ID',
                'Email',
                'Subscribed At',
            ]);

            foreach ($subscribers as $subscriber) {
                fputcsv($handle, [
                    $subscriber->id,
                    $subscriber->email,
                    $subscriber->created_at,
                ]);
            }

            fclose($handle);
        }, 'newsletter-subscribers.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
