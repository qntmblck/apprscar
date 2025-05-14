<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Retorno extends Model
{
    use HasFactory;

    protected $fillable = [
        'flete_id',
        'nombre',
        'km',
        'region',
    ];

    public function flete()
    {
        return $this->belongsTo(Flete::class);
    }
}
