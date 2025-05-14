<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rendiciones', function (Blueprint $table) {
            $table->id();

            $table->foreignId('flete_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');

            $table->integer('caja_flete')->default(0);
            $table->integer('viatico_efectivo')->default(0);
            $table->string('estado')->default('pendiente');
            $table->text('observaciones')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rendiciones');
    }
};
