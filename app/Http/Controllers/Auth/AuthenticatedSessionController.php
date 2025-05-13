<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view or redirect if already authenticated.
     */
    public function create(): Response|RedirectResponse
    {
        if (Auth::check()) {
            $user = Auth::user();

            return match (true) {
                $user->hasRole('superadmin') => redirect('/super/dashboard'),
                $user->hasRole('admin') => redirect('/admin/dashboard'),
                $user->hasRole('cliente') => redirect('/cliente/dashboard'),
                $user->hasRole('conductor') => redirect('/conductor/dashboard'),
                $user->hasRole('colaborador') => redirect('/colaborador/dashboard'),
                default => redirect('/dashboard'),
            };
        }

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = $request->user();

        return match (true) {
            $user->hasRole('superadmin') => redirect('/super/dashboard'),
            $user->hasRole('admin') => redirect('/admin/dashboard'),
            $user->hasRole('cliente') => redirect('/cliente/dashboard'),
            $user->hasRole('conductor') => redirect('/conductor/dashboard'),
            $user->hasRole('colaborador') => redirect('/colaborador/dashboard'),
            default => redirect('/dashboard'), // por si no tiene rol aún
        };
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
