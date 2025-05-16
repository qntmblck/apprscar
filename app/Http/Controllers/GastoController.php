<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gasto;

class GastoController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flete_id' => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendicions,id',
            'tipo' => 'required|string',
            'monto' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'foto' => 'nullable|image|max:2048',
        ]);

        Gasto::create([
            'flete_id' => $validated['flete_id'],
            'rendicion_id' => $validated['rendicion_id'],
            'tipo' => $validated['tipo'],
            'monto' => $validated['monto'],
            'descripcion' => $validated['descripcion'] ?? null,
            'foto' => $request->hasFile('foto') ? $request->file('foto')->store('gastos', 'public') : null,
        ]);

        return response()->json(['message' => 'Gasto registrado correctamente.']);
    }
}
