<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Cliente;
use App\Models\Destino;
use App\Models\User;
use App\Models\Tracto;
use App\Models\Rampla;
use App\Models\Rendicion;
use App\Models\Retorno;
use App\Models\Tarifa;

class Flete extends Model
{
    use HasFactory;

    /**
     * 1. Campos asignables
     */
    protected $fillable = [
        'cliente_principal_id',
        'destino_id',
        'conductor_id',
        'colaborador_id',
        'tarifa_id',
        'tipo',
        'estado',
        'fecha_salida',
        'fecha_llegada',
        'kilometraje',
        'rendimiento',
        'comision',
        'retorno',
        'guiaruta',
        'pagado',
    ];

    /**
     * 2. Relaciones cargadas siempre
     */
    protected $with = [
        'clientePrincipal',
        'destino',
        'conductor',
        'colaborador',
        'tracto',
        'rampla',
        'rendicion',
    ];

    /**
     * 3. Accessors
     */
    protected $appends = [
        'valor_factura',
    ];

    /**
     * 4. Relación "cliente principal"
     */
    public function clientePrincipal()
    {
        return $this->belongsTo(Cliente::class, 'cliente_principal_id');
    }

    /**
     * Alias para "cliente"
     */
    public function cliente()
    {
        return $this->clientePrincipal();
    }

    /**
     * 5. Relación con Destino
     */
    public function destino()
    {
        return $this->belongsTo(Destino::class, 'destino_id');
    }

    /**
     * 6. Relación con Conductor
     */
    public function conductor()
    {
        return $this->belongsTo(User::class, 'conductor_id');
    }

    /**
     * 7. Relación con Colaborador
     */
    public function colaborador()
    {
        return $this->belongsTo(User::class, 'colaborador_id');
    }

    /**
     * 8. Relación con Tracto
     */
    public function tracto()
    {
        return $this->belongsTo(Tracto::class, 'tracto_id');
    }

    /**
     * 9. Relación con Rampla
     */
    public function rampla()
    {
        return $this->belongsTo(Rampla::class, 'rampla_id');
    }

    /**
     * 10. Relación con Rendición
     */
    public function rendicion()
    {
        return $this->hasOne(Rendicion::class, 'flete_id');
    }

    /**
     * 11. Relación con Retorno
     */
    public function retorno()
    {
        return $this->hasOne(Retorno::class, 'flete_id');
    }

    /**
     * 12. Relación con Tarifa
     */
    public function tarifa()
    {
        return $this->belongsTo(Tarifa::class, 'tarifa_id');
    }

    /**
     * 13. Accessor: valor_factura ajustado
     *    - Conductor: valor completo
     *    - Colaborador: 10% del valor_factura
     */
    public function getValorFacturaAttribute(): float
    {
        $base = $this->tarifa?->valor_factura ?? 0;
        return $this->colaborador_id
            ? round($base * 0.1, 2)
            : $base;
    }
}
