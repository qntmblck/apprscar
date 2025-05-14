<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tarifa extends Model
{
    use HasFactory;

    protected $fillable = [
        'destino_id',
        'monto',
        'tipo',
    ];

    public function destino()
    {
        return $this->belongsTo(Destino::class);
    }

    public function fletes()
    {
        return $this->hasMany(Flete::class);
    }
}
