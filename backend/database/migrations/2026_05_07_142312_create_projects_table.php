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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_lead')->constrained('leads')->onDelete('cascade');
            $table->foreignId('id_sales')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['process', 'waiting_approval', 'approved', 'rejected'])->default('process')->index();
            $table->text('notes')->nullable();
            $table->foreignId('id_approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
