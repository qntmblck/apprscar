<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('solicitudes_transporte', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('origin', 150);
            $table->string('destination', 150);
            $table->string('cargo_type', 100);
            $table->unsignedInteger('cargo_weight_kg')->nullable();

            $table->date('pickup_date')->nullable();
            $table->text('description')->nullable();

            $table->string('contact_phone', 20);
            $table->string('contact_email', 120);

            $table->string('status', 20)->default('pending');
            $table->text('admin_notes')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitudes_transporte');
    }
};
