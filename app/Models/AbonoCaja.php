<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AbonoCaja extends Model
{
    use HasFactory;

    protected $fillable = [
        'rendicion_id',
        'metodo', // cambiado de 'tipo' a 'metodo'
        'monto',
    ];

    // Relaciones
    public function rendicion()
    {
        return $this->belongsTo(Rendicion::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }

    // Accessor para formato CLP
    public function getMontoFormatAttribute()
    {
        return '$' . number_format($this->monto, 0, ',', '.');
    }
}
