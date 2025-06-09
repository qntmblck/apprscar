<?php
// app/Models/Rampla.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rampla extends Model
{
    use HasFactory;

    protected $fillable = [
        'patente',
        'tipo',
        'marca',
        'modelo',
        'capacidad',
        'longitud',
        'kilometraje',
        'estado',
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
