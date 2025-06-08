<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flete;
use App\Models\Gasto;

class ComisionController extends Controller
{
    /**
     * Store a newly created Comisión (se guarda como Gasto con tipo = "Comisión").
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id'      => 'required|exists:fletes,id',
            'rendicion_id'  => 'required|exists:rendiciones,id',
            'tipo'          => 'required|string|max:255', // normalmente: "Comisión"
            'monto'         => 'required|numeric|min:1',
            'descripcion'   => 'nullable|string|max:255',
        ]);


        // Creamos un gasto con tipo="Comisión"
        $registro = Gasto::create([
            'flete_id'      => $validated['flete_id'],
            'rendicion_id'  => $validated['rendicion_id'],
            'tipo'          => $validated['tipo'],             // "Comisión"
            'descripcion'   => $validated['descripcion'] ?? 'Comisión manual',
            'monto'         => $validated['monto'],
            'user_id'    => auth()->id(),
        ]);

        // Cargamos el flete completo con las relaciones necesarias
        $flete = Flete::with([
            'cliente',
            'conductor',
            'tracto',
            'rampla',
            'destino',
            'rendicion.abonos'  => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.diesels' => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.gastos'  => fn($q) => $q->orderByDesc('created_at'),
        ])->find($validated['flete_id']);

        if ($flete->rendicion) {
            $flete->rendicion->makeVisible([
                'saldo_temporal',
                'total_diesel',
                'total_gastos',
                'viatico_efectivo',
                'viatico_calculado',
                'caja_flete_acumulada',
                'comision_manual',   // si manejas este campo explícito
            ]);
        }

        return response()->json([
            'message' => '✅ Comisión registrada correctamente.',
            'flete'   => $flete,
        ]);
    }

    /**
     * Remove the specified Comisión (eliminar el gasto con tipo="Comisión").
     */
    public function destroy($id)
    {
        $registro = Gasto::find($id);
        if (! $registro) {
            return response()->json(['message' => 'Comisión no encontrada'], 404);
        }

        $rendicion = $registro->rendicion;
        $flete_id  = $rendicion->flete_id;
        $registro->delete();

        $flete = Flete::with([
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
                'comision_manual',
            ]);
        }

        return response()->json([
            'message' => '✅ Comisión eliminada correctamente.',
            'flete'   => $flete,
        ]);
    }
}
