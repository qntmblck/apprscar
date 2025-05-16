<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flete;
use App\Models\Cliente;
use App\Models\Tracto;
use App\Models\User;
use App\Models\Rendicion;
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

    public function finalizar(Request $request)
    {
        $validated = $request->validate([
            'flete_id' => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendicions,id',
            'fecha_termino' => 'required|date',
            'viatico_efectivo' => 'required|numeric|min:0',
        ]);

        $flete = Flete::findOrFail($validated['flete_id']);
        $rendicion = Rendicion::with('flete.conductor', 'diesels', 'gastos')->findOrFail($validated['rendicion_id']);

        $flete->update([
            'fecha_llegada' => $validated['fecha_termino'],
        ]);

        $rendicion->update([
            'viatico_efectivo' => $validated['viatico_efectivo'],
            'viatico_calculado' => $rendicion->viatico_calculado,
            'saldo' => $rendicion->saldo,
        ]);

        return response()->json([
            'message' => 'Flete finalizado correctamente.',
            'viatico' => $rendicion->viatico_calculado,
        ]);
    }
}
