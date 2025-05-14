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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tracto()
    {
        return $this->belongsTo(Tracto::class);
    }

    public function rampla()
    {
        return $this->belongsTo(Rampla::class);
    }
}
