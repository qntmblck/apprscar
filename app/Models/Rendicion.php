<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;
use App\Models\Flete;


class Rendicion extends Model
{
    use HasFactory;

    protected $table = 'rendiciones';

    /**
     * Campos asignables.
     * - 'user_id' es el conductor asignado a esta rendición.
     * - 'caja_flete' suma de abonos, diesel, etc.
     * - 'viatico' y 'viatico_efectivo' se guardan cuando se cierra rendición.
     * - 'saldo' se calcula al cerrar.
     * - 'periodo' (ej: 'Marzo', 'Abril', etc.) para filtrado.
     * - 'comision' y 'pagado' si manejas pagos mensuales.
     */
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
        'comision',
        'pagado',
    ];

    /**
     * Atributos virtuales que queremos exponer en JSON.
     */
    protected $appends = [
        'total_gastos',
        'total_diesel',
        'viatico_calculado',
        'saldo_temporal',
    ];

    /**
     * Relación con Flete.
     * Solo seleccionamos los campos mínimos de flete para mostrar nombre de destino, cliente, etc.
     */
    public function flete()
    {
        return $this->belongsTo(Flete::class)
                    ->select(['id', 'destino_id', 'cliente_principal_id']);
    }

    /**
     * Relación con Usuario (conductor) asignado a esta rendición.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')
                    ->select(['id', 'name']);
    }

    /**
     * Todos los gastos vinculados a esta rendición.
     * Seleccionamos solo columnas mínimas para mostrar en la tabla de desglose.
     */
    public function gastos()
    {
        return $this->hasMany(Gasto::class)
                    ->select(['id', 'rendicion_id', 'tipo', 'monto']);
    }

    /**
     * Todos los diesel vinculados a esta rendición.
     * Traemos solo id, monto, litros, método de pago, foto, etc.
     */
    public function diesels()
    {
        return $this->hasMany(Diesel::class)
                    ->select(['id', 'rendicion_id', 'monto', 'litros', 'metodo_pago', 'foto']);
    }

    /**
     * Todos los abonos de caja de esta rendición.
     */
    public function abonos()
    {
        return $this->hasMany(AbonoCaja::class)
                    ->select(['id', 'rendicion_id', 'metodo', 'monto']);
    }

    /**
     * Relación polimórfica a documentos si es que adjuntas comprobantes a la rendición.
     */
    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }

    /**
     * Accessor: total de gastos (suma de 'monto' en Gasto).
     */
    public function getTotalGastosAttribute(): int
    {
        return $this->gastos()->sum('monto');
    }

    /**
     * Accessor: total de diesel (excluyendo los de método 'Crédito' si aplica).
     */
    public function getTotalDieselAttribute(): int
    {
        return $this->diesels()->where('metodo_pago', '!=', 'Crédito')->sum('monto');
    }

    /**
     * Accessor: si existe viatico_efectivo lo usamos,
     * si no, mostramos viatico_calculado (previamente seteado).
     */
    public function getViaticoCalculadoAttribute(): int
    {
        // Si ya hay un viatico_efectivo guardado (rendición en curso o cerrada),
        // entonces devolvemos ese; si no, tomamos el viatico_calculado real.
        return $this->attributes['viatico_efectivo']
               ?? $this->attributes['viatico_calculado']
               ?? 0;
    }

    /**
     * Accessor: calcula el saldo temporal en base a:
     *  abonos - total_gastos - total_diesel - viatico_calculado
     */
    public function getSaldoTemporalAttribute(): int
    {
        $abonos = $this->abonos()->sum('monto');
        $gastos = $this->total_gastos;     // usa el accessor
        $diesel = $this->total_diesel;     // usa el accessor
        $viatico = $this->viatico_calculado;

        return $abonos - $gastos - $diesel - $viatico;
    }

    /**
     * Método que recalcula y persiste el saldo definitivo:
     *  saldo = abonos - total_gastos - total_diesel - viatico
     */
    // en app/Models/Rendicion.php
public function recalcularTotales(): void
{
    try {
        // 1) Sumar abonos, gastos y diesel
        $abonos  = $this->abonos()->sum('monto');
        $gastos  = $this->gastos()->sum('monto');
        $diesel  = $this->diesels()
                        ->where('metodo_pago', '!=', 'Crédito')
                        ->sum('monto');

        // 2) Viático: si no hay viático efectivo ni calculado, cero
        $viatico = $this->viatico_efectivo
                   ?? $this->viatico_calculado
                   ?? 0;

        // 3) Calcular saldo
        $this->saldo = $abonos - $gastos - $diesel - $viatico;

        // 4) Comisión fija de la tarifa (o cero si no existe)
        $fija = optional($this->flete->tarifa)->valor_comision ?? 0;

        // 5) Comisión manual: suma de registros de tipo 'Comisión' (o cero si no hay)
        $manual = $this->comisiones()->sum('monto') ?? 0;

        // 6) Total de comisión = fija + manual
        $this->comision = $fija + $manual;

        // 7) Guardar todos los cambios juntos
        $this->save();
    } catch (\Throwable $e) {
        \Log::error('Error al recalcular totales: ' . $e->getMessage());
    }
}




    /**
     * Scope para filtrar por flete.
     *  Rendicion::ofFlete($fleteId)->get();
     */
    public function scopeOfFlete($query, int $fleteId)
    {
        return $query->where('flete_id', $fleteId);
    }

    /**
     * Scope para filtrar solo rendiciones abiertas (estado = "Activo").
     */
    public function scopeActivo($query)
    {
        return $query->where('estado', 'Activo');
    }

    /**
     * Scope para filtrar rendiciones cerradas (estado = "Cerrado").
     */
    public function scopeCerrado($query)
    {
        return $query->where('estado', 'Cerrado');
    }

    /**
     * Scope para ordenar por fecha de creación descendente.
     *  Rendicion::latestFirst()->get();
     */
    public function scopeLatestFirst($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

}
