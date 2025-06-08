<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flete extends Model
{
    use HasFactory;

    // 1. Campos asignables
    protected $fillable = [
        'cliente_principal_id',
        'destino_id',
        'conductor_id',
        'tracto_id',
        'rampla_id',
        'fecha_salida',
        'fecha_llegada',
        'guiaruta',
        'pagado',
        'periodo',
        // Agrega aquí cualquier otro campo que hayas definido en la migración
    ];

    // 2. Relación “cliente principal” (FK: cliente_principal_id → clientes.id)

    protected $with = ['clientePrincipal'];


    public function clientePrincipal()
    {
        return $this->belongsTo(Cliente::class, 'cliente_principal_id');
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_principal_id');
    }

    // 3. Relación con Destino (FK: destino_id → destinos.id)
    public function destino()
    {
        return $this->belongsTo(Destino::class, 'destino_id');
    }

    // 4. Relación con Usuario/Conductor (FK: conductor_id → users.id)
    public function conductor()
    {
        return $this->belongsTo(User::class, 'conductor_id');
    }

    // 5. Relación con Tracto (FK: tracto_id → tractos.id)
    public function tracto()
    {
        return $this->belongsTo(Tracto::class, 'tracto_id');
    }

    // 6. Relación con Rampla (FK: rampla_id → ramplas.id)
    public function rampla()
    {
        return $this->belongsTo(Rampla::class, 'rampla_id');
    }

    // 7. Relación uno-a-uno con Rendición (FK: rendiciones.flete_id → fletes.id)
    public function rendicion()
    {
        return $this->hasOne(Rendicion::class, 'flete_id');
    }

    // 8. Relación uno-a-uno con Retorno (FK: retornos.flete_id → fletes.id)
    public function retorno()
    {
        return $this->hasOne(Retorno::class, 'flete_id');
    }

    public function tarifa()
    {
        return $this->belongsTo(Tarifa::class, 'cliente_principal_id')
                    ->where('destino_id', $this->destino_id);
    }
}
