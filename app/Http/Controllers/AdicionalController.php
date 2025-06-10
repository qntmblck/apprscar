<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Adicional;
use App\Models\Flete;

class AdicionalController extends Controller
{
    /**
     * Store a newly created “Adicional” (tabla independientes).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id'     => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'descripcion'  => 'required|string|max:255',
            'monto'        => 'required|numeric|min:0',
        ]);

        $adicional = Adicional::create([
            'flete_id'     => $validated['flete_id'],
            'rendicion_id' => $validated['rendicion_id'],
            'descripcion'  => $validated['descripcion'],
            'monto'        => $validated['monto'],
        ]);

        // Recargar el flete con relaciones
        $flete = Flete::with([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'destino:id,nombre',
            'rendicion.abonos',
            'rendicion.diesels',
            'rendicion.gastos',
            'rendicion.adicionales',   // relación Adicional
        ])->findOrFail($adicional->flete_id);

        // Exponer atributos virtuales de la rendición
        if ($flete->rendicion) {
            $flete->rendicion->makeVisible([
                'saldo_temporal',
                'total_gastos',
                'total_diesel',
                'viatico_calculado',
            ]);
        }

        return response()->json([
            'message' => '✅ Adicional registrado correctamente.',
            'flete'   => $flete,
        ]);
    }

    /**
     * Remove the specified “Adicional”.
     */
    public function destroy(Adicional $adicional)
    {
        $fleteId = $adicional->flete_id;
        $adicional->delete();

        $flete = Flete::with([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'destino:id,nombre',
            'rendicion.abonos',
            'rendicion.diesels',
            'rendicion.gastos',
            'rendicion.adicionales',
        ])->findOrFail($fleteId);

        if ($flete->rendicion) {
            $flete->rendicion->makeVisible([
                'saldo_temporal',
                'total_gastos',
                'total_diesel',
                'viatico_calculado',
            ]);
        }

        return response()->json([
            'message' => '✅ Adicional eliminado correctamente.',
            'flete'   => $flete,
        ]);
    }
}
