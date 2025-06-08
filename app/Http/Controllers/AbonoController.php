<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flete;
use App\Models\AbonoCaja;

class AbonoController extends Controller
{
    /**
     * Store a newly created Abono (o Retorno) en la base de datos.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id'     => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'tipo'         => 'required|string|max:255',   // Ej: “Efectivo”, “Transferencia” o “Retorno”
            'monto'        => 'required|numeric|min:1',
        ]);

        $abono = AbonoCaja::create([
            'flete_id'     => $validated['flete_id'],
            'rendicion_id' => $validated['rendicion_id'],
            'metodo'       => $validated['tipo'],    // guardamos en “metodo”
            'monto'        => $validated['monto'],
        ]);

        // Recuperar el flete con todas las relaciones necesarias
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
            ]);
        }

        return response()->json([
            'message' => '✅ Abono registrado correctamente.',
            'flete'   => $flete,
        ]);
    }

    /**
     * Eliminar un Abono o Retorno (según id).
     */
    public function destroy($id)
    {
        $registro = AbonoCaja::find($id);
        if (! $registro) {
            return response()->json(['message' => 'Abono no encontrado'], 404);
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
            ]);
        }

        return response()->json([
            'message' => '✅ Abono eliminado correctamente.',
            'flete'   => $flete,
        ]);
    }
}
