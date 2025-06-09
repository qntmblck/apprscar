<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mantenciones', function (Blueprint $table) {
            $table->id();

            // Polimórfico: mantencionable_type, mantencionable_id
            $table->morphs('mantencionable');

            $table->date('fecha');
            $table->string('tipo');               // Ej: cambio de aceite, revisión técnica
            $table->text('detalle')->nullable();  // descripción o comentarios
            $table->decimal('costo', 10, 2)->nullable();

            $table->timestamps();

            // Índices compuestos para acelerar búsquedas por el morph
            $table->index(['mantencionable_type', 'mantencionable_id'], 'mantencionable_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mantenciones');
    }
};
