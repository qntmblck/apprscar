<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('fletes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('cliente_principal_id')->constrained('clientes')->onDelete('cascade');
            $table->foreignId('destino_id')->constrained()->onDelete('cascade');
            $table->foreignId('conductor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('tracto_id')->constrained()->onDelete('cascade');
            $table->foreignId('rampla_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('tarifa_id')->nullable()->constrained()->onDelete('set null');

            $table->enum('tipo', ['Directo', 'Reparto']);
            $table->enum('estado', ['Sin Notificar', 'Notificado'])->default('Sin Notificar');

            $table->integer('kilometraje')->nullable();
            $table->float('rendimiento')->nullable();

            $table->date('fecha_salida')->nullable();
            $table->date('fecha_llegada')->nullable();

            $table->integer('comision')->default(0); // Manual o desde tarifa
            $table->integer('retorno')->nullable();  // Obligatorio si hay comisión manual
            $table->string('guiaruta')->nullable();  // Número de guía de ruta / carga

            $table->boolean('pagado')->default(false);
            $table->string('periodo')->nullable(); // Ej: Enero, Febrero...

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fletes');
    }
};
