<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flete;
use Inertia\Inertia;

class FleteController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = Flete::query()->with(['cliente', 'conductor', 'tracto', 'rampla']);

        // Filtrar fletes según rol del usuario
        if ($user->hasRole('conductor')) {
            $query->where('conductor_id', $user->id);
        } elseif ($user->hasRole('cliente')) {
            $query->where('cliente_principal_id', $user->cliente_id);
        } elseif ($user->hasRole('colaborador')) {
            $query->whereHas('colaboradores', fn($q) => $q->where('colaborador_id', $user->id));
        }

        // Filtros adicionales (aplicables a resultados ya filtrados por rol)
        if ($request->filled('conductor')) {
            $query->whereHas('conductor', fn($q) => $q->where('name', 'like', "%{$request->conductor}%"));
        }

        if ($request->filled('cliente')) {
            $query->whereHas('cliente', fn($q) => $q->where('nombre', 'like', "%{$request->cliente}%"));
        }

        if ($request->filled('patente')) {
            $query->whereHas('tracto', fn($q) => $q->where('patente', 'like', "%{$request->patente}%"));
        }

        return Inertia::render('Fletes/Index', [
            'fletes' => $query->latest()->get(),
            'role' => $user->getRoleNames()->first(),
            'filters' => $request->only('conductor', 'cliente', 'patente'),
        ]);
    }
}
