<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Rendicion extends Model
{
    use HasFactory;

    protected $fillable = [
        'flete_id',
        'user_id',
        'estado',
        'observaciones',
        'caja_flete',
        'viatico_efectivo',
        'viatico_calculado',
        'saldo',
    ];

    public function flete() {
        return $this->belongsTo(Flete::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function gastos() {
        return $this->hasMany(Gasto::class);
    }

    public function diesels() {
        return $this->hasMany(Diesel::class);
    }

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
        $salida = optional($this->flete->fecha_salida)->startOfDay();
        $llegada = optional($this->flete->fecha_llegada)->startOfDay();

        if (!$salida || !$llegada || $salida->gt($llegada)) return 0;

        $dias = $salida->diffInDays($llegada) + 1;

        $fletePosterior = \App\Models\Flete::where('conductor_id', $this->flete->conductor_id)
            ->whereDate('fecha_salida', '=', $llegada)
            ->where('id', '!=', $this->flete->id)
            ->exists();

        if ($fletePosterior) $dias -= 1;

        return $dias * 15000;
    }

    public function getSaldoAttribute()
    {
        return $this->caja_flete
            - $this->total_diesel
            - $this->total_gastos
            - $this->viatico_efectivo;
    }
}
