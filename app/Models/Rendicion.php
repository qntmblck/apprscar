<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rendicion extends Model
{
    use HasFactory;

    protected $fillable = [
        'flete_id',
        'total_rendido',
        'comentario',
        'estado',
    ];

    public function flete()
    {
        return $this->belongsTo(Flete::class);
    }
}
