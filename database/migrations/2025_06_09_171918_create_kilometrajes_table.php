<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKilometrajesTable extends Migration
{
    public function up()
    {
        Schema::create('kilometrajes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flete_id')
                  ->constrained('fletes')
                  ->onDelete('cascade');
            $table->foreignId('tracto_id')
                  ->constrained('tractos')
                  ->onDelete('cascade');
            $table->foreignId('rampla_id')
                  ->constrained('ramplas')
                  ->onDelete('cascade');
            $table->integer('km_inicio');
            $table->integer('km_fin')->nullable();
            $table->integer('km_recorridos')->nullable();
            $table->timestamp('fecha_registro')->useCurrent();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('kilometrajes');
    }
}
