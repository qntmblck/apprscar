<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Retorno extends Model
{
    use HasFactory;

    protected $fillable = [
        'ciudad',
        'direccion',
        'contacto',
    ];

    public function fletes()
    {
        return $this->hasMany(Flete::class);
    }
}
