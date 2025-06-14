<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flete;
use App\Models\Rendicion;

class ComisionController extends Controller
{
    /**
     * Store (or update) la comisión manual de un flete:
     * - guarda el valor en $flete->comision
     * - recalcula la rendición (incluye comisión automática + manual)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id'     => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'monto'        => 'required|numeric|min:0',
        ]);

        try {
            // 1) Actualizar comisión manual en el Flete
            $flete = Flete::findOrFail($validated['flete_id']);
            $flete->comision = $validated['monto'];
            $flete->save();

            // 2) Recalcular y guardar totales en la rendición
            $rendicion = Rendicion::findOrFail($validated['rendicion_id']);
            $rendicion->recalcularTotales();
            $rendicion->save();

            // 3) Recargar el Flete con relaciones necesarias
            $flete = Flete::with([
                'clientePrincipal:id,razon_social',
                'conductor:id,name',
                'colaborador:id,name',
                'tracto:id,patente',
                'rampla:id,patente',
                'destino:id,nombre',
                'tarifa:id,valor_comision',
                'rendicion',
            ])->findOrFail($flete->id);

            // 4) Asegurar visibilidad de los campos calculados
            $flete->makeVisible(['comision','retorno']);
            $flete->rendicion->makeVisible([
                'saldo',
                'total_gastos',
                'total_diesel',
                'viatico_calculado',
                'comision',
            ]);

            return response()->json([
                'message' => '✅ Comisión manual registrada correctamente.',
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
     * Remove la comisión manual de un flete:
     * - pone comision = 0
     * - recalcula la rendición
     */
    public function destroy($fleteId, Request $request)
    {
        try {
            // 1) Limpiar la comisión manual
            $flete = Flete::findOrFail($fleteId);
            $flete->comision = 0;
            $flete->save();

            // 2) Recalcular y guardar totales en la rendición asociada
            $rendicion = $flete->rendicion()->firstOrFail();
            $rendicion->recalcularTotales();
            $rendicion->save();

            // 3) Recargar el Flete con relaciones necesarias
            $flete = Flete::with([
                'clientePrincipal:id,razon_social',
                'conductor:id,name',
                'colaborador:id,name',
                'tracto:id,patente',
                'rampla:id,patente',
                'destino:id,nombre',
                'tarifa:id,valor_comision',
                'rendicion',
            ])->findOrFail($fleteId);

            // 4) Asegurar visibilidad de los campos calculados
            $flete->makeVisible(['comision','retorno']);
            $flete->rendicion->makeVisible([
                'saldo',
                'total_gastos',
                'total_diesel',
                'viatico_calculado',
                'comision',
            ]);

            return response()->json([
                'message' => '✅ Comisión manual eliminada correctamente.',
                'flete'   => $flete,
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al eliminar comisión',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
