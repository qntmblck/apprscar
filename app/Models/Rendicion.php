<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;
use App\Models\Flete;
use App\Models\Gasto;
use App\Models\Diesel;
use App\Models\AbonoCaja;
use App\Models\Adicional;
use App\Models\Documento;
use App\Models\User;
use App\Models\Retorno;

class Rendicion extends Model
{
    use HasFactory;

    protected $table = 'rendiciones';

    /** Campos asignables */
    protected $fillable = [
        'flete_id',
        'user_id',
        'estado',
        'observaciones',
        'caja_flete',
        'viatico_calculado',
        'viatico_efectivo',
        'viatico',
        'saldo',
        'periodo',
        'comision', // comisión manual ingresada
        'pagado',
    ];

    /** Atributos virtuales para JSON */
    protected $appends = [
        'total_gastos',
        'total_diesel',
        'viatico_calculado',
        'saldo_temporal',
    ];

    /** Relación con Flete */
    public function flete()
    {
        return $this->belongsTo(Flete::class)
                    ->select(['id', 'destino_id', 'cliente_principal_id']);
    }

    /** Relación con Usuario (conductor) */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')
                    ->select(['id', 'name']);
    }

    /** Relación con Gasto */
    public function gastos()
    {
        return $this->hasMany(Gasto::class)
                    ->select(['id', 'rendicion_id', 'tipo', 'descripcion', 'monto', 'created_at']);
    }

    /** Relación con Diesel */
    public function diesels()
    {
        return $this->hasMany(Diesel::class)
                    ->select(['id', 'rendicion_id', 'litros', 'metodo_pago', 'monto', 'foto', 'created_at']);
    }

    /** Relación con AbonoCaja */
    public function abonos()
    {
        return $this->hasMany(AbonoCaja::class)
                    ->select(['id', 'rendicion_id', 'metodo', 'monto', 'created_at']);
    }

    /** Relación con Adicional */
    public function adicionales()
    {
        return $this->hasMany(Adicional::class)
                    ->select(['id', 'rendicion_id', 'tipo', 'descripcion', 'monto', 'created_at']);
    }

        /** Relación con Retorno */
    public function retornos()
    {
        return $this->hasMany(Retorno::class, 'flete_id', 'flete_id')
                    ->select(['id', 'flete_id', 'valor as monto', 'created_at']);
    }



    /** Relación polimórfica con Documento */
    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }

    /** Accessor: total de gastos */
    public function getTotalGastosAttribute(): int
    {
        return $this->gastos()->sum('monto');
    }

    /** Accessor: total de diesel */
    public function getTotalDieselAttribute(): int
    {
        return $this->diesels()
                    ->where('metodo_pago', '!=', 'Crédito')
                    ->sum('monto');
    }

    /** Accessor: viático calculado o efectivo */
    public function getViaticoCalculadoAttribute(): int
    {
        return $this->attributes['viatico_efectivo']
               ?? $this->attributes['viatico_calculado']
               ?? 0;
    }

    /** Accessor: saldo temporal */
    public function getSaldoTemporalAttribute(): int
    {
        $abonos  = $this->abonos()->sum('monto');
        $gastos  = $this->total_gastos;
        $diesel  = $this->total_diesel;
        $viatico = $this->viatico_calculado;

        return $abonos - $gastos - $diesel - $viatico;
    }

    /**
     * Recalcula y persiste saldo y comisión.
     * Usa 'comision' existente como manual y suma tarifa.
     */
    public function recalcularTotales(): ?string
{
    try {
        // 1) Sumas de abonos, gastos y diesel
        $abonos = $this->abonos()->sum('monto');
        $gastos = $this->gastos()->sum('monto');
        $diesel = $this->diesels()
                      ->where('metodo_pago', '!=', 'Crédito')
                      ->sum('monto');

        // 2) Viáticos
        $viatico = $this->viatico_efectivo
                   ?? $this->viatico_calculado
                   ?? 0;

        // 3) Saldo en rendición
        $this->saldo = $abonos - $gastos - $diesel - $viatico;

        // 4) Comisión = fija (tarifa) + manual (retorno)
        $fija   = optional($this->flete->tarifa)->valor_comision ?? 0;
        $manual = $this->comision ?? 0;
        $this->comision = $fija + $manual;

        // 5) Guardar la rendición
        $this->save();

        // 6) Sincronizar comisión en el flete padre
        if ($this->flete) {
            $this->flete->update([
                'comision' => $this->comision,
            ]);

            // 7) REFRESCAR el modelo para que la prop 'comision' venga actualizada
            $this->flete->refresh();
        }
    } catch (\Throwable $e) {
        \Log::error('Error al recalcular totales: ' . $e->getMessage());
    }

    return null;
}




    // Scopes
    public function scopeOfFlete($query, int $fleteId)
    {
        return $query->where('flete_id', $fleteId);
    }

    public function scopeActivo($query)
    {
        return $query->where('estado', 'Activo');
    }

    public function scopeCerrado($query)
    {
        return $query->where('estado', 'Cerrado');
    }

    public function scopeLatestFirst($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
