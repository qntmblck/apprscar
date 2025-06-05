<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tractos', function (Blueprint $table) {
            $table->id();
            $table->string('patente')->unique();
            $table->string('marca')->nullable();
            $table->string('modelo')->nullable();
            $table->year('anio')->nullable();
            $table->integer('kilometraje')->default(0); // Agregado
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tractos');
    }
};
