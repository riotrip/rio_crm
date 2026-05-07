<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_project')->constrained('projects')->onDelete('cascade');
            $table->foreignId('id_product')->constrained('products')->onDelete('restrict');
            $table->integer('qty')->default(1);
            $table->decimal('selling_price', 15, 2);
            $table->decimal('nego_price', 15, 2);
            $table->tinyInteger('needs_approval')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_items');
    }
};
