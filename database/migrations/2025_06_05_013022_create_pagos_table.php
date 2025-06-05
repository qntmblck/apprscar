<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // conductor
            $table->string('periodo'); // Ej: Enero, Febrero, etc.

            $table->decimal('total_comision', 12, 0)->default(0);
            $table->decimal('total_saldo', 12, 0)->default(0);

            $table->date('fecha_pago')->nullable();
            $table->text('detalle')->nullable(); // resumen opcional, comentarios o link a PDF

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('pagos');
    }
};
