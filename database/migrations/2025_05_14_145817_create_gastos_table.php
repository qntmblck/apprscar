<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gastos', function (Blueprint $table) {
            $table->id();

            // foráneas
            $table->foreignId('flete_id')
                  ->constrained('fletes')
                  ->onDelete('cascade');

            $table->foreignId('rendicion_id')
                  ->constrained('rendiciones')
                  ->onDelete('cascade');

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // tipo: incluimos ahora 'Comisión'
            $table->enum('tipo', [
                'Carga',
                'Descarga',
                'Camioneta',
                'Estacionamiento',
                'Peaje',
                'Otros',
                'Comisión',
            ])->default('Otros');

            // descripción opcional
            $table->string('descripcion')->nullable();

            // ruta de la foto (opcional)
            $table->string('foto')->nullable();

            // monto del gasto
            $table->integer('monto');

            $table->timestamps();

            // índices para acelerar búsquedas
            $table->index(['flete_id', 'rendicion_id', 'user_id', 'tipo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gastos');
    }
};
