<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    use HasFactory;

    protected $fillable = [
        'flete_id',
        'fecha',
        'hora',
        'actividad',
        'observaciones',
    ];

    public function flete()
    {
        return $this->belongsTo(Flete::class);
    }
}
