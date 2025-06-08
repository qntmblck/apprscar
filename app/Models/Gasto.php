<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Flete;
use App\Models\Rendicion;
use App\Models\User;
use App\Models\Documento;

class Gasto extends Model
{
    use HasFactory;

    /**
     * Campos que se pueden asignar en masa.
     */
    protected $fillable = [
        'flete_id',
        'rendicion_id',
        'user_id',
        'tipo',
        'monto',
        'descripcion',
        'foto',
    ];

    /**
     * Para que el accessor monto_format se incluya siempre en el array/JSON
     */
    protected $appends = ['monto_format'];

    /**
     * Relación con Flete.
     * Seleccionamos únicamente los campos mínimos para optimizar la consulta.
     */
    public function flete()
    {
        return $this->belongsTo(Flete::class)
                    ->select(['id', 'destino_id', 'cliente_principal_id']);
    }

    /**
     * Relación con Rendición.
     * Traemos solo los campos que necesitamos para recalcular o mostrar datos básicos.
     */
    public function rendicion()
    {
        return $this->belongsTo(Rendicion::class)
                    ->select(['id', 'flete_id', 'user_id', 'saldo', 'viatico_calculado']);
    }

    /**
     * Relación con el usuario (conductor/encargado) que registró este gasto.
     * Seleccionamos únicamente 'id' y 'name' para ahorrar data.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')
                    ->select(['id', 'name']);
    }

    /**
     * Relación polimórfica a Documentos (si cada gasto puede tener documentos adjuntos).
     * Si no usas éste, elimina el método.
     */
    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }

    /**
     * Accessor para mostrar el monto formateado en CLP.
     * Uso en front: $gasto->monto_format
     */
    public function getMontoFormatAttribute(): string
    {
        return '$' . number_format($this->monto, 0, ',', '.');
    }

    /**
     * Scope para filtrar por flete.
     * Ejemplo: Gasto::ofFlete($idFlete)->get();
     */
    public function scopeOfFlete($query, int $fleteId)
    {
        return $query->where('flete_id', $fleteId);
    }

    /**
     * Scope para filtrar por rendición.
     */
    public function scopeOfRendicion($query, int $rendicionId)
    {
        return $query->where('rendicion_id', $rendicionId);
    }

    /**
     * Scope para ordenar los gastos con los más recientes primero.
     */
    public function scopeLatestFirst($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
