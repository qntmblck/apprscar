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

            // Unique en flete_id crea automáticamente un índice único, no necesita index adicional
            $table->foreignId('flete_id')
                  ->unique()
                  ->constrained('fletes')
                  ->onDelete('cascade');

            $table->integer('valor');
            $table->string('descripcion')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('retornos');
    }
};
