<?php

namespace Database\Seeders;

use App\Models\Lead;
use Illuminate\Database\Seeder;

class LeadSeeder extends Seeder
{
    public function run(): void
    {
        Lead::create([
            'id_sales' => 2,
            'name' => 'PT. Teknologi Maju',
            'contact' => '08123456789',
            'address' => 'Jakarta Selatan',
            'requirement' => 'Pengadaan Laptop 50 Unit',
            'status' => 'new',
        ]);

        Lead::create([
            'id_sales' => 2,
            'name' => 'CV. Sinar Abadi',
            'contact' => '08998877665',
            'address' => 'Surabaya',
            'requirement' => 'Maintenance Server',
            'status' => 'deal',
        ]);

        Lead::create([
            'id_sales' => 3,
            'name' => 'Toko Berkah Jaya',
            'contact' => '08554433221',
            'address' => 'Malang',
            'requirement' => 'Aplikasi POS Custom',
            'status' => 'contacted',
        ]);
    }
}