<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Diesel;
use App\Models\Flete;
use App\Models\Rendicion;

class DieselController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id' => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'monto' => 'required|numeric|min:0',
            'litros' => 'required|numeric|min:0',
            'metodo_pago' => 'required|in:Efectivo,Transferencia,Crédito',
            'foto' => 'nullable|image|max:2048',
        ]);

        try {
            $rendicion = Rendicion::findOrFail($validated['rendicion_id']);

            if (!$rendicion->user_id) {
                return response()->json([
                    'error' => 'La rendición no tiene un conductor asignado.'
                ], 422);
            }

            $diesel = Diesel::create([
                'flete_id' => $validated['flete_id'],
                'rendicion_id' => $rendicion->id,
                'usuario_id' => $rendicion->user_id, // ✅ conductor asignado
                'monto' => $validated['monto'],
                'litros' => $validated['litros'],
                'metodo_pago' => $validated['metodo_pago'],
                'foto' => $request->hasFile('foto')
                    ? $request->file('foto')->store('diesel', 'public')
                    : null,
            ]);

            $diesel->rendicion->recalcularTotales();

            $flete = Flete::with([
                'cliente',
                'destino',
                'conductor',
                'tracto',
                'rampla',
                'rendicion.gastos',
                'rendicion.diesels',
            ])->find($validated['flete_id']);

            $flete->rendicion->makeVisible([
                'saldo_temporal',
                'total_gastos',
                'total_diesel',
                'viatico_calculado',
            ]);

            return response()->json([
                'message' => 'Diesel registrado correctamente.',
                'flete' => $flete,
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al registrar diesel: ' . $e->getMessage(),
            ], 500);
        }
    }
}
