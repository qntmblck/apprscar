<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Gasto extends Model
{
    use HasFactory;

    protected $fillable = [
        'flete_id',
        'monto',
        'descripcion',
        'tipo',
        'comprobante_url',
    ];

    public function flete()
    {
        return $this->belongsTo(Flete::class);
    }
}
