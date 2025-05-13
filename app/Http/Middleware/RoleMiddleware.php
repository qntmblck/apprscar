<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        // Si no está autenticado → redirige al inicio
        if (!$user) {
            return redirect('/');
        }

        // Si está autenticado pero no tiene los roles requeridos → redirige al dashboard general
        if (!$user->hasAnyRole($roles)) {
            return redirect('/dashboard');
        }

        // Tiene el rol → permite el acceso a la ruta protegida
        return $next($request);
    }
}

