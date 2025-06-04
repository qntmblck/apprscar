<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Rendicion extends Model
{
    use HasFactory;

    protected $table = 'rendiciones';

    protected $fillable = [
        'flete_id',
        'user_id',
        'estado',
        'observaciones',
        'caja_flete',
        'viatico_efectivo',
        'viatico',
        'viatico_calculado',
        'saldo',
        'periodo',
    ];

    protected $appends = [
        'total_gastos',
        'total_diesel',
        'viatico_calculado',
        'saldo_temporal',
    ];

    // Relaciones
    public function flete()
    {
        return $this->belongsTo(Flete::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function gastos()
    {
        return $this->hasMany(Gasto::class);
    }

    public function diesels()
    {
        return $this->hasMany(Diesel::class);
    }

    // Atributos dinámicos
    public function getTotalGastosAttribute()
    {
        return $this->gastos->sum('monto');
    }

    public function getTotalDieselAttribute()
    {
        return $this->diesels->where('metodo_pago', '!=', 'Crédito')->sum('monto');
    }

    public function getViaticoCalculadoAttribute()
    {
        $salida = optional($this->flete->fecha_salida)?->startOfDay();
        $llegada = optional($this->flete->fecha_llegada)?->startOfDay() ?? now()->startOfDay();

        if (!$salida || $salida->gt($llegada)) return 0;

        $dias = $salida->diffInDays($llegada) + 1;

        $fletePosterior = Flete::where('conductor_id', $this->flete->conductor_id)
            ->whereDate('fecha_salida', $llegada)
            ->where('id', '!=', $this->flete->id)
            ->exists();

        if ($fletePosterior) $dias = max(0, $dias - 1);

        return $dias * 15000;
    }

    public function getSaldoTemporalAttribute()
    {
        $viatico = $this->viatico ?? $this->viatico_efectivo ?? $this->viatico_calculado ?? 0;
        return $this->caja_flete - $this->total_diesel - $this->total_gastos - $viatico;
    }

    // Calcula y guarda saldo real
    public function recalcularTotales()
    {
        $gastos = $this->gastos()->sum('monto');
        $diesel = $this->diesels()->where('metodo_pago', '!=', 'Crédito')->sum('monto');
        $viatico = $this->viatico ?? $this->viatico_calculado ?? 0;

        $this->saldo = $this->caja_flete - $gastos - $diesel - $viatico;
        $this->save();
    }

}
