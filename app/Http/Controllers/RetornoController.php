<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flete;

class RetornoController extends Controller
{
    /**
     * Store or update the single retorno value on the Flete.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'flete_id' => 'required|exists:fletes,id',
            'monto'    => 'required|numeric|min:0',
        ]);

        // 1) Carga el Flete y actualiza su campo retorno
        $flete = Flete::findOrFail($data['flete_id']);
        $flete->update(['retorno' => $data['monto']]);

        // 2) Recalcular totales en la rendición asociada
        $rend = $flete->rendicion;
        $rend->recalcularTotales();
        $rend->save();

        // 3) Recargar el Flete con todas las relaciones para el front
        $flete = Flete::with([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'colaborador:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'destino:id,nombre',
            'tarifa:id,valor_comision',
            'rendicion.abonos'      => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.gastos'      => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.diesels'     => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.adicionales' => fn($q) => $q->orderByDesc('created_at'),
        ])->findOrFail($flete->id);

        // 4) Hacer visible el campo retorno
        $flete->makeVisible(['retorno']);

        return response()->json([
            'message' => '✅ Retorno registrado correctamente.',
            'flete'   => $flete,
        ], 201);
    }

    /**
     * Remove the retorno (setear a cero) en el Flete.
     */
    public function destroy($fleteId)
    {
        // 1) Carga el Flete y pone retorno a cero
        $flete = Flete::findOrFail($fleteId);
        $flete->update(['retorno' => 0]);

        // 2) Recalcular totales en la rendición
        $rend = $flete->rendicion;
        $rend->recalcularTotales();
        $rend->save();

        // 3) Recargar el Flete con relaciones
        $flete = Flete::with([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'colaborador:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'destino:id,nombre',
            'tarifa:id,valor_comision',
            'rendicion.abonos'      => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.gastos'      => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.diesels'     => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.adicionales' => fn($q) => $q->orderByDesc('created_at'),
        ])->findOrFail($flete->id);

        $flete->makeVisible(['retorno']);

        return response()->json([
            'message' => '✅ Retorno eliminado correctamente.',
            'flete'   => $flete,
        ], 200);
    }
}
