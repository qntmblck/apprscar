<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Agenda extends Model
{
    use HasFactory;

    protected $fillable = [
        'flete_id',
        'user_id',
        'fecha',
        'descripcion',
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
