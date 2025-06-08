<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('abono_cajas', function (Blueprint $table) {
            $table->id();

            // Esta línea ahora crea verdaderamente la tabla "abono_cajas"
            $table->foreignId('rendicion_id')
                  ->constrained('rendiciones')
                  ->onDelete('cascade');

            $table->integer('monto');
            $table->string('metodo'); // Ej: Efectivo, Transferencia

            $table->timestamps();

            // Índice para acelerar consultas por rendicion_id
            $table->index('rendicion_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('abono_cajas');
    }
};
