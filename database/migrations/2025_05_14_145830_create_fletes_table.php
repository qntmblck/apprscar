<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('fletes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('conductor_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('cliente_principal_id')->constrained('clientes')->onDelete('restrict');
            $table->foreignId('destino_id')->constrained('destinos')->onDelete('restrict');
            $table->foreignId('retorno_id')->nullable()->constrained('retornos')->onDelete('set null');
            $table->foreignId('tarifa_id')->nullable()->constrained('tarifas')->onDelete('set null');
            $table->foreignId('tracto_id')->nullable()->constrained('tractos')->onDelete('set null');
            $table->foreignId('rampla_id')->nullable()->constrained('ramplas')->onDelete('set null');

            $table->date('fecha_salida')->nullable();
            $table->date('fecha_llegada')->nullable();
            $table->string('estado')->default('pendiente');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fletes');
    }
};
