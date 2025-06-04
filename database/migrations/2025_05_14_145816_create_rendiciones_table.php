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

            $table->foreignId('flete_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('estado')->default('activo');     // activo / cerrado
            $table->string('periodo')->nullable();            // Ej: Enero, Febrero, etc.

            $table->text('observaciones')->nullable();

            $table->integer('caja_flete')->default(0);
            $table->integer('viatico_efectivo')->default(0);   // Ingresado manualmente
            $table->integer('viatico_calculado')->default(0);  // Calculado automáticamente
            $table->integer('viatico')->nullable();            // Final, al cerrar flete
            $table->integer('saldo')->nullable();              // Final, al cerrar flete

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rendiciones');
    }
};
