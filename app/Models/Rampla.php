<?php
// app/Models/Rampla.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Flete;
use App\Models\Mantencion;
use App\Models\Documento;

class Rampla extends Model
{
    use HasFactory;

    protected $fillable = [
        'patente',
        'tipo',
        'marca',
        'modelo',
        'capacidad',
        'longitud',
        'kilometraje',  // odómetro actual
        'estado',
    ];

    /**
     * Siempre eager-load estas relaciones si lo deseas:
     */
    protected $with = [
        // 'fletes', 'mantenciones', 'documentos',
    ];

    /**
     * Campos adicionales en el JSON
     */
    protected $appends = [
        'km_desde_ultimo_flete',
    ];

    /**
     * 1) Relación: todos los fletes que han usado esta rampla
     */
    public function fletes()
    {
        return $this->hasMany(Flete::class, 'rampla_id');
    }

    /**
     * 2) Mantenciones (polimórfica)
     */
    public function mantenciones()
    {
        return $this->morphMany(Mantencion::class, 'mantencionable');
    }

    /**
     * 3) Documentos (polimórfica)
     */
    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }

    /**
     * 4) El último flete que utilizó esta rampla
     */
    public function ultimoFlete()
    {
        return $this->hasOne(Flete::class, 'rampla_id')
                    ->latestOfMany('fecha_salida');
    }

    /**
     * 5) Accessor: kilómetros recorridos desde el inicio de ese último flete
     *
     * Se calcula como: odómetro actual de rampla
     * menos el kilometer start del último flete.
     */
    public function getKmDesdeUltimoFleteAttribute(): ?int
    {
        $ultimo = $this->ultimoFlete;
        if (! $ultimo || ! $this->kilometraje) {
            return null;
        }
        // $ultimo->kilometraje es el campo km_inicio del flete
        return $this->kilometraje - $ultimo->kilometraje;
    }
}
