<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdicionalesTable extends Migration
{
    public function up()
    {
        Schema::create('adicionales', function (Blueprint $table) {
            $table->id();

            // Relación con fletes
            $table->foreignId('flete_id')
                  ->constrained('fletes')
                  ->onDelete('cascade');

            // Relación con rendiciones
            $table->foreignId('rendicion_id')
                  ->constrained('rendiciones')
                  ->onDelete('cascade');

            $table->string('tipo');
            $table->decimal('monto', 12, 2);
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('adicionales');
    }
}
