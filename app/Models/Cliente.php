<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Flete;
use App\Models\Tarifa;
use App\Models\Documento;

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

    // 6. Hook: antes de borrar, vuelca la razón social en todos los fletes
    protected static function booted()
    {
        static::deleting(function (self $cliente) {
            Flete::where('cliente_principal_id', $cliente->id)
                 ->update(['cliente_nombre' => $cliente->razon_social]);
        });
    }
}
