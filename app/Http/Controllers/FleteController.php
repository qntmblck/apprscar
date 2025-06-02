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

        $query = Flete::query()->with([
            'cliente',
            'conductor',
            'tracto',
            'rampla',
            'destino',
            'rendicion.gastos',
            'rendicion.diesels',
        ]);

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

        $fletes = $query->latest()->get();

        $fletes->each(function ($flete) {
            if ($flete->rendicion) {
                $flete->rendicion->makeVisible([
                    'saldo_temporal',
                    'total_gastos',
                    'total_diesel',
                    'viatico_calculado',
                ]);
            }
        });

        return Inertia::render('Fletes/Index', [
            'fletes' => $fletes,
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
            'rendicion_id' => 'required|exists:rendiciones,id',
            'fecha_termino' => 'required|date',
            'viatico_efectivo' => 'required|numeric|min:0',
        ]);

        $flete = Flete::findOrFail($validated['flete_id']);
        $flete->update(['fecha_llegada' => $validated['fecha_termino']]);

        $rendicion = Rendicion::with(['flete', 'diesels', 'gastos'])->findOrFail($validated['rendicion_id']);

        $rendicion->update([
            'viatico_efectivo' => $validated['viatico_efectivo'],
            'viatico' => $validated['viatico_efectivo'],
            'viatico_calculado' => $rendicion->viatico_calculado,
            'saldo' => $rendicion->saldo,
        ]);

        $rendicion->recalcularTotales();

        $flete->load([
            'cliente',
            'conductor',
            'tracto',
            'rampla',
            'destino',
            'rendicion.gastos',
            'rendicion.diesels',
        ]);

        $flete->rendicion->makeVisible([
            'saldo_temporal',
            'total_gastos',
            'total_diesel',
            'viatico_calculado',
        ]);

        return response()->json([
            'message' => 'Flete finalizado correctamente.',
            'flete' => $flete,
        ]);
    }
}
