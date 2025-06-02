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

            $table->foreignId('flete_id')->constrained()->onDelete('cascade');
            $table->foreignId('rendicion_id')->constrained('rendiciones')->onDelete('cascade');
            $table->foreignId('usuario_id')->constrained('users')->onDelete('restrict');

            $table->enum('tipo', ['Carga', 'Descarga', 'Camioneta', 'Estacionamiento', 'Peaje', 'Otros']);
            $table->integer('monto'); // En pesos chilenos, sin decimales
            $table->text('descripcion')->nullable();
            $table->string('foto')->nullable(); // Imagen opcional del gasto

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gastos');
    }
};
