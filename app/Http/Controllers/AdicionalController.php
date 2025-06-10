<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Adicional;
use App\Models\Flete;

class AdicionalController extends Controller
{
    /**
     * Store a newly created “Adicional” (tabla independiente).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id'    => 'required|exists:fletes,id',
            'descripcion' => 'required|string|max:255',
            'monto'       => 'required|numeric|min:0',
        ]);

        $adicional = Adicional::create([
            'flete_id'    => $validated['flete_id'],
            'tipo'        => 'Adicional', // tipo fijo por ahora
            'descripcion' => $validated['descripcion'],
            'monto'       => $validated['monto'],
        ]);

        // Recargar el flete con relaciones necesarias
        $flete = Flete::with([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'destino:id,nombre',
            'rendicion.abonos',
            'rendicion.diesels',
            'rendicion.gastos',
        ])->findOrFail($adicional->flete_id);

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
