<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notificado extends Model
{
    protected $fillable = [
        'flete_id',
        'user_id',
        'fecha',
        'tipo',
        'monto',
        'descripcion',
        'imagen',
        'mensaje',
        'observaciones',
    ];

    protected $casts = [
        'fecha' => 'datetime',
    ];

    public function flete()
    {
        return $this->belongsTo(Flete::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
