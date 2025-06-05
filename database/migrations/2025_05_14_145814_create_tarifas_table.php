<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tarifas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destino_id')->constrained()->onDelete('cascade');
            $table->foreignId('cliente_principal_id')->constrained('clientes')->onDelete('cascade');
            $table->enum('tipo', ['Directo', 'Reparto']);
            $table->integer('valor_factura')->default(0);
            $table->integer('valor_comision')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tarifas');
    }
};
