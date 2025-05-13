<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Permite acceso a superadmin o al correo temporalmente autorizado
        if ($user->hasRole('superadmin') || $user->email === 'jcomeaux@ug.uchile.cl') {
            $users = User::with('roles')->get();
            $roles = Role::all();

            return Inertia::render('Auth/Users/Index', [
                'users' => $users,
                'roles' => $roles,
            ]);
        }

        return redirect()->route('home')->with('error', 'Acceso no autorizado.');
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        // Solo añade el rol sin eliminar los otros
        if (!$user->hasRole($request->role)) {
            $user->assignRole($request->role);
        }

        return back()->with('success', 'Rol asignado correctamente.');
    }

    public function removeRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        if ($user->hasRole($request->role)) {
            $user->removeRole($request->role);
        }

        return back()->with('success', 'Rol eliminado correctamente.');
    }
}
