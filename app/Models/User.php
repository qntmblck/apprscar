<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function fletes()
    {
        return $this->hasMany(Flete::class, 'conductor_id');
    }

    public function cliente()
    {
        return $this->hasOne(Cliente::class);
    }

    public function rendiciones()
    {
        return $this->hasMany(Rendicion::class);
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
}
