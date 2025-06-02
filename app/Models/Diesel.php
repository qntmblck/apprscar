<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Diesel extends Model
{
    use HasFactory;

    protected $fillable = [
        'flete_id',
        'rendicion_id',
        'usuario_id',
        'monto',
        'litros',
        'metodo_pago',
        'foto',
    ];

    public function rendicion()
    {
        return $this->belongsTo(Rendicion::class);
    }

    public function flete()
    {
        return $this->belongsTo(Flete::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
