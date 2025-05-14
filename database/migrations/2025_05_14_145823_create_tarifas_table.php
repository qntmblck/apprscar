<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tarifas', function (Blueprint $table) {
            $table->id();

            // Cliente al que aplica esta tarifa
            $table->foreignId('cliente_id')
                ->constrained('clientes')
                ->onDelete('cascade');

            // Destino real al que se vincula la tarifa
            $table->foreignId('destino_id')
                ->constrained('destinos')
                ->onDelete('cascade');

            $table->string('descripcion')->nullable();
            $table->decimal('monto_base', 10, 2);
            $table->decimal('monto_km', 10, 2)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tarifas');
    }
};
