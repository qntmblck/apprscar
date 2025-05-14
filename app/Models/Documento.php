<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documentos', function (Blueprint $table) {
            $table->id();
            $table->morphs('documentable'); // ✅ permite asociar a múltiples entidades
            $table->string('tipo');         // Ej: "PDF", "imagen", "licencia"
            $table->string('archivo_url');  // Ruta al archivo
            $table->text('descripcion')->nullable(); // Comentario opcional
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documentos');
    }
};
