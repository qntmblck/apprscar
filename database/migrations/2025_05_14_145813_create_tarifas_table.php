<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tarifas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destino_id')->constrained()->onDelete('cascade');
            $table->integer('monto');
            $table->string('tipo'); // Reparto o Directo
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tarifas');
    }
};
