<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gasto;
use App\Models\Flete;
use App\Models\Rendicion;

class ComisionController extends Controller
{
    /**
     * Store a newly created Comisión:
     * - crea un Gasto tipo “Comisión”
     * - recalcula totales en la rendición (incluye comisión automática)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id'     => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'monto'        => 'required|numeric|min:0',
            'descripcion'  => 'nullable|string|max:255',
        ]);

        try {
            // 1) Registrar el gasto como tipo Comisión
            Gasto::create([
                'flete_id'     => $validated['flete_id'],
                'rendicion_id' => $validated['rendicion_id'],
                'tipo'         => 'Comisión',
                'descripcion'  => $validated['descripcion'] ?? 'Comisión manual',
                'monto'        => $validated['monto'],
            ]);

            // 2) Recalcular y guardar totales en la rendición
            $rendicion = Rendicion::findOrFail($validated['rendicion_id']);
            $rendicion->recalcularTotales();
            $rendicion->save();

            // 3) Recargar el flete con todas las relaciones necesarias
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
                'message' => '✅ Comisión registrada correctamente.',
                'flete'   => $flete,
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al registrar comisión',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the comisión:
     * - elimina el Gasto de tipo “Comisión”
     * - recalcula totales en la rendición
     */
    public function destroy($gastoId)
    {
        $gasto = Gasto::findOrFail($gastoId);
        $rendicionId = $gasto->rendicion_id;
        $fleteId     = $gasto->flete_id;
        $gasto->delete();

        // 1) Recalcular y guardar totales en la rendición
        $rendicion = Rendicion::findOrFail($rendicionId);
        $rendicion->recalcularTotales();
        $rendicion->save();

        // 2) Recargar el flete con todas las relaciones necesarias
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

        // 3) Exponer campos calculados para la tarjeta
        $flete->makeVisible(['retorno']);
        $flete->rendicion->makeVisible([
            'saldo',
            'total_gastos',
            'total_diesel',
            'viatico_calculado',
            'comision',
        ]);

        return response()->json([
            'message' => '✅ Comisión eliminada correctamente.',
            'flete'   => $flete,
        ], 200);
    }
}
