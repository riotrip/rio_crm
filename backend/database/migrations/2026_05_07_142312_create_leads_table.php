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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_sales')->constrained('users')->onDelete('cascade');
            $table->string('name', 100);
            $table->string('contact', 100);
            $table->text('address')->nullable();
            $table->text('requirement')->nullable();
            $table->enum('status', ['new', 'contacted', 'qualified', 'deal', 'lost'])->default('new')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
