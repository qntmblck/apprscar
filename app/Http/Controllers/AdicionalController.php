<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Adicional;
use App\Models\Flete;
use App\Models\Rendicion;

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

        try {
            // 1) Crear adicional
            $adicional = Adicional::create([
                'flete_id'    => $validated['flete_id'],
                'tipo'        => 'Adicional', // tipo fijo por ahora
                'descripcion' => $validated['descripcion'],
                'monto'       => $validated['monto'],
            ]);

            // 2) Recalcular y guardar totales en rendición
            $flete     = Flete::findOrFail($validated['flete_id']);
            $rendicion = $flete->rendicion;
            $rendicion->recalcularTotales();

            // 3) Recargar el flete con todas las relaciones necesarias
            $flete = Flete::with([
                'clientePrincipal:id,razon_social',
                'conductor:id,name',
                'colaborador:id,name',
                'tracto:id,patente',
                'rampla:id,patente',
                'destino:id,nombre',
                // colecciones de la rendición
                'rendicion.abonos'      => fn($q) => $q->orderByDesc('created_at'),
                'rendicion.gastos'      => fn($q) => $q->orderByDesc('created_at'),
                'rendicion.diesels'     => fn($q) => $q->orderByDesc('created_at'),
                'rendicion.adicionales' => fn($q) => $q->orderByDesc('created_at'),
                'rendicion.comisiones'  => fn($q) => $q->orderByDesc('created_at'),
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
                'message' => '✅ Adicional registrado correctamente.',
                'flete'   => $flete,
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al registrar adicional',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified “Adicional”.
     */
    public function destroy(Adicional $adicional)
    {
        $fleteId = $adicional->flete_id;
        $adicional->delete();

        // 1) Recalcular totales en rendición
        $flete     = Flete::findOrFail($fleteId);
        $rendicion = $flete->rendicion;
        $rendicion->recalcularTotales();

        // 2) Recargar flete con las mismas relaciones
        $flete = Flete::with([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'colaborador:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'destino:id,nombre',
            'rendicion.abonos'      => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.gastos'      => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.diesels'     => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.adicionales' => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.comisiones'  => fn($q) => $q->orderByDesc('created_at'),
        ])->findOrFail($fleteId);

        // 3) Exponer campos calculados
        $flete->makeVisible(['retorno']);
        $flete->rendicion->makeVisible([
            'saldo',
            'total_gastos',
            'total_diesel',
            'viatico_calculado',
            'comision',
        ]);

        return response()->json([
            'message' => '✅ Adicional eliminado correctamente.',
            'flete'   => $flete,
        ], 200);
    }
}
