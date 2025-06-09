<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Flete;
use App\Models\Tracto;
use App\Models\Rampla;

class Mantencion extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',     // quien registra
        'flete_id',    // opcional: asociada a un servicio
        'tracto_id',   // opcional
        'rampla_id',   // opcional
        'detalle',     // descripción del trabajo
        'fecha',       // fecha de la mantención
        'costo',       // monto en pesos
    ];

    protected $casts = [
        'fecha' => 'date',
        'costo' => 'decimal:2',
    ];

    /**
     * 1) Usuario que registró la mantención.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * 2) Flete durante el cual se realizó la mantención (si aplica).
     */
    public function flete()
    {
        return $this->belongsTo(Flete::class, 'flete_id');
    }

    /**
     * 3) Tracto al que se le hizo la mantención (nullable).
     */
    public function tracto()
    {
        return $this->belongsTo(Tracto::class, 'tracto_id');
    }

    /**
     * 4) Rampla al que se le hizo la mantención (nullable).
     */
    public function rampla()
    {
        return $this->belongsTo(Rampla::class, 'rampla_id');
    }
}
