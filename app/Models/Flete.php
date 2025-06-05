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
        'tracto_id',
        'rampla_id',
        'destino_id',
        'tarifa_id',
        'tipo',
        'km_ida',
        'rendimiento',
        'estado',
        'fecha_salida',
        'fecha_llegada',
        'periodo',
        'pagado',
    ];

    protected $casts = [
        'fecha_salida' => 'datetime',
        'fecha_llegada' => 'datetime',
        'pagado' => 'boolean',
    ];

    protected $appends = ['comision'];

    // Relaciones principales
    public function conductor() {
        return $this->belongsTo(User::class, 'conductor_id');
    }

    public function cliente() {
        return $this->belongsTo(Cliente::class, 'cliente_principal_id');
    }

    public function tracto() {
        return $this->belongsTo(Tracto::class);
    }

    public function rampla() {
        return $this->belongsTo(Rampla::class);
    }

    public function destino() {
        return $this->belongsTo(Destino::class);
    }

    public function tarifa() {
        return $this->belongsTo(Tarifa::class);
    }

    public function retorno() {
        return $this->hasOne(Retorno::class);
    }

    public function rendicion() {
        return $this->hasOne(Rendicion::class);
    }

    public function colaboradores() {
        return $this->belongsToMany(User::class, 'colaborador_flete', 'flete_id', 'colaborador_id');
    }

    // Colores para estado (opcional)
    public function getEstadoColorAttribute() {
        return match ($this->estado) {
            'Sin Notificar' => 'bg-red-500',
            'Notificado' => 'bg-green-500',
            default => 'bg-gray-300',
        };
    }

    // Comisión calculada
    public function getComisionAttribute()
    {
        $tarifa = Tarifa::where('cliente_id', $this->cliente_principal_id)
            ->where('destino_id', $this->destino_id)
            ->where('tipo', $this->tipo)
            ->first();

        return $tarifa?->valor_comision ?? 0;
    }
}
