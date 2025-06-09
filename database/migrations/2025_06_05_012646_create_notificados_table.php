<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('notificados', function (Blueprint $table) {
            $table->id();

            //
            // 1) Claves foráneas
            //
            // No eliminamos notificados si se borra el flete o el usuario,
            // para conservar el histórico
            $table->foreignId('flete_id')
                  ->constrained('fletes')
                  ->nullOnDelete();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->nullOnDelete();

            //
            // 2) Datos de la notificación
            //
            $table->timestamp('fecha')->nullable();
            $table->string('tipo')->nullable();         // carga, descarga, peaje, etc.
            $table->decimal('monto', 12, 2)->nullable(); // monto asociado
            $table->text('descripcion')->nullable();     // cuerpo del correo
            $table->string('imagen')->nullable();        // ruta o base64
            $table->text('mensaje')->nullable();         // texto adicional
            $table->text('observaciones')->nullable();   // notas internas

            $table->timestamps();

            //
            // 3) Índices
            //
            $table->index('flete_id');
            $table->index('user_id');
            $table->index('fecha');
            $table->index('tipo');
        });
    }

    public function down(): void {
        Schema::dropIfExists('notificados');
    }
};
