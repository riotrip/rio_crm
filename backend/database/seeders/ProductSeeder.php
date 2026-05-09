<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'code' => 'INET-50',
                'name' => 'Paket Internet 50Mbps',
                'description' => 'Home Fiber Internet 50Mbps - Unlimited',
                'hpp' => 150000,
                'margin' => 10,
                'selling_price' => 250000,
                'is_active' => true,
            ],
            [
                'code' => 'INET-100',
                'name' => 'Paket Internet 100Mbps',
                'description' => 'Home Fiber Internet 100Mbps - Unlimited',
                'hpp' => 250000,
                'margin' => 15,
                'selling_price' => 400000,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}