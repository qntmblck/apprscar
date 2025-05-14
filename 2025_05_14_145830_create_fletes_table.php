<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('fletes', function (Blueprint $table) {
            $table->id();

            // Relación con conductor (usuario)
            $table->foreignId('conductor_id')
                ->constrained('users')
                ->onDelete('restrict');

            // Cliente contratante
            $table->foreignId('cliente_principal_id')
                ->constrained('clientes')
                ->onDelete('restrict');

            // Cliente destino (puede ser el mismo u otro)
            $table->foreignId('cliente_destino_id')
                ->constrained('clientes')
                ->onDelete('restrict');

            // Destino principal
            $table->foreignId('destino_id')
                ->constrained()
                ->onDelete('restrict');

            // Retorno (origen de vuelta)
            $table->foreignId('retorno_id')
                ->constrained()
                ->onDelete('restrict');

            // Tracto asignado
            $table->foreignId('tracto_id')
                ->constrained()
                ->onDelete('restrict');

            // Rampla asignada
            $table->foreignId('rampla_id')
                ->constrained()
                ->onDelete('restrict');

            // Tarifa aplicada
            $table->foreignId('tarifa_id')
                ->constrained()
                ->onDelete('restrict');

            // Clase del flete: reparto o directo
            $table->enum('clase', ['reparto', 'directo'])->default('directo');

            // Estado del flete
            $table->string('estado')->default('pendiente');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fletes');
    }
};
