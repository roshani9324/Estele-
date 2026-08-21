<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;

class BlogController extends Controller
{
    public function index()
    {
        return response()->json(
            Blog::where('status', 'published')
                ->latest()
                ->get()
        );
    }

    public function show(string $slug)
    {
        return response()->json(
            Blog::where('slug', $slug)
                ->where('status', 'published')
                ->firstOrFail()
        );
    }
}
