<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tractos', function (Blueprint $table) {
            $table->id();
            $table->string('patente')->unique();
            $table->string('marca');
            $table->string('modelo');
            $table->string('color');
            $table->integer('año');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tractos');
    }
};
