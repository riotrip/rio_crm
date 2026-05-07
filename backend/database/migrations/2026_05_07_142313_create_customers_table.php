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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_lead')->unique()->nullable()->constrained('leads')->onDelete('set null');
            $table->foreignId('id_project')->unique()->nullable()->constrained('projects')->onDelete('set null');
            $table->foreignId('id_sales')->constrained('users')->onDelete('restrict');
            $table->string('name', 100);
            $table->string('contact', 100)->nullable();
            $table->text('address')->nullable();
            $table->date('joined_at')->index();
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
