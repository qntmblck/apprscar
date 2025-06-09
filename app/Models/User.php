<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use App\Models\Flete;
use App\Models\Cliente;
use App\Models\Rendicion;
use App\Models\Documento;
use App\Models\Gasto;
use App\Models\Agenda;
use App\Models\Mantencion;
use App\Models\Pago;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * 1. Campos asignables
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
    ];

    /**
     * 2. Campos ocultos y casts
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * 3. Relaciones
     */
    public function fletes()
    {
        // Como conductor
        return $this->hasMany(Flete::class, 'conductor_id');
    }

    public function fletesComoColaborador()
    {
        // Como colaborador
        return $this->hasMany(Flete::class, 'colaborador_id');
    }

    public function cliente()
    {
        return $this->hasOne(Cliente::class, 'user_id');
    }

    public function rendiciones()
    {
        return $this->hasMany(Rendicion::class, 'conductor_id');
    }

    public function documentos()
    {
        return $this->morphMany(Documento::class, 'documentable');
    }

    public function gastos()
    {
        return $this->hasMany(Gasto::class);
    }

    public function agendas()
    {
        return $this->hasMany(Agenda::class);
    }

    public function mantenciones()
    {
        return $this->hasMany(Mantencion::class);
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }

    /**
     * 4. Hook: antes de eliminar un usuario (conductor o colaborador),
     *    preserva su nombre en los fletes correspondientes y evita cascada.
     */
    protected static function booted()
    {
        static::deleting(function (self $user) {
            // Para los fletes donde era conductor
            Flete::where('conductor_id', $user->id)
                ->update(['conductor_nombre' => $user->name, 'conductor_id' => null]);

            // Para los fletes donde era colaborador
            Flete::where('colaborador_id', $user->id)
                ->update(['colaborador_nombre' => $user->name, 'colaborador_id' => null]);
        });
    }
}
