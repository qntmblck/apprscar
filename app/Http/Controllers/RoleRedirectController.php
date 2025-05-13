<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;

class RoleRedirectController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        $user = auth()->user();

        return match (true) {
            $user->hasRole('superadmin') => redirect('/super/dashboard'),
            $user->hasRole('admin') => redirect('/admin/dashboard'),
            $user->hasRole('cliente') => redirect('/cliente/dashboard'),
            $user->hasRole('conductor') => redirect('/conductor/dashboard'),
            $user->hasRole('colaborador') => redirect('/colaborador/dashboard'),
            default => redirect('/'), // por si no tiene rol aún
        };
    }
}
