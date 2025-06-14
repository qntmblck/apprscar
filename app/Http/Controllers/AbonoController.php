<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AbonoCaja;
use App\Models\Flete;
use App\Models\Rendicion;

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
            'tipo'         => 'required|string|max:255',
            'monto'        => 'required|numeric|min:1',
        ]);

        try {
            // 1) Crear el abono
            $abono = AbonoCaja::create([
                'flete_id'     => $validated['flete_id'],
                'rendicion_id' => $validated['rendicion_id'],
                'metodo'       => $validated['tipo'],
                'monto'        => $validated['monto'],
            ]);

            // 2) Recalcular y guardar totales (incluye comisión)
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
                'message' => '✅ Abono registrado correctamente.',
                'flete'   => $flete,
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al registrar abono',
                'message' => $e->getMessage(),
            ], 500);
        }
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

        $fleteId = $registro->flete_id;
        $registro->delete();

        // 1) Recargar el flete con todas las relaciones necesarias
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

        // 2) Recalcular y guardar totales luego de eliminar
        $flete->rendicion->recalcularTotales();
        $flete->rendicion->save();

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
            'message' => '✅ Abono eliminado correctamente.',
            'flete'   => $flete,
        ], 200);
    }
}
