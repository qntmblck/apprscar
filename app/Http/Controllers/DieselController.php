<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Diesel;

class DieselController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id' => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendicions,id',
            'monto' => 'required|numeric|min:0',
            'litros' => 'required|integer|min:0',
            'metodo_pago' => 'required|in:Efectivo,Transferencia,Crédito',
        ]);

        Diesel::create([
            'flete_id' => $validated['flete_id'],
            'rendicion_id' => $validated['rendicion_id'],
            'monto' => $validated['monto'],
            'litros' => $validated['litros'],
            'metodo_pago' => $validated['metodo_pago'],
        ]);

        return response()->json(['message' => 'Diesel registrado correctamente.']);
    }
}
