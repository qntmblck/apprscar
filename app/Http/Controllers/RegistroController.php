<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flete;
use App\Models\Gasto;
use App\Models\Diesel;
use App\Models\AbonoCaja;

class RegistroController extends Controller
{
    public function store(Request $request)
    {
        if ($request->has(['tipo', 'monto']) && !$request->has('litros')) {
            if ($request->filled('descripcion')) {
                $validated = $request->validate([
                    'flete_id' => 'required|exists:fletes,id',
                    'rendicion_id' => 'required|exists:rendiciones,id',
                    'tipo' => 'required|string|max:255',
                    'descripcion' => 'nullable|string|max:255',
                    'monto' => 'required|numeric|min:1',
                ]);
                $registro = Gasto::create([
                    ...$validated,
                    'usuario_id' => auth()->id(),
                ]);
            } else {
                $validated = $request->validate([
                    'flete_id' => 'required|exists:fletes,id',
                    'rendicion_id' => 'required|exists:rendiciones,id',
                    'tipo' => 'required|string|max:255',
                    'monto' => 'required|numeric|min:1',
                ]);
                $registro = AbonoCaja::create([
                    'flete_id' => $validated['flete_id'],
                    'rendicion_id' => $validated['rendicion_id'],
                    'metodo' => $validated['tipo'],
                    'monto' => $validated['monto'],
                ]);
            }
        } elseif ($request->has(['litros', 'metodo_pago'])) {
            $validated = $request->validate([
                'flete_id' => 'required|exists:fletes,id',
                'rendicion_id' => 'required|exists:rendiciones,id',
                'metodo_pago' => 'required|string|max:255',
                'monto' => 'required|numeric|min:1',
                'litros' => 'required|numeric|min:1',
            ]);
            $registro = Diesel::create($validated);
        } else {
            return response()->json([
                'error' => 'No se pudo determinar el tipo de registro. Verifica los campos enviados.'
            ], 422);
        }

        $flete = Flete::with([
            'cliente',
            'conductor',
            'tracto',
            'rampla',
            'destino',
            'rendicion.abonos' => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.diesels' => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.gastos' => fn($q) => $q->orderByDesc('created_at'),
        ])->find($request->flete_id);

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
            'message' => '✅ Registro creado correctamente.',
            'flete' => $flete,
        ]);
    }

    public function destroy($id)
    {
        \Log::info("Intentando eliminar registro ID: $id");

        $registro = null;
        $rendicion = null;

        $registro = Gasto::find($id);
        if ($registro) {
            $rendicion = $registro->rendicion;
            $registro->delete();
        } else {
            $registro = Diesel::find($id);
            if ($registro) {
                $rendicion = $registro->rendicion;
                $registro->delete();
            } else {
                $registro = AbonoCaja::find($id);
                if ($registro) {
                    $rendicion = $registro->rendicion;
                    $registro->delete();
                } else {
                    return response()->json(['message' => 'Registro no encontrado'], 404);
                }
            }
        }

        $flete = Flete::with([
            'cliente',
            'conductor',
            'tracto',
            'rampla',
            'destino',
            'rendicion.abonos' => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.diesels' => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.gastos' => fn($q) => $q->orderByDesc('created_at'),
        ])->find($rendicion->flete_id);

        if (!$flete) {
            return response()->json(['message' => 'Flete no encontrado'], 404);
        }

        $flete->rendicion?->makeVisible([
            'saldo_temporal',
            'total_diesel',
            'total_gastos',
            'viatico_calculado',
            'viatico_efectivo',
            'caja_flete_acumulada',
        ]);

        return response()->json([
            'ok' => true,
            'flete' => $flete,
        ]);
    }
}
