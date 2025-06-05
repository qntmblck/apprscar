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
            'flete_id' => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'monto' => 'required|numeric|min:0',
            'tipo' => 'required|string',
            'descripcion' => 'nullable|string',
            'foto' => 'nullable|image|max:2048',
        ]);

        try {
            $rendicion = Rendicion::findOrFail($validated['rendicion_id']);

            if (!$rendicion->user_id) {
                return response()->json([
                    'error' => 'La rendición no tiene un conductor asignado.'
                ], 422);
            }

            Gasto::create([
                'flete_id'     => $validated['flete_id'],
                'rendicion_id' => $rendicion->id,
                'usuario_id'   => $rendicion->user_id,
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
                'flete' => $flete,
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al registrar gasto: ' . $e->getMessage(),
            ], 500);
        }
    }
}
