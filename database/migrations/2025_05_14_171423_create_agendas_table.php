<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('agendas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('flete_id')
                ->constrained('fletes')
                ->onDelete('cascade');

            $table->date('fecha');
            $table->time('hora')->nullable();
            $table->string('actividad'); // Ej: "Carga", "Descarga", "Descanso"
            $table->text('observaciones')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agendas');
    }
};
