<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pago extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'periodo',
        'total_comision',
        'total_saldo',
        'fecha_pago',
        'detalle',
    ];

    protected $casts = [
        'fecha_pago' => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relaciones
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rendiciones()
    {
        return $this->hasManyThrough(Rendicion::class, Flete::class, 'conductor_id', 'flete_id', 'user_id', 'id')
            ->whereNotNull('periodo')
            ->where('pagado', true);
    }
}
