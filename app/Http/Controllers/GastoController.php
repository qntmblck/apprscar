<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gasto;
use App\Models\Flete;

class GastoController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id' => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'tipo' => 'required|in:Carga,Descarga,Camioneta,Estacionamiento,Peaje,Otros',
            'monto' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'foto' => 'nullable|image|max:2048',
        ]);

        $gasto = Gasto::create([
            'flete_id' => $validated['flete_id'],
            'rendicion_id' => $validated['rendicion_id'],
            'usuario_id' => auth()->id(),
            'tipo' => $validated['tipo'],
            'monto' => $validated['monto'],
            'descripcion' => $validated['descripcion'] ?? null,
            'foto' => $request->hasFile('foto')
                ? $request->file('foto')->store('gastos', 'public')
                : null,
        ]);

        // Recalcula saldo con lógica centralizada en el modelo
        $gasto->rendicion->recalcularTotales();

        // Refresca y carga relaciones actualizadas del flete
        $flete = Flete::with([
            'cliente',
            'destino',
            'conductor',
            'tracto',
            'rampla',
            'rendicion.gastos',
            'rendicion.diesels',
        ])->find($validated['flete_id']);

        $flete->rendicion->refresh()->load('gastos', 'diesels');

        // Garantiza que los appends estén disponibles en la respuesta
        $flete->rendicion->makeVisible([
            'saldo_temporal',
            'total_gastos',
            'total_diesel',
            'viatico_calculado',
        ]);

        return response()->json([
            'message' => 'Gasto registrado correctamente.',
            'flete' => $flete,
        ]);
    }
}
