<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CollectionController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\HomeController;

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminProductController;
use App\Http\Controllers\Api\AdminCategoryController;
use App\Http\Controllers\Api\AdminCollectionController;
use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\AdminCustomerController;
use App\Http\Controllers\Api\AdminReviewController;
use App\Http\Controllers\Api\AdminBlogController;
use App\Http\Controllers\Api\AdminNewsletterController;
use App\Http\Controllers\Api\AdminContactController;
use App\Http\Controllers\Api\AdminStoreController;


/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/home', [HomeController::class, 'index']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

Route::get('/collections', [CollectionController::class, 'index']);
Route::get('/collections/{slug}', [CollectionController::class, 'show']);

Route::get('/search', [ProductController::class, 'search']);

Route::get(
    '/products/{product}/reviews',
    [ReviewController::class, 'index']
);

Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{slug}', [BlogController::class, 'show']);

Route::post('/contact', [ContactController::class, 'store']);
Route::post('/newsletter', [NewsletterController::class, 'store']);

Route::get('/stores', [StoreController::class, 'index']);


/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
*/

Route::post('/admin/login', [
    AdminAuthController::class,
    'login'
]);


/*
|--------------------------------------------------------------------------
| CUSTOMER PROTECTED ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [
        AuthController::class,
        'logout'
    ]);

    Route::get('/user', [
        AuthController::class,
        'user'
    ]);

    /*
    | Cart
    */

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    /*
    | Wishlist
    */

    Route::get('/wishlist', [
        WishlistController::class,
        'index'
    ]);

    Route::post('/wishlist', [
        WishlistController::class,
        'store'
    ]);

    Route::delete('/wishlist/{product}', [
        WishlistController::class,
        'destroy'
    ]);

    /*
    | Customer Orders
    */

    Route::get('/orders', [
        OrderController::class,
        'index'
    ]);

    Route::get('/orders/{id}', [
        OrderController::class,
        'show'
    ]);

    Route::post('/orders', [
        OrderController::class,
        'store'
    ]);

    /*
    | Customer Reviews
    */

    Route::post(
        '/products/{product}/reviews',
        [ReviewController::class, 'store']
    );
});


/*
|--------------------------------------------------------------------------
| ADMIN PROTECTED ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'admin',
])
->prefix('admin')
->group(function () {

    /*
    | Authentication
    */

    Route::get('/me', [
        AdminAuthController::class,
        'me'
    ]);

    Route::post('/logout', [
        AdminAuthController::class,
        'logout'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', [
        AdminDashboardController::class,
        'index'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Products
    |--------------------------------------------------------------------------
    */

    Route::get('/products', [
        AdminProductController::class,
        'index'
    ]);

    Route::post('/products', [
        AdminProductController::class,
        'store'
    ]);

    Route::get('/products/{product}', [
        AdminProductController::class,
        'show'
    ]);

    Route::put('/products/{product}', [
        AdminProductController::class,
        'update'
    ]);

    Route::delete('/products/{product}', [
        AdminProductController::class,
        'destroy'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    Route::get('/categories', [
        AdminCategoryController::class,
        'index'
    ]);

    Route::post('/categories', [
        AdminCategoryController::class,
        'store'
    ]);

    Route::get('/categories/{category}', [
        AdminCategoryController::class,
        'show'
    ]);

    Route::put('/categories/{category}', [
        AdminCategoryController::class,
        'update'
    ]);

    Route::delete('/categories/{category}', [
        AdminCategoryController::class,
        'destroy'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Collections
    |--------------------------------------------------------------------------
    */

    Route::get('/collections', [
        AdminCollectionController::class,
        'index'
    ]);

    Route::post('/collections', [
        AdminCollectionController::class,
        'store'
    ]);

    Route::get('/collections/{collection}', [
        AdminCollectionController::class,
        'show'
    ]);

    Route::put('/collections/{collection}', [
        AdminCollectionController::class,
        'update'
    ]);

    Route::delete('/collections/{collection}', [
        AdminCollectionController::class,
        'destroy'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Orders
    |--------------------------------------------------------------------------
    */

    Route::get('/orders', [
        AdminOrderController::class,
        'index'
    ]);

    Route::get('/orders/{order}', [
        AdminOrderController::class,
        'show'
    ]);

    Route::patch('/orders/{order}/status', [
        AdminOrderController::class,
        'updateStatus'
    ]);

    Route::patch('/orders/{order}/payment-status', [
        AdminOrderController::class,
        'updatePaymentStatus'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Customers
    |--------------------------------------------------------------------------
    */

    Route::get('/customers', [
        AdminCustomerController::class,
        'index'
    ]);

    Route::get('/customers/{customer}', [
        AdminCustomerController::class,
        'show'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Reviews
    |--------------------------------------------------------------------------
    */

    Route::get('/reviews', [
        AdminReviewController::class,
        'index'
    ]);

    Route::get('/reviews/{review}', [
        AdminReviewController::class,
        'show'
    ]);

    Route::patch('/reviews/{review}/status', [
        AdminReviewController::class,
        'updateStatus'
    ]);

    Route::delete('/reviews/{review}', [
        AdminReviewController::class,
        'destroy'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Blogs
    |--------------------------------------------------------------------------
    */

    Route::get('/blogs', [
        AdminBlogController::class,
        'index'
    ]);

    Route::post('/blogs', [
        AdminBlogController::class,
        'store'
    ]);

    Route::get('/blogs/{blog}', [
        AdminBlogController::class,
        'show'
    ]);

    Route::put('/blogs/{blog}', [
        AdminBlogController::class,
        'update'
    ]);

    Route::delete('/blogs/{blog}', [
        AdminBlogController::class,
        'destroy'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Newsletter
    |--------------------------------------------------------------------------
    */

    Route::get('/newsletter', [
        AdminNewsletterController::class,
        'index'
    ]);

    Route::get('/newsletter/export', [
        AdminNewsletterController::class,
        'export'
    ]);

    Route::delete('/newsletter/{subscriber}', [
        AdminNewsletterController::class,
        'destroy'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Contact Messages
    |--------------------------------------------------------------------------
    */

    Route::get('/contacts', [
        AdminContactController::class,
        'index'
    ]);

    Route::get('/contacts/{contact}', [
        AdminContactController::class,
        'show'
    ]);

    Route::delete('/contacts/{contact}', [
        AdminContactController::class,
        'destroy'
    ]);


    /*
    |--------------------------------------------------------------------------
    | Stores
    |--------------------------------------------------------------------------
    */

    Route::get('/stores', [
        AdminStoreController::class,
        'index'
    ]);

    Route::post('/stores', [
        AdminStoreController::class,
        'store'
    ]);

    Route::get('/stores/{store}', [
        AdminStoreController::class,
        'show'
    ]);

    Route::put('/stores/{store}', [
        AdminStoreController::class,
        'update'
    ]);

    Route::delete('/stores/{store}', [
        AdminStoreController::class,
        'destroy'
    ]);
});
