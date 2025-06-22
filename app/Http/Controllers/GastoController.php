<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gasto;
use App\Models\Flete;
use App\Models\Rendicion;

class GastoController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id'     => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'monto'        => 'required|numeric|min:0',
            'tipo'         => 'required|string|max:50',
            'descripcion'  => 'nullable|string|max:255',
            'foto'         => 'nullable|image|max:2048',
        ]);

        try {
            $rendicion = Rendicion::findOrFail($validated['rendicion_id']);

            if (! $rendicion->user_id) {
                return response()->json([
                    'error' => 'La rendición no tiene un conductor asignado.'
                ], 422);
            }

            // 1) Crear el gasto
            Gasto::create([
                'flete_id'     => $validated['flete_id'],
                'rendicion_id' => $rendicion->id,
                'user_id'      => $rendicion->user_id,
                'monto'        => $validated['monto'],
                'tipo'         => $validated['tipo'],
                'descripcion'  => $validated['descripcion'] ?? null,
                'foto'         => $request->hasFile('foto')
                                    ? $request->file('foto')->store('gastos', 'public')
                                    : null,
            ]);

            // 2) Recalcular totales (incluye comisión)
            $rendicion->recalcularTotales();
            $rendicion->save();

            // 3) Recargar flete con todas las relaciones
            $flete = Flete::with([
                'clientePrincipal:id,razon_social',
                'conductor:id,name',
                'colaborador:id,name',
                'tracto:id,patente',
                'rampla:id,patente',
                'destino:id,nombre',
                'rendicion.abonos'  => fn($q) => $q->orderByDesc('created_at'),
                'rendicion.gastos'  => fn($q) => $q->orderByDesc('created_at'),
                'rendicion.diesels' => fn($q) => $q->orderByDesc('created_at'),
            ])->findOrFail($validated['flete_id']);

            // 4) Exponer campos calculados para la tarjeta
            $flete->makeVisible(['retorno']);
            $flete->rendicion->makeVisible([
                'saldo',
                'total_gastos',
                'total_diesel',
                'viatico_calculado',
                'comision',
            ]);

            return response()->json([
                'message' => '✅ Gasto registrado correctamente.',
                'flete'   => $flete,
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al registrar gasto',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Gasto $gasto)
    {
        // 1) Obtener ID del flete antes de borrar
        $fleteId = $gasto->flete_id;

        // 2) Eliminar el gasto
        $gasto->delete();

        // 3) Recargar flete con todas las relaciones
        $flete = Flete::with([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'colaborador:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'destino:id,nombre',
            'rendicion.abonos'  => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.gastos'  => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.diesels' => fn($q) => $q->orderByDesc('created_at'),
        ])->findOrFail($fleteId);

        // 4) Recalcular totales luego de eliminar
        $flete->rendicion->recalcularTotales();
        $flete->rendicion->save();

        // 5) Exponer campos calculados para la tarjeta
        $flete->makeVisible(['retorno']);
        $flete->rendicion->makeVisible([
            'saldo',
            'total_gastos',
            'total_diesel',
            'viatico_calculado',
            'comision',
        ]);

        return response()->json([
            'message' => '✅ Gasto eliminado correctamente.',
            'flete'   => $flete,
        ], 200);
    }
}
