<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gasto;
use App\Models\Flete;

class ComisionController extends Controller
{
    /**
     * Store a newly created Comisión:
     * - crea un Gasto tipo “Comisión”
     * - actualiza el campo comision en Flete
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id'     => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'monto'        => 'required|numeric|min:0',
            'descripcion'  => 'nullable|string|max:255',
        ]);

        // 1) Registrar el gasto como tipo Comisión
        Gasto::create([
            'flete_id'      => $validated['flete_id'],
            'rendicion_id'  => $validated['rendicion_id'],
            'tipo'          => 'Comisión',
            'descripcion'   => $validated['descripcion'] ?? 'Comisión manual',
            'monto'         => $validated['monto'],
        ]);

        // 2) Actualizar el campo comision en el modelo Flete
        $flete = Flete::findOrFail($validated['flete_id']);
        $flete->comision = $validated['monto'];
        $flete->save();

        // 3) Recargar relaciones necesarias
        $flete->load([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'destino:id,nombre',
            'rendicion.abonos',
            'rendicion.diesels',
            'rendicion.gastos',
        ]);

        // 4) Hacer visibles los atributos virtuales de la rendición
        if ($flete->rendicion) {
            $flete->rendicion->makeVisible([
                'saldo_temporal',
                'total_gastos',
                'total_diesel',
                'viatico_calculado',
            ]);
        }

        return response()->json([
            'message' => '✅ Comisión registrada y flete actualizado.',
            'flete'   => $flete,
        ], 201);
    }

    /**
     * Remove the comisión:
     * - elimina el Gasto de tipo “Comisión”
     * - pone comision = 0 en Flete
     */
    public function destroy($gastoId)
    {
        $gasto = Gasto::findOrFail($gastoId);
        $fleteId = $gasto->flete_id;
        $gasto->delete();

        $flete = Flete::findOrFail($fleteId);
        $flete->comision = 0;
        $flete->save();

        $flete->load([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'destino:id,nombre',
            'rendicion.abonos',
            'rendicion.diesels',
            'rendicion.gastos',
        ]);

        if ($flete->rendicion) {
            $flete->rendicion->makeVisible([
                'saldo_temporal',
                'total_gastos',
                'total_diesel',
                'viatico_calculado',
            ]);
        }

        return response()->json([
            'message' => '✅ Comisión eliminada y flete restaurado.',
            'flete'   => $flete,
        ], 200);
    }
}
