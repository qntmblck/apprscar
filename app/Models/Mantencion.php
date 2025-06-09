<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Mantencion extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tracto_id',
        'rampla_id',
        'detalle',
        'fecha',
        'costo',
    ];

    protected $casts = [
        'fecha' => 'date',
        'costo' => 'decimal:2',
    ];

    /**
     * Relación al usuario que registra la mantención.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación al tracto (nullable).
     */
    public function tracto()
    {
        return $this->belongsTo(Tracto::class);
    }

    /**
     * Relación a la rampla (nullable).
     */
    public function rampla()
    {
        return $this->belongsTo(Rampla::class);
    }
}
