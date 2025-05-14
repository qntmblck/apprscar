<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('diesels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flete_id')->unique()->constrained()->onDelete('cascade');
            $table->decimal('monto', 10, 2);
            $table->decimal('litros', 10, 2);
            $table->enum('metodo_pago', ['Efectivo', 'Transferencia', 'Crédito']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diesels');
    }
};
