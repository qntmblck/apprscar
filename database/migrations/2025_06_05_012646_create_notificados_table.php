<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('notificados', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flete_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('fecha')->nullable();
            $table->string('tipo')->nullable(); // carga, descarga, peaje, otros...
            $table->decimal('monto', 10, 0)->nullable();
            $table->text('descripcion')->nullable();
            $table->string('imagen')->nullable(); // ruta archivo o base64
            $table->text('mensaje')->nullable(); // cuerpo del correo
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('notificados');
    }
};
