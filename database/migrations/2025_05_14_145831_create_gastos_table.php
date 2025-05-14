<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gastos', function (Blueprint $table) {
    $table->id();
    $table->foreignId('flete_id')->constrained()->onDelete('cascade');
    $table->foreignId('usuario_id')->constrained('users')->onDelete('restrict');
    $table->string('tipo');
    $table->decimal('monto', 10, 2);
    $table->text('descripcion')->nullable();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gastos');
    }
};
