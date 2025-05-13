<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();
        $roles = Role::all();

        return Inertia::render('Auth/Users/Index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        if (!$user->hasRole($request->role)) {
            $user->assignRole($request->role);
        }

        return back()->with('success', "Rol '{$request->role}' asignado correctamente.");
    }

    public function removeRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        // Previene que se remueva el rol superadmin
        if ($request->role === 'superadmin') {
            return back()->with('error', 'No se puede eliminar el rol superadmin.');
        }

        if ($user->hasRole($request->role)) {
            $user->removeRole($request->role);
        }

        return back()->with('success', "Rol '{$request->role}' eliminado correctamente.");
    }
}
