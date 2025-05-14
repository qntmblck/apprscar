<?php

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
        'año',
    ];

    public function fletes()
    {
        return $this->hasMany(Flete::class);
    }

    public function mantenciones()
    {
        return $this->hasMany(Mantencion::class);
    }

    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }
}
