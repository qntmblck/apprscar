<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;

class RoleRedirectController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        $user = auth()->user();

        return match (true) {
            // superadmin y admin van al index de fletes
            $user->hasRole('superadmin'),
            $user->hasRole('admin')   => redirect('/fletes'),


            $user->hasRole('cliente')  => redirect('/cliente/dashboard'),
            $user->hasRole('conductor')=> redirect('/conductor/dashboard'),
            $user->hasRole('colaborador')=> redirect('/colaborador/dashboard'),

            default                    => redirect('/dashboard'),
        };
    }
}
