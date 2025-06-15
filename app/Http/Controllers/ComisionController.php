<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flete;
use App\Models\Rendicion;

class ComisionController extends Controller
{
    /**
     * Store (or update) la comisión manual de una rendición:
     * - guarda el valor en $rendicion->comision
     * - recalcula y persiste totales en la rendición
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id'     => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'monto'        => 'required|numeric|min:0',
        ]);

        try {
            // 1) Actualizar comisión manual en la Rendición
            $rendicion = Rendicion::findOrFail($validated['rendicion_id']);
            $rendicion->comision = $validated['monto'];
            $rendicion->recalcularTotales(); // recalcula y guarda

            // 2) Recargar el Flete con la rendición actualizada
            $flete = Flete::with([
                'clientePrincipal:id,razon_social',
                'conductor:id,name',
                'colaborador:id,name',
                'tracto:id,patente',
                'rampla:id,patente',
                'destino:id,nombre',
                'tarifa:id,valor_comision',
                'rendicion:id,flete_id,estado,viatico_efectivo,viatico_calculado,saldo,caja_flete,comision',
                'rendicion.gastos:id,rendicion_id,tipo,descripcion,monto,created_at',
                'rendicion.diesels:id,rendicion_id,litros,metodo_pago,monto,created_at',
                'rendicion.abonos:id,rendicion_id,metodo,monto,created_at',
                'rendicion.adicionales:id,rendicion_id,tipo,descripcion,monto,created_at',
            ])->findOrFail($validated['flete_id']);

            // 3) Asegurar visibilidad de campos calculados
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
     * Remove la comisión manual de una rendición:
     * - pone comision = 0 en la rendición
     * - recalcula y persiste totales
     */
    public function destroy($rendicionId)
    {
        try {
            // 1) Limpiar la comisión manual en la Rendición
            $rendicion = Rendicion::findOrFail($rendicionId);
            $rendicion->comision = 0;
            $rendicion->recalcularTotales(); // recalcula y guarda

            // 2) Recargar el Flete con la rendición actualizada
            $flete = Flete::with([
                'clientePrincipal:id,razon_social',
                'conductor:id,name',
                'colaborador:id,name',
                'tracto:id,patente',
                'rampla:id,patente',
                'destino:id,nombre',
                'tarifa:id,valor_comision',
                'rendicion:id,flete_id,estado,viatico_efectivo,viatico_calculado,saldo,caja_flete,comision',
                'rendicion.gastos:id,rendicion_id,tipo,descripcion,monto,created_at',
                'rendicion.diesels:id,rendicion_id,litros,metodo_pago,monto,created_at',
                'rendicion.abonos:id,rendicion_id,metodo,monto,created_at',
                'rendicion.adicionales:id,rendicion_id,tipo,descripcion,monto,created_at',
            ])->findOrFail($rendicion->flete_id);

            // 3) Asegurar visibilidad de campos calculados
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

        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al eliminar comisión',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
