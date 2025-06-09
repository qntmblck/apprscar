<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use App\Models\Cliente;
use App\Models\User;
use App\Models\Destino;
use App\Models\Tracto;
use App\Models\Rampla;
use App\Models\Tarifa;
use App\Models\Rendicion;
use App\Models\Retorno;
use App\Models\Adicional;
use App\Models\Notificado;
use App\Models\Mantencion;
use App\Models\Pago;
use App\Models\Kilometraje;

class Flete extends Model
{
    use HasFactory;

    /** 1. Campos asignables **/
    protected $fillable = [
    'cliente_principal_id','cliente_nombre',
    'conductor_id','conductor_nombre',
    'colaborador_id','colaborador_nombre',
    'tarifa_id','tarifa_valor',
    'destino_id','tracto_id','rampla_id',
    'tipo','estado','kilometraje','rendimiento',
    'fecha_salida','fecha_llegada',
    'comision','retorno','guiaruta','pagado',
    'valor_factura','utilidad',
    'adicionales',
];


    /** 2. Accessors to append **/
    protected $appends = [
        'valor_factura',
        'km_recorridos',
    ];

    /** 3. Booted: mantener snapshots **/
    protected static function booted()
    {
        static::saving(function (self $flete) {
            // Cliente
            if ($flete->isDirty('cliente_principal_id') && $flete->cliente_principal_id) {
                $flete->cliente_nombre = $flete->clientePrincipal?->razon_social;
            }
            // Conductor
            if ($flete->isDirty('conductor_id') && $flete->conductor_id) {
                $flete->conductor_nombre = $flete->conductor?->name;
            }
            // Colaborador
            if ($flete->isDirty('colaborador_id') && $flete->colaborador_id) {
                $flete->colaborador_nombre = $flete->colaborador?->name;
            }
            // Tarifa
            if ($flete->isDirty('tarifa_id') && $flete->tarifa_id) {
                $flete->tarifa_valor = $flete->tarifa?->valor_factura;
            }
        });
    }

    /** 4. Relaciones **/
    public function clientePrincipal()
    {
        return $this->belongsTo(Cliente::class, 'cliente_principal_id');
    }

    public function conductor()
    {
        return $this->belongsTo(User::class, 'conductor_id');
    }

    public function colaborador()
    {
        return $this->belongsTo(User::class, 'colaborador_id');
    }

    public function tarifa()
    {
        return $this->belongsTo(Tarifa::class, 'tarifa_id');
    }

    public function destino()
    {
        return $this->belongsTo(Destino::class, 'destino_id');
    }

    public function tracto()
    {
        return $this->belongsTo(Tracto::class, 'tracto_id');
    }

    public function rampla()
    {
        return $this->belongsTo(Rampla::class, 'rampla_id');
    }

    public function rendicion()
    {
        return $this->hasOne(Rendicion::class, 'flete_id');
    }

    public function retorno()
    {
        return $this->hasOne(Retorno::class, 'flete_id');
    }

    public function adicionales()
    {
        return $this->hasMany(Adicional::class, 'flete_id');
    }

    public function notificados()
    {
        return $this->hasMany(Notificado::class, 'flete_id');
    }

    public function mantenciones()
    {
        return $this->hasMany(Mantencion::class, 'flete_id');
    }

    public function kilometrajes()
    {
        return $this->hasMany(Kilometraje::class, 'flete_id');
    }

    public function pagos()
    {
        $periodo = $this->fecha_llegada
            ? $this->fecha_llegada->locale('es')->monthName()
            : null;

        return $this->hasMany(Pago::class, 'conductor_id', 'conductor_id')
                    ->where('periodo', $periodo);
    }

    /** 5. Accesores personalizados **/

    // Valor factura ajustado
    public function getValorFacturaAttribute(): float
    {
        $base = $this->tarifa?->valor_factura ?? 0;
        return $this->colaborador_id
            ? round($base * 0.1, 2)
            : $base;
    }

    // Empareja con el flete anterior para calcular km recorridos
    public function fleteAnterior()
{
    return $this->hasOne(self::class)
                ->where('tracto_id', $this->tracto_id)
                ->where('rampla_id', $this->rampla_id)
                ->where('fecha_salida', '<', $this->fecha_salida)
                ->orderByDesc('fecha_salida')
                ->limit(1);
}


    public function getKmRecorridosAttribute(): ?int
{
    if (! $this->kilometraje || ! $this->fecha_salida) {
        return null;
    }

    $fleteAnterior = self::where('tracto_id', $this->tracto_id)
        ->where('rampla_id', $this->rampla_id)
        ->where('fecha_salida', '<', $this->fecha_salida)
        ->orderByDesc('fecha_salida')
        ->first();

    return $fleteAnterior && $fleteAnterior->kilometraje
        ? $this->kilometraje - $fleteAnterior->kilometraje
        : null;
}
public function cliente()
{
    return $this->clientePrincipal();
}

public function getClienteAttribute()
{
    return $this->clientePrincipal;
}

}
