<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'rut',
        'direccion',
        'telefono',
        'email',
    ];

    // Relación: un cliente puede tener muchos fletes
    public function fletes()
    {
        return $this->hasMany(Flete::class, 'cliente_principal_id');
    }

    // Relación polimórfica: un cliente puede tener muchos documentos
    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }
}
