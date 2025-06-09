<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('tractos');

        Schema::create('tractos', function (Blueprint $table) {
            $table->id();
            $table->string('patente')->unique();
            $table->string('marca');
            $table->string('modelo');
            $table->string('color');
            $table->year('anio');
            $table->integer('kilometraje');
            $table->enum('estado', ['Activo', 'Inactivo'])->default('Activo'); // ← agregado
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tractos');
    }
};
