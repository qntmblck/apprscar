<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Diesel extends Model
{
    use HasFactory;

    // Si tu tabla se llama 'diesels', no es necesario especificar $table.
    // protected $table = 'diesels';

    /**
     * Campos asignables en masa.
     */
    protected $fillable = [
        'flete_id',
        'rendicion_id',
        'user_id',
        'litros',
        'monto',
        'metodo_pago',
        'foto',
    ];

    /**
     * Relación con Flete.
     * Solo traemos la columna 'id' y, si necesitas mostrar algo más,
     * agrega el campo en 'select'.
     */
    public function flete()
    {
        return $this->belongsTo(Flete::class)
                    ->select(['id', 'destino_id', 'cliente_principal_id']);
    }

    /**
     * Relación con Rendicion.
     * Al consultar desde Flete::with('rendicion.diesels'), ya
     * estamos cargando los diesels. Si en otro contexto quieres
     * la rendición completa, ajusta el select allí.
     */
    public function rendicion()
    {
        return $this->belongsTo(Rendicion::class)
                    ->select(['id', 'flete_id', 'user_id', 'saldo', 'viatico_calculado']);
    }

    /**
     * Relación con el usuario (conductor) que registró este Diesel.
     * Con 'user' en lugar de 'usuario' para ser consistente con el resto de modelos.
     * Seleccionamos solo 'id' y 'name' para optimizar la carga.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')
                    ->select(['id', 'name']);
    }

    /**
     * Relación polimórfica a Documentos (si necesitas adjuntar archivos extra).
     * Si no lo ocupas en este modelo, puedes eliminar este método.
     */
    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }

    /**
     * Accessor para formatear el monto con miles y prefijo '$'.
     */
    public function getMontoFormatAttribute(): string
    {
        return '$' . number_format($this->monto, 0, ',', '.');
    }

    /**
     * Accessor para formatear los litros (por si quieres mostrarlo con comas).
     */
    public function getLitrosFormatAttribute(): string
    {
        return number_format($this->litros, 0, ',', '.') . ' L';
    }

    /**
     * Scope para filtrar por flete (muy útil si aplicas filtros en el controlador).
     *
     * Ejemplo de uso:
     *   Diesel::query()->ofFlete($fleteId)->get();
     */
    public function scopeOfFlete($query, int $fleteId)
    {
        return $query->where('flete_id', $fleteId);
    }

    /**
     * Scope para filtrar por rendición (si solo necesitas cargar diesel
     * de una rendición en particular).
     *
     * Ejemplo:
     *   Diesel::query()->ofRendicion($rendicionId)->get();
     */
    public function scopeOfRendicion($query, int $rendicionId)
    {
        return $query->where('rendicion_id', $rendicionId);
    }

    /**
     * Scope para ordenar por fecha de creación descendente (últimos registros primero).
     *
     * Ejemplo:
     *   Diesel::query()->latestFirst()->get();
     */
    public function scopeLatestFirst($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
