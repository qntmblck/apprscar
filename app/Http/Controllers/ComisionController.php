<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flete;
use App\Models\Rendicion;

class ComisionController extends Controller
{
    /**
     * Store a newly created Comisión (guarda en columna comision_manual de rendición).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id'     => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'monto'        => 'required|numeric|min:0',
        ]);

        // Actualizar la comision en la rendición
        $rendicion = Rendicion::findOrFail($validated['rendicion_id']);
        $rendicion->comision_manual = $validated['monto'];
        $rendicion->save();

        // Recargar flete con sus relaciones
        $flete = Flete::with([
            'cliente',
            'conductor',
            'tracto',
            'rampla',
            'destino',
            'rendicion.abonos'  => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.diesels' => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.gastos'  => fn($q) => $q->orderByDesc('created_at'),
        ])->findOrFail($validated['flete_id']);

        // Hacer visible el campo virtual en la rendición
        if ($flete->rendicion) {
            $flete->rendicion->makeVisible([
                'saldo_temporal',
                'total_diesel',
                'total_gastos',
                'viatico_efectivo',
                'viatico_calculado',
                'caja_flete_acumulada',
                'comision_manual',
            ]);
        }

        return response()->json([
            'message' => '✅ Comisión registrada correctamente.',
            'flete'   => $flete,
        ]);
    }

    /**
     * Remove the comisión (pone comision_manual a null).
     */
    public function destroy($fleteId)
    {
        // Obtener flete y sua rendicion
        $flete    = Flete::with('rendicion')->findOrFail($fleteId);
        $rendicion = $flete->rendicion;
        if ($rendicion) {
            $rendicion->comision_manual = null;
            $rendicion->save();
        }

        // Recargar relaciones
        $flete = Flete::with([
            'cliente',
            'conductor',
            'tracto',
            'rampla',
            'destino',
            'rendicion.abonos'  => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.diesels' => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.gastos'  => fn($q) => $q->orderByDesc('created_at'),
        ])->findOrFail($fleteId);

        if ($flete->rendicion) {
            $flete->rendicion->makeVisible([
                'saldo_temporal',
                'total_diesel',
                'total_gastos',
                'viatico_efectivo',
                'viatico_calculado',
                'caja_flete_acumulada',
                'comision_manual',
            ]);
        }

        return response()->json([
            'message' => '✅ Comisión eliminada correctamente.',
            'flete'   => $flete,
        ]);
    }
}
