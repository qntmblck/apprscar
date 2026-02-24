<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostulacionConductor extends Model
{
    protected $table = 'postulaciones_conductor';

    protected $fillable = [
        'user_id',
        'phone',
        'city',
        'license_type',
        'experience_years',
        'cv_path',
        'notes',
        'status',
        'admin_notes',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];
}
