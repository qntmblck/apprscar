<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Flete;
use App\Models\User;

class Notificado extends Model
{
    use HasFactory;

    /** 1. Campos asignables **/
    protected $fillable = [
        'flete_id',
        'user_id',        // conductor o colaborador
        'fecha',          // fecha de notificación
        'tipo',           // p.ej. 'cierre', 'recordatorio'
        'descripcion',    // cuerpo del correo
        'observaciones',  // notas internas
    ];

    /** 2. Casts **/
    protected $casts = [
        'fecha' => 'datetime',
    ];

    /** 3. Relaciones **/

    // Flete que se notifica
    public function flete()
    {
        return $this->belongsTo(Flete::class, 'flete_id');
    }

    // Usuario destinatario: conductor o colaborador
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Adicionales del flete notificado
    public function adicionales()
    {
        return $this->flete->adicionales();
    }

    /** 4. Accessors de email **/

    // Email del titular (conductor o colaborador)
    public function getEmailTitularAttribute(): ?string
    {
        return $this->user?->email;
    }

    // Email del cliente principal
    public function getEmailClienteAttribute(): ?string
    {
        return $this->flete?->cliente_nombre
            ? $this->flete->cliente_nombre // si guardaste snapshot
            : $this->flete->clientePrincipal?->user?->email;
    }

    // Ambos destinatarios en un array
    public function getDestinatariosAttribute(): array
    {
        return array_unique(array_filter([
            $this->email_titular,
            $this->email_cliente,
        ]));
    }

    /** 5. Appended attributes **/
    protected $appends = [
        'email_titular',
        'email_cliente',
        'destinatarios',
    ];
}
