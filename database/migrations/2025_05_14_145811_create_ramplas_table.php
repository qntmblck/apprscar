<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ramplas', function (Blueprint $table) {
            $table->id();
            $table->string('patente')->unique();
            $table->string('tipo');
            $table->string('marca');
            $table->float('capacidad'); // en kilogramos o toneladas
            $table->float('longitud'); // en metros
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ramplas');
    }
};
