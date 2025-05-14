<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fletes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('conductor_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('cliente_principal_id')->constrained('clientes')->onDelete('restrict');
            $table->foreignId('tracto_id')->constrained()->onDelete('restrict');
            $table->foreignId('rampla_id')->constrained()->onDelete('restrict');
            $table->foreignId('destino_id')->constrained()->onDelete('restrict');
            $table->foreignId('tarifa_id')->constrained()->onDelete('restrict');

            $table->string('tipo'); // Reparto o Directo
            $table->integer('km_ida');
            $table->float('rendimiento')->nullable();
            $table->string('estado')->default('pendiente');
            $table->timestamp('fecha_salida')->nullable();
            $table->timestamp('fecha_llegada')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fletes');
    }
};
