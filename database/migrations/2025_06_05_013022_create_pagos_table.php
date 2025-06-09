<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();

            //
            // 1) Relación polimórfica: conductor o colaborador (pagable)
            //
            $table->morphs('pagable'); // crea pagable_id + pagable_type, y su índice automáticamente

            //
            // 2) Periodo de pago y totales
            //
            $table->string('periodo'); // e.g. "Junio"
            $table->decimal('total_comision', 12, 2)->default(0);
            $table->decimal('total_saldo',     12, 2)->default(0);

            //
            // 3) Fecha de pago y detalle
            //
            $table->date('fecha_pago')->nullable();
            $table->text('detalle')->nullable();

            $table->timestamps();

            //
            // 4) Índices adicionales
            //
            $table->index('periodo');
            // Eliminamos la siguiente línea, porque 'morphs' ya creó este índice:
            // $table->index(['pagable_type', 'pagable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
