<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diesels', function (Blueprint $table) {
            $table->id();

            $table->foreignId('flete_id')->constrained()->onDelete('cascade');
            $table->foreignId('rendicion_id')->nullable()->constrained('rendiciones')->onDelete('cascade');
            $table->foreignId('usuario_id')->nullable()->constrained('users')->onDelete('restrict');

            $table->decimal('monto', 10, 2);
            $table->integer('litros');
            $table->string('metodo_pago'); // Efectivo, Transferencia, Crédito
            $table->string('foto')->nullable(); // ✅ agregada correctamente

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diesels');
    }
};
