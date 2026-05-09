<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CustomerController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
   
    Route::apiResource('products', ProductController::class);
    Route::patch('/products/{product}/toggle', [ProductController::class, 'toggleActive']);

    Route::apiResource('leads', LeadController::class);  

    Route::apiResource('projects', ProjectController::class);

    Route::apiResource('customers', CustomerController::class)->only(['index', 'show']);
});
