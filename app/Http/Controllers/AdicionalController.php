<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Adicional;
use App\Models\Flete;
use App\Models\Rendicion;

class AdicionalController extends Controller
{
    /**
     * Store a newly created “Adicional”.
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
            // 1) Obtener rendición
            $rendicion = Rendicion::findOrFail($validated['rendicion_id']);

            // 2) Crear adicional
            $adicional = Adicional::create([
                'flete_id'     => $validated['flete_id'],
                'rendicion_id' => $validated['rendicion_id'],
                'tipo'         => 'Adicional',
                'descripcion'  => $validated['descripcion'],
                'monto'        => $validated['monto'],
            ]);

            // 3) Recalcular totales y guardar
            $rendicion->recalcularTotales();
            $rendicion->save();

            // 4) Recargar flete con relaciones necesarias
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

            // 5) Exponer campos calculados
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

        // 1) Obtener y recalcular rendición
        $rendicion = Rendicion::where('flete_id', $fleteId)->firstOrFail();
        $rendicion->recalcularTotales();
        $rendicion->save();

        // 2) Recargar flete con relaciones necesarias
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
