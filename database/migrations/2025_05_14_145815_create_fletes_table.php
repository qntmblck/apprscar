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

            // 1) Claves foráneas
            $table->foreignId('cliente_principal_id')
                  ->constrained('clientes')
                  ->onDelete('cascade');
            $table->foreignId('destino_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->foreignId('conductor_id')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->foreignId('colaborador_id')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->foreignId('tracto_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->foreignId('rampla_id')
                  ->nullable()
                  ->constrained()
                  ->onDelete('set null');
            $table->foreignId('tarifa_id')
                  ->nullable()
                  ->constrained()
                  ->onDelete('set null');

            // 2) Campos adicionales
            $table->enum('tipo', ['Directo', 'Reparto']);
            $table->enum('estado', ['Sin Notificar', 'Notificado', 'Activo', 'Cerrado'])
                  ->default('Sin Notificar');

            $table->integer('kilometraje')->nullable();
            $table->float('rendimiento')->nullable();

            $table->date('fecha_salida')->nullable();
            $table->date('fecha_llegada')->nullable();

            $table->integer('comision')->default(0);
            $table->integer('retorno')->default(0);
            $table->string('guiaruta')->nullable();

            $table->boolean('pagado')->default(false);

            $table->timestamps();

            // 3) Índices
            $table->index('cliente_principal_id');
            $table->index('destino_id');
            $table->index('conductor_id');
            $table->index('colaborador_id');
            $table->index('tracto_id');
            $table->index('rampla_id');
            $table->index('fecha_salida');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fletes');
    }
};
