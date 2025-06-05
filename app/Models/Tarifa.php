<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tarifa extends Model
{
    use HasFactory;

    protected $fillable = [
        'destino_id',
        'cliente_principal_id',
        'tipo',
        'valor_factura',
        'valor_comision',
    ];

    // Relaciones
    public function destino()
    {
        return $this->belongsTo(Destino::class);
    }

    public function clientePrincipal()
    {
        return $this->belongsTo(Cliente::class, 'cliente_principal_id');
    }

    public function fletes()
    {
        // No es estrictamente necesaria esta relación si se consulta por coincidencia en cliente_principal_id,
        // pero si deseas mantenerla, es importante dejarla así explícita.
        return $this->hasMany(Flete::class, 'cliente_principal_id', 'cliente_principal_id');
    }
}
