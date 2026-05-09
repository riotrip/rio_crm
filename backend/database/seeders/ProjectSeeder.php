<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectItem;
use App\Models\Lead;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $lead = Lead::where('status', '!=', 'deal')->first();
        $product = Product::where('is_active', true)->first();

        if ($lead && $product) {
            $project = Project::create([
                'id_lead' => $lead->id,
                'id_sales' => $lead->id_sales,
                'status' => 'process',
                'notes' => 'Pengajuan pengadaan awal untuk ' . $lead->name,
            ]);

            ProjectItem::create([
                'id_project' => $project->id,
                'id_product' => $product->id,
                'qty' => 5,
                'selling_price' => $product->selling_price,
                'nego_price' => $product->selling_price, 
                'needs_approval' => 0
            ]);
        }
    }
}