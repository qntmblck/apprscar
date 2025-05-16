<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Diesel extends Model
{
    use HasFactory;

    protected $fillable = [
        'flete_id',
        'monto',
        'litros',
        'metodo_pago', // ✅ este sí está en la tabla
    ];

    public function flete()
    {
        return $this->belongsTo(Flete::class);
    }
}

