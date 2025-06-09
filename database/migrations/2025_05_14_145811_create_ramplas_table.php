<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('ramplas');

        Schema::create('ramplas', function (Blueprint $table) {
            $table->id();
            $table->string('patente')->unique();
            $table->string('tipo');
            $table->string('marca');
            $table->string('modelo');
            $table->float('capacidad');    // en toneladas
            $table->float('longitud');     // en metros
            $table->integer('kilometraje'); // en km
            $table->enum('estado', ['Activo', 'Inactivo'])->default('Activo');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ramplas');
    }
};
