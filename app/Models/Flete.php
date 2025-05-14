<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Flete extends Model
{
    use HasFactory;

    protected $fillable = [
        'conductor_id',
        'cliente_principal_id',
        'destino_id',
        'retorno_id',
        'tarifa_id',
        'tracto_id',
        'rampla_id',
        'fecha_salida',
        'fecha_llegada',
        'estado',
    ];

    public function conductor()
    {
        return $this->belongsTo(User::class, 'conductor_id');
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_principal_id');
    }

    public function destino()
    {
        return $this->belongsTo(Destino::class);
    }

    public function retorno()
    {
        return $this->belongsTo(Retorno::class);
    }

    public function tarifa()
    {
        return $this->belongsTo(Tarifa::class);
    }

    public function tracto()
    {
        return $this->belongsTo(Tracto::class);
    }

    public function rampla()
    {
        return $this->belongsTo(Rampla::class);
    }

    public function gastos()
    {
        return $this->hasMany(Gasto::class);
    }

    public function rendicion()
    {
        return $this->hasOne(Rendicion::class);
    }

    public function mantenciones()
    {
        return $this->hasMany(Mantencion::class);
    }

    public function agenda()
    {
        return $this->hasOne(Agenda::class);
    }

    // Relación polimórfica con documentos
    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }
}
