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
            $table->string('nombre');
            $table->integer('km');
            $table->string('region');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('retornos');
    }
};
