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

            // ─── Claves foráneas (nullable + nullOnDelete) ──────────────
            $table->foreignId('cliente_principal_id')
                  ->nullable()
                  ->constrained('clientes')
                  ->nullOnDelete();
            $table->string('cliente_nombre')->nullable();

            $table->foreignId('conductor_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
            $table->string('conductor_nombre')->nullable();

            $table->foreignId('colaborador_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
            $table->string('colaborador_nombre')->nullable();

            $table->foreignId('tarifa_id')
                  ->nullable()
                  ->constrained('tarifas')
                  ->nullOnDelete();
            $table->decimal('tarifa_valor', 12, 2)->nullable();

            $table->foreignId('destino_id')
                  ->constrained('destinos')
                  ->cascadeOnDelete();

            $table->foreignId('tracto_id')
                  ->constrained('tractos')
                  ->cascadeOnDelete();

            $table->foreignId('rampla_id')
                  ->nullable()
                  ->constrained('ramplas')
                  ->nullOnDelete();

            // ─── Atributos del flete ────────────────────────────────────
            $table->enum('tipo', ['Directo', 'Reparto'])->default('Directo');
            $table->enum('estado', ['Sin Notificar', 'Notificado', 'Activo', 'Cerrado'])
                  ->default('Sin Notificar');

            $table->integer('kilometraje')->nullable();
            $table->float('rendimiento', 8, 2)->nullable();

            $table->date('fecha_salida')->nullable();
            $table->date('fecha_llegada')->nullable();

            $table->integer('comision')->default(0);
            $table->integer('valor_factura')->default(0);
            $table->integer('utilidad')->default(0);
            $table->string('retorno')->nullable(); // antes era boolean
            $table->string('guiaruta')->nullable();

            $table->boolean('pagado')->default(false);
            $table->json('adicionales')->nullable();

            $table->timestamps();

            // ─── Índices ─────────────────────────────────────────────────
            $table->index('fecha_salida');
            $table->index(['cliente_principal_id', 'conductor_id', 'colaborador_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fletes');
    }
};
