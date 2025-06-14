<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Adicional extends Model
{
    use HasFactory;

    protected $table = 'adicionales';

    protected $fillable = [
        'flete_id',
        'rendicion_id',
        'tipo',        // p.ej. 'demora', 'peaje', …
        'monto',       // valor en pesos
        'descripcion', // opcional
    ];

    /**
     * Un adicional pertenece a un flete.
     */
    public function flete()
    {
        return $this->belongsTo(Flete::class, 'flete_id');
    }

    /**
     * Un adicional pertenece a una rendición.
     */
    public function rendicion()
    {
        return $this->belongsTo(Rendicion::class, 'rendicion_id');
    }
}
