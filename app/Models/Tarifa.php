<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    //    Esta relación sirve para saber “todos los fletes que usaron esta tarifa”,
    //    pero dado que usamos cliente_principal_id + destino_id + tipo como llave,
    //    lo más directo suele ser buscar tarifa desde Flete, no viceversa.
    public function fletes()
    {
        return $this->hasMany(Flete::class, 'cliente_principal_id', 'cliente_principal_id');
    }
}
