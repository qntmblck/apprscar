<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Retorno extends Model
{
    use HasFactory;

    protected $table = 'retornos';

    protected $fillable = [
        'flete_id',
        'valor',
        'descripcion',
    ];

    /**
     * Relación con Flete.
     * Sólo cargamos el id, pero si necesitas mostrar algo más de Flete
     * (como cliente o destino), ajusta el select al nivel que requieras.
     */
    public function flete()
    {
        return $this->belongsTo(Flete::class)
                    ->select(['id', 'destino_id', 'cliente_principal_id']);
    }

    /**
     * Accessor para formatear el valor en CLP.
     */
    public function getValorFormatAttribute(): string
    {
        return '$' . number_format($this->valor, 0, ',', '.');
    }

    /**
     * Scope para filtrar retornos por flete.
     */
    public function scopeOfFlete($query, int $fleteId)
    {
        return $query->where('flete_id', $fleteId);
    }

    /**
     * Scope para ordenar por fecha más reciente primero.
     */
    public function scopeLatestFirst($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
