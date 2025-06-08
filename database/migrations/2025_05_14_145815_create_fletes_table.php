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

            // 1) Claves foráneas: mantenemos exactamente esos campos
            $table->foreignId('cliente_principal_id')
                  ->constrained('clientes')
                  ->onDelete('cascade');
            $table->foreignId('destino_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->foreignId('conductor_id')
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

            // 2) Campos adicionales tal como estaban
            $table->enum('tipo', ['Directo', 'Reparto']);
            $table->enum('estado', ['Sin Notificar', 'Notificado'])
                  ->default('Sin Notificar');

            $table->integer('kilometraje')->nullable();
            $table->float('rendimiento')->nullable();

            $table->date('fecha_salida')->nullable();
            $table->date('fecha_llegada')->nullable();

            $table->integer('comision')->default(0);
            $table->integer('retorno')->nullable();
            $table->string('guiaruta')->nullable();

            $table->boolean('pagado')->default(false);
            $table->string('periodo')->nullable();

            $table->timestamps();

            // 3) Índices agregados para optimizar búsquedas y ordenamientos
            $table->index('cliente_principal_id');
            $table->index('destino_id');
            $table->index('conductor_id');
            $table->index('tracto_id');
            $table->index('rampla_id');
            $table->index('fecha_salida');
            $table->index('periodo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fletes');
    }
};
