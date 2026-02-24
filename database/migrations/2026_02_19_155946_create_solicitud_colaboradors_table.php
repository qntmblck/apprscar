<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('solicitudes_colaborador', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('company_name', 150);
            $table->string('contact_name', 120);
            $table->string('email', 120);
            $table->string('phone', 20);

            $table->string('fleet_size', 50)->nullable();
            $table->string('fleet_types', 200)->nullable();
            $table->string('coverage', 200)->nullable();

            $table->text('message');

            $table->string('status', 20)->default('pending');
            $table->text('admin_notes')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitudes_colaborador');
    }
};
