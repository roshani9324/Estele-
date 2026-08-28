<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class AdminBlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $blogs = Blog::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%');
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $blogs,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:blogs,slug'],
            'content' => ['required', 'string'],
            'image' => ['nullable', 'string', 'max:2048'],
            'status' => ['required', 'string', 'max:50'],
        ]);

        $blog = Blog::create([
            'title' => $validated['title'],
            'slug' => $validated['slug'] ?? Str::slug($validated['title']),
            'content' => $validated['content'],
            'image' => $validated['image'] ?? null,
            'status' => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Blog created successfully.',
            'data' => $blog,
        ], 201);
    }

    public function show(Blog $blog): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $blog,
        ]);
    }

    public function update(Request $request, Blog $blog): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('blogs', 'slug')->ignore($blog->id),
            ],
            'content' => ['sometimes', 'required', 'string'],
            'image' => ['nullable', 'string', 'max:2048'],
            'status' => ['sometimes', 'required', 'string', 'max:50'],
        ]);

        $blog->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Blog updated successfully.',
            'data' => $blog->fresh(),
        ]);
    }

    public function destroy(Blog $blog): JsonResponse
    {
        $blog->delete();

        return response()->json([
            'success' => true,
            'message' => 'Blog deleted successfully.',
        ]);
    }
}
