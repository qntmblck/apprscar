<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('retornos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flete_id')->unique()->constrained()->onDelete('cascade');

            $table->integer('valor'); // Monto monetario o valor del retorno
            $table->string('descripcion')->nullable(); // Breve detalle

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('retornos');
    }
};
