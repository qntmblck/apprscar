<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Destino extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'km',
        'region',
    ];

    public function fletes()
    {
        return $this->hasMany(Flete::class);
    }
}
