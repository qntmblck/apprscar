<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Diesel;
use App\Models\Flete;
use App\Models\Rendicion;

class DieselController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'flete_id' => 'required|exists:fletes,id',
        'rendicion_id' => 'required|exists:rendiciones,id',
        'monto' => 'required|numeric|min:0',
        'litros' => 'required|numeric|min:0',
        'metodo_pago' => 'required|in:Efectivo,Transferencia,Crédito',
        'foto' => 'nullable|image|max:2048',
    ]);

    try {
        $rendicion = Rendicion::findOrFail($validated['rendicion_id']);

        if (!$rendicion->user_id) {
            return response()->json([
                'error' => 'La rendición no tiene un conductor asignado.'
            ], 422);
        }

        $diesel = Diesel::create([
            'flete_id' => $validated['flete_id'],
            'rendicion_id' => $rendicion->id,
            'user_id' => $rendicion->user_id,
            'monto' => $validated['monto'],
            'litros' => $validated['litros'],
            'metodo_pago' => $validated['metodo_pago'],
            'foto' => $request->hasFile('foto')
                ? $request->file('foto')->store('diesel', 'public')
                : null,
        ]);

        $diesel->rendicion->recalcularTotales();

        $flete = Flete::with([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'rendicion.abonos',
            'rendicion.gastos',
            'rendicion.diesels',
        ])->findOrFail($diesel->flete_id);

        $flete->setRelation('cliente', $flete->clientePrincipal);

        $flete->rendicion->makeVisible([
            'saldo_temporal',
            'total_gastos',
            'total_diesel',
            'viatico_calculado',
        ]);

        return response()->json([
            'message' => 'Diesel registrado correctamente.',
            'flete' => $flete,
        ]);

    } catch (\Throwable $e) {
        return response()->json([
            'error' => 'Error al registrar diesel',
            'exception' => get_class($e),
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ], 500);
    }
}


    public function destroy($id)
{
    $registro = Diesel::find($id);
    if (! $registro) {
        return response()->json(['message' => 'Diesel no encontrado'], 404);
    }

    $rendicion = $registro->rendicion;
    $flete_id  = $rendicion->flete_id;
    $registro->delete();

    $flete = Flete::with([
        'cliente',
        'conductor',
        'tracto',
        'rampla',
        'destino',
        'rendicion.abonos'  => fn($q) => $q->orderByDesc('created_at'),
        'rendicion.diesels' => fn($q) => $q->orderByDesc('created_at'),
        'rendicion.gastos'  => fn($q) => $q->orderByDesc('created_at'),
    ])->find($flete_id);

    if ($flete->rendicion) {
        $flete->rendicion->makeVisible([
            'saldo_temporal',
            'total_diesel',
            'total_gastos',
            'viatico_efectivo',
            'viatico_calculado',
            'caja_flete_acumulada',
        ]);
    }

    return response()->json([
        'message' => '✅ Diesel eliminado correctamente.',
        'flete'   => $flete,
    ]);
}


}
