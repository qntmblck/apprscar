<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SolicitudTransporte extends Model
{
    protected $table = 'solicitudes_transporte';

    protected $fillable = [
        'user_id',
        'origin',
        'destination',
        'cargo_type',
        'cargo_weight_kg',
        'pickup_date',
        'description',
        'contact_phone',
        'contact_email',
        'status',
        'admin_notes',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'pickup_date' => 'date',
        'approved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
