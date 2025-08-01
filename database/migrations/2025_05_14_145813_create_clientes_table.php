<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->string('razon_social');
            $table->string('rut');
            $table->string('giro');
            $table->string('direccion');
            $table->string('telefono');

            $table->timestamps();

            // ─── Índices para búsquedas en clientes ───────────────────────────
            $table->index('user_id');
            $table->unique('rut');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
