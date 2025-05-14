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
    'año',
    'color',
];


    public function fletes()
    {
        return $this->hasMany(Flete::class);
    }
}
