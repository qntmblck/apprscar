<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Retorno extends Model
{
    use HasFactory;

    protected $fillable = [
        'flete_id',
        'valor',
        'descripcion',
    ];

    public function flete()
    {
        return $this->belongsTo(Flete::class);
    }
}
