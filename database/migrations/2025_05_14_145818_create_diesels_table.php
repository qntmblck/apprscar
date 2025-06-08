<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diesels', function (Blueprint $table) {
            $table->id();

            // 1) Clave foránea al flete
            $table->foreignId('flete_id')
                  ->constrained('fletes')
                  ->onDelete('cascade');

            // 2) Clave foránea a la rendición
            $table->foreignId('rendicion_id')
                  ->constrained('rendiciones')
                  ->onDelete('cascade');

            // 3) Clave foránea al usuario (conductor que registra)
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // 4) Campos de datos
            $table->integer('litros');
            $table->integer('monto');
            $table->string('metodo_pago'); // Ej: Efectivo, Transferencia, Crédito
            $table->string('foto')->nullable();

            $table->timestamps();

            // 5) Índices secundarios (opcional, pero recomendado)
            $table->index('flete_id');
            $table->index('rendicion_id');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diesels');
    }
};
