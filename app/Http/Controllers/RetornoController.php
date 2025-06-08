<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flete;
use App\Models\AbonoCaja;

class RetornoController extends Controller
{
    /**
     * Store a newly created Retorno (usando la tabla abonos_caja con método "Retorno").
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id'     => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'tipo'         => 'required|string|max:255', // normalmente: "Retorno"
            'monto'        => 'required|numeric|min:1',
        ]);

        // Creamos un registro en AbonoCaja con método = "Retorno"
        $retorno = AbonoCaja::create([
            'flete_id'     => $validated['flete_id'],
            'rendicion_id' => $validated['rendicion_id'],
            'metodo'       => $validated['tipo'],  // se espera "Retorno"
            'monto'        => $validated['monto'],
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
                'retorno_monto',    // Si usas un campo específico para retorno
            ]);
        }

        return response()->json([
            'message' => '✅ Retorno registrado correctamente.',
            'flete'   => $flete,
        ]);
    }

    /**
     * Remove the specified Retorno.
     */
    public function destroy($id)
    {
        $registro = AbonoCaja::find($id);
        if (! $registro) {
            return response()->json(['message' => 'Retorno no encontrado'], 404);
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
                'retorno_monto',
            ]);
        }

        return response()->json([
            'message' => '✅ Retorno eliminado correctamente.',
            'flete'   => $flete,
        ]);
    }
}
