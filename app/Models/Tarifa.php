<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarifa extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'destino_id',
        'descripcion',
        'monto_base',
        'monto_km',
    ];

    // Relación: esta tarifa pertenece a un cliente
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    // Relación: esta tarifa pertenece a un destino
    public function destino()
    {
        return $this->belongsTo(Destino::class);
    }
}
