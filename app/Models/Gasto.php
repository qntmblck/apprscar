<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Gasto extends Model
{
    use HasFactory;

    protected $fillable = [
    'flete_id',
    'usuario_id',
    'tipo',
    'monto',
    'descripcion',
];


    public function flete()
    {
        return $this->belongsTo(Flete::class);
    }

    public function user()
{
    return $this->belongsTo(User::class, 'usuario_id');
}


    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }
}
