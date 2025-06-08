<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    // 1. Campos asignables
    protected $fillable = [
        'user_id',
        'razon_social',
        'rut',
        'giro',
        'direccion',
        'telefono',
        // … otros campos que definas …
    ];

    // 2. Relación con User (FK: user_id → users.id)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // 3. Relación uno-a-muchos: “fletes como cliente principal”
    //    (FK en fletes: cliente_principal_id → clientes.id)
    public function fletesComoPrincipal()
    {
        return $this->hasMany(Flete::class, 'cliente_principal_id');
    }

    // 4. Relación uno-a-muchos con Tarifa
    //    (FK en tarifas: cliente_principal_id → clientes.id)
    public function tarifas()
    {
        return $this->hasMany(Tarifa::class, 'cliente_principal_id');
    }

    // 5. Relación polimórfica con Documentos (si la tienes definida así)
    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }
}
