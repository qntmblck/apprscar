<?php

namespace App\Models;

use App\Models\Flete;
use App\Models\Rendicion;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Pago extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'periodo',
        'total_comision',
        'total_saldo',
        'fecha_pago',
        'detalle',
    ];

    protected $casts = [
        'fecha_pago' => 'date',
    ];

    /**
     * Asignar automáticamente el "periodo" basado en el último flete.
     */
    protected static function booted()
    {
        static::creating(function (self $pago) {
            $ultimoFlete = Flete::where(function ($q) use ($pago) {
                    $q->where('conductor_id', $pago->user_id)
                      ->orWhere('colaborador_id', $pago->user_id);
                })
                ->latest('fecha_salida')
                ->first();

            if ($ultimoFlete?->fecha_salida) {
                $pago->periodo = Carbon::parse($ultimoFlete->fecha_salida)
                    ->locale('es')
                    ->isoFormat('MMMM');
            }
        });
    }

    /**
     * Relación con el usuario que recibe el pago (conductor o colaborador).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Todas las rendiciones ya pagadas asociadas a este usuario.
     */
    public function rendiciones()
    {
        return $this->hasManyThrough(
            Rendicion::class,
            Flete::class,
            'conductor_id', // Foreign key en Flete
            'flete_id',     // Foreign key en Rendicion
            'user_id',      // Local key en Pago
            'id'            // Local key en Flete
        )->whereNotNull('periodo')
         ->where('pagado', true);
    }
}
