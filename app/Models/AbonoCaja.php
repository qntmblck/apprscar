<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AbonoCaja extends Model
{
    use HasFactory;

    protected $table = 'abono_cajas'; // ajusta si tu tabla se llama distinto

    /**
     * Campos asignables.
     */
    protected $fillable = [
        'rendicion_id',
        'user_id',
        'metodo',    // ej: "Efectivo" / "Transferencia"
        'monto',
    ];

    /**
     * Relación con Rendición.
     * Solo seleccionamos los campos mínimos de rendición:
     * id, flete_id, user_id, saldo (si lo necesitas en front).
     */
    public function rendicion()
    {
        return $this->belongsTo(Rendicion::class)
                    ->select(['id', 'flete_id', 'user_id', 'saldo']);
    }

    /**
     * Relación con Usuario (quien hizo el abono).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')
                    ->select(['id', 'name']);
    }

    /**
     * Relación polimórfica a Documentos (si deseas adjuntar comprobantes).
     * Si no la usas en AbonoCaja, puedes eliminar este método.
     */
    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }

    /**
     * Accessor para formatear el monto en CLP.
     */
    public function getMontoFormatAttribute(): string
    {
        return '$' . number_format($this->monto, 0, ',', '.');
    }

    /**
     * Scope para filtrar abonos por rendición.
     */
    public function scopeOfRendicion($query, int $rendicionId)
    {
        return $query->where('rendicion_id', $rendicionId);
    }

    /**
     * Scope para ordenar los abonos más recientes primero.
     */
    public function scopeLatestFirst($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
