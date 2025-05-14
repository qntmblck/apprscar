<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'razon_social',
        'rut',
        'giro',
        'direccion',
        'telefono',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function fletes()
    {
        return $this->hasMany(Flete::class, 'cliente_principal_id');
    }

    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }
}
