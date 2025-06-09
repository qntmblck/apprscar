<?php
// app/Models/Tracto.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Flete;
use App\Models\Mantencion;
use App\Models\Documento;

class Tracto extends Model
{
    use HasFactory;

    protected $fillable = [
        'patente',
        'marca',
        'modelo',
        'color',
        'anio',
        'kilometraje', // odómetro actual
        'estado',      // activo, inactivo, etc.
    ];

    /**
     * Si quieres que siempre vengan cargadas:
     */
    protected $with = [
        // 'fletes', 'mantenciones', 'documentos',
    ];

    /**
     * Atributos que se añaden al JSON.
     */
    protected $appends = [
        'km_desde_ultimo_flete',
    ];

    /**
     * 1) Todos los fletes realizados con este tracto.
     */
    public function fletes()
    {
        return $this->hasMany(Flete::class, 'tracto_id');
    }

    /**
     * 2) Mantenciones polimórficas asociadas a este tracto.
     */
    public function mantenciones()
    {
        return $this->morphMany(Mantencion::class, 'mantencionable');
    }

    /**
     * 3) Documentos polimórficos (permiso, seguro, etc.).
     */
    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }

    /**
     * 4) El último flete que salió con este tracto.
     */
    public function ultimoFlete()
    {
        return $this->hasOne(Flete::class, 'tracto_id')
                    ->latestOfMany('fecha_salida');
    }

    /**
     * 5) Accessor: kilómetros recorridos desde el inicio de ese último flete.
     *
     * Calculado como: odómetro actual de tracto
     * menos el km_inicio del último flete.
     */
    public function getKmDesdeUltimoFleteAttribute(): ?int
    {
        $ultimo = $this->ultimoFlete;
        if (! $ultimo || ! $this->kilometraje) {
            return null;
        }
        // $ultimo->kilometraje es el km_inicio guardado en Flete
        return $this->kilometraje - $ultimo->kilometraje;
    }
}
