<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Mantencion extends Model
{
    use HasFactory;

    protected $fillable = [
        'flete_id',
        'tipo',
        'descripcion',
        'fecha',
        'costo',
    ];

    public function flete()
    {
        return $this->belongsTo(Flete::class);
    }
}
