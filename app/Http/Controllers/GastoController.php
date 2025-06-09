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
            'tipo'         => 'required|string',
            'descripcion'  => 'nullable|string',
            'foto'         => 'nullable|image|max:2048',
        ]);

        try {
            $rendicion = Rendicion::findOrFail($validated['rendicion_id']);

            if (! $rendicion->user_id) {
                return response()->json([
                    'error' => 'La rendición no tiene un conductor asignado.'
                ], 422);
            }

            Gasto::create([
                'flete_id'     => $validated['flete_id'],
                'rendicion_id' => $rendicion->id,
                'user_id'      => $rendicion->user_id, // ← Cambié aquí
                'monto'        => $validated['monto'],
                'tipo'         => $validated['tipo'],
                'descripcion'  => $validated['descripcion'] ?? null,
                'foto'         => $request->hasFile('foto')
                                    ? $request->file('foto')->store('gastos', 'public')
                                    : null,
            ]);

            $rendicion->recalcularTotales();

            $flete = Flete::with([
                'cliente',
                'destino',
                'conductor',
                'tracto',
                'rampla',
                'rendicion.abonos',
                'rendicion.gastos',
                'rendicion.diesels',
            ])->findOrFail($validated['flete_id']);

            if ($flete->rendicion) {
                $flete->rendicion->makeVisible([
                    'saldo_temporal',
                    'total_gastos',
                    'total_diesel',
                    'viatico_calculado',
                ]);
            }

            return response()->json([
                'message' => 'Gasto registrado correctamente.',
                'flete'   => $flete,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al registrar gasto: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
{
    $registro = \App\Models\Gasto::find($id);
    if (! $registro) {
        return response()->json(['message' => 'Gasto no encontrado'], 404);
    }

    $rendicion = $registro->rendicion;
    $flete_id  = $rendicion->flete_id;
    $registro->delete();

    $flete = \App\Models\Flete::with([
        'cliente',
        'conductor',
        'tracto',
        'rampla',
        'destino',
        'rendicion.abonos'  => fn($q) => $q->orderByDesc('created_at'),
        'rendicion.diesels' => fn($q) => $q->orderByDesc('created_at'),
        'rendicion.gastos'  => fn($q) => $q->orderByDesc('created_at'),
    ])->find($flete_id);

    if ($flete->rendicion) {
        $flete->rendicion->makeVisible([
            'saldo_temporal',
            'total_diesel',
            'total_gastos',
            'viatico_efectivo',
            'viatico_calculado',
            'caja_flete_acumulada',
        ]);
    }

    return response()->json([
        'message' => '✅ Gasto eliminado correctamente.',
        'flete'   => $flete,
    ]);
}

}
