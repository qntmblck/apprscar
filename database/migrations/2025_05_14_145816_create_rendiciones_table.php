<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rendiciones', function (Blueprint $table) {
            $table->id();

            $table->foreignId('flete_id')
                  ->constrained('fletes')
                  ->onDelete('cascade');
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->string('estado')->default('activo');
            $table->string('periodo')->nullable();
            $table->boolean('pagado')->default(false);
            $table->integer('comision')->nullable();

            $table->text('observaciones')->nullable();

            $table->integer('caja_flete')->default(0);
            $table->integer('viatico_efectivo')->default(0);
            $table->integer('viatico_calculado')->default(0);
            $table->integer('viatico')->nullable();
            $table->integer('saldo')->nullable();

            $table->timestamps();

            // ─── Índices para acelerar filtrado por flete y usuario ───────────
            $table->index('flete_id');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rendiciones');
    }
};
