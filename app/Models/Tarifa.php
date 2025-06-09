<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Flete;

class Tarifa extends Model
{
    use HasFactory;

    // 1. Campos asignables
    protected $fillable = [
        'destino_id',
        'cliente_principal_id',
        'tipo',            // enum: 'Directo' / 'Reparto'
        'valor_factura',
        'valor_comision',
    ];

    // 2. Relación con Cliente “principal” (FK: cliente_principal_id → clientes.id)
    public function clientePrincipal()
    {
        return $this->belongsTo(Cliente::class, 'cliente_principal_id');
    }

    // 3. Relación con Destino (FK: destino_id → destinos.id)
    public function destino()
    {
        return $this->belongsTo(Destino::class, 'destino_id');
    }

    // 4. Relación inversa con Fletes
    public function fletes()
    {
        return $this->hasMany(Flete::class, 'tarifa_id');
    }

    // 5. Hook: antes de eliminar una tarifa,
    //    preserva su valor en todos los fletes huérfanos
    protected static function booted()
    {
        static::deleting(function (self $tarifa) {
            Flete::where('tarifa_id', $tarifa->id)
                ->update(['tarifa_valor' => $tarifa->valor_factura]);
        });
    }
}
