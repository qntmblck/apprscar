<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mantenciones', function (Blueprint $table) {
    $table->id();
    $table->morphs('mantencionable'); // equipo_id + equipo_type
    $table->date('fecha');
    $table->string('tipo');
    $table->text('detalle')->nullable();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mantenciones');
    }
};
