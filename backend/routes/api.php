<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController; 

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
   
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::patch('/products/{product}/toggle', [ProductController::class, 'toggleActive']);

    Route::apiResources([
        'products' => ProductController::class,
        'leads'    => LeadController::class,
        'projects' => ProjectController::class,
    ]);

    Route::apiResource('customers', CustomerController::class)->only(['index', 'show']);
});