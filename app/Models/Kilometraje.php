<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kilometraje extends Model
{
    use HasFactory;

    protected $table = 'kilometrajes';

    protected $fillable = [
        'flete_id',
        'tracto_id',
        'rampla_id',
        'km_inicio',
        'km_fin',
        'km_recorridos',
        'fecha_registro',
    ];

    protected $casts = [
        'fecha_registro' => 'datetime',
    ];

    public function flete()
    {
        return $this->belongsTo(Flete::class, 'flete_id');
    }

    public function tracto()
    {
        return $this->belongsTo(Tracto::class, 'tracto_id');
    }

    public function rampla()
    {
        return $this->belongsTo(Rampla::class, 'rampla_id');
    }
}
