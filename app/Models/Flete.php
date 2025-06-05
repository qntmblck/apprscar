<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flete extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_principal_id',
        'destino_id',
        'conductor_id',
        'tracto_id',
        'rampla_id',
        'tarifa_id',
        'tipo',
        'estado',
        'kilometraje',
        'rendimiento',
        'fecha_salida',
        'fecha_llegada',
        'comision',
        'pagado',
        'periodo',
        'guiaruta',
    ];

    // Relaciones
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_principal_id');
    }

    public function destino()
    {
        return $this->belongsTo(Destino::class);
    }

    public function conductor()
    {
        return $this->belongsTo(User::class, 'conductor_id');
    }

    public function tracto()
    {
        return $this->belongsTo(Tracto::class);
    }

    public function rampla()
    {
        return $this->belongsTo(Rampla::class);
    }

    public function tarifa()
    {
        return $this->belongsTo(Tarifa::class);
    }

    public function rendicion()
    {
        return $this->hasOne(Rendicion::class);
    }

    public function retorno()
    {
        return $this->hasOne(Retorno::class);
    }
}
