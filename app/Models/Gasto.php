<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Gasto extends Model
{
    use HasFactory;

    protected $fillable = [
        'flete_id',
        'rendicion_id',
        'usuario_id',
        'tipo',
        'monto',
        'descripcion',
        'foto',
    ];

    // Relaciones
    public function flete()
    {
        return $this->belongsTo(Flete::class);
    }

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

    // Accessor para mostrar monto formateado (opcional)
    public function getMontoFormatAttribute()
    {
        return '$' . number_format($this->monto, 0, ',', '.');
    }
}
