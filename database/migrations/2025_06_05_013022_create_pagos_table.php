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

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->string('periodo');

            $table->decimal('total_comision', 12, 0)->default(0);
            $table->decimal('total_saldo', 12, 0)->default(0);

            $table->date('fecha_pago')->nullable();
            $table->text('detalle')->nullable();

            $table->timestamps();

            // ─── Índices para búsquedas por usuario y periodo ────────────────
            $table->index('user_id');
            $table->index('periodo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
