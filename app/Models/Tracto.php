<?php
// app/Models/Tracto.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tracto extends Model
{
    use HasFactory;

    protected $fillable = [
        'patente',
        'marca',
        'modelo',
        'color',
        'anio',
        'kilometraje', // ya existía
        'estado',      // ← agregado
    ];

    public function fletes()
    {
        return $this->hasMany(Flete::class);
    }

    public function mantenciones()
{
    return $this->morphMany(Mantencion::class, 'mantencionable');
}

    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }
}
