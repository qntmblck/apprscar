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

            // 1) Relación polimórfica: conductor o colaborador
            $table->morphs('pagable'); // crea pagable_id + pagable_type (ambos indexados)

            // 2) Periodo de pago (mes en texto, e.g. "Junio")
            $table->string('periodo');

            // 3) Totales
            $table->decimal('total_comision', 12, 2)->default(0);
            $table->decimal('total_saldo',     12, 2)->default(0);

            // 4) Fecha y detalle
            $table->date('fecha_pago')->nullable();
            $table->text('detalle')->nullable();

            $table->timestamps();

            // 5) Índice para filtrar por periodo
            $table->index('periodo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
