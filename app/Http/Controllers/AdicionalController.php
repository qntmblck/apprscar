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
                'tipo'        => 'Adicional',
                'descripcion' => $validated['descripcion'],
                'monto'       => $validated['monto'],
            ]);

            // 2) Recalcular y guardar totales en la rendición
            $flete     = Flete::findOrFail($validated['flete_id']);
            $rendicion = $flete->rendicion;
            $rendicion->recalcularTotales();

            // 3) Recargar el flete con relaciones necesarias (sin comisiones)
            $flete = Flete::with([
                'clientePrincipal:id,razon_social',
                'conductor:id,name',
                'colaborador:id,name',
                'tracto:id,patente',
                'rampla:id,patente',
                'destino:id,nombre',
                'tarifa:id,valor_comision',
                'rendicion:id,flete_id,estado,viatico_efectivo,viatico_calculado,saldo,caja_flete,comision',
                'rendicion.abonos'      => fn($q) => $q->orderByDesc('created_at'),
                'rendicion.gastos'      => fn($q) => $q->orderByDesc('created_at'),
                'rendicion.diesels'     => fn($q) => $q->orderByDesc('created_at'),
                'rendicion.adicionales' => fn($q) => $q->orderByDesc('created_at'),
            ])->findOrFail($validated['flete_id']);

            // 4) Exponer campos calculados
            $flete->makeVisible(['retorno']);
            $flete->rendicion->makeVisible([
                'saldo', 'total_gastos', 'total_diesel', 'viatico_calculado', 'comision',
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

        // 1) Recalcular totales en la rendición
        $flete     = Flete::findOrFail($fleteId);
        $rendicion = $flete->rendicion;
        $rendicion->recalcularTotales();

        // 2) Recargar el flete sin comisiones
        $flete = Flete::with([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'colaborador:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'destino:id,nombre',
            'tarifa:id,valor_comision',
            'rendicion:id,flete_id,estado,viatico_efectivo,viatico_calculado,saldo,caja_flete,comision',
            'rendicion.abonos'      => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.gastos'      => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.diesels'     => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.adicionales' => fn($q) => $q->orderByDesc('created_at'),
        ])->findOrFail($fleteId);

        // 3) Exponer campos calculados
        $flete->makeVisible(['retorno']);
        $flete->rendicion->makeVisible([
            'saldo', 'total_gastos', 'total_diesel', 'viatico_calculado', 'comision',
        ]);

        return response()->json([
            'message' => '✅ Adicional eliminado correctamente.',
            'flete'   => $flete,
        ], 200);
    }
}
