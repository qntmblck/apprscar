<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flete;
use App\Models\Cliente;
use App\Models\Tracto;
use App\Models\User;
use Inertia\Inertia;

class FleteController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = Flete::query()->with(['cliente', 'conductor', 'tracto', 'rampla']);

        if ($user->hasRole('conductor')) {
            $query->where('conductor_id', $user->id);
        } elseif ($user->hasRole('cliente')) {
            $query->where('cliente_principal_id', $user->cliente_id);
        } elseif ($user->hasRole('colaborador')) {
            $query->whereHas('colaboradores', fn($q) => $q->where('colaborador_id', $user->id));
        }

        if ($request->filled('conductor_id')) {
            $query->where('conductor_id', $request->conductor_id);
        }

        if ($request->filled('cliente_id')) {
            $query->where('cliente_principal_id', $request->cliente_id);
        }

        if ($request->filled('tracto_id')) {
            $query->where('tracto_id', $request->tracto_id);
        }

        return Inertia::render('Fletes/Index', [
            'fletes' => $query->latest()->get(),
            'role' => $user->getRoleNames()->first(),
            'filters' => $request->only('conductor_id', 'cliente_id', 'tracto_id'),
            'conductores' => User::role('conductor')->get(['id', 'name']),
            'clientes' => Cliente::all(['id', 'razon_social']),
            'tractos' => Tracto::all(['id', 'patente']),
        ]);
    }
}
