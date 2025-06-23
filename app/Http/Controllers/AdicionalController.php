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
            'flete_id'     => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'descripcion'  => 'required|string|max:255',
            'monto'        => 'required|numeric|min:0',
        ]);

        try {
            // 1) Crear adicional
            $adicional = Adicional::create([
                'flete_id'     => $validated['flete_id'],
                'rendicion_id' => $validated['rendicion_id'],
                'tipo'         => 'Adicional',
                'descripcion'  => $validated['descripcion'],
                'monto'        => $validated['monto'],
            ]);

            // 2) Recalcular y guardar totales en la rendición
            $rendicion = Rendicion::findOrFail($validated['rendicion_id']);
            $rendicion->recalcularTotales();
            $rendicion->save();

            // 3) Recargar el flete con relaciones necesarias
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
     * Remove the specified “Adicional” by ID.
     */
    public function destroy($id)
    {
        // 1) Buscar el adicional manualmente
        $adicional = Adicional::find($id);
        if (! $adicional) {
            return response()->json(['message' => 'Adicional no encontrado'], 404);
        }

        $fleteId = $adicional->flete_id;
        $adicional->delete();

        // 2) Recalcular y guardar totales en la rendición
        $rendicion = Rendicion::where('flete_id', $fleteId)->firstOrFail();
        $rendicion->recalcularTotales();
        $rendicion->save();

        // 3) Recargar el flete con relaciones necesarias
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

        // 4) Exponer campos calculados
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
