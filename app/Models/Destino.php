<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Destino extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'region',
        'km',
    ];

    public function tarifas()
    {
        return $this->hasMany(Tarifa::class);
    }

    public function fletes()
    {
        return $this->hasMany(Flete::class);
    }
}
