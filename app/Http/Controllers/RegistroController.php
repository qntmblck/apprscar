<?php

namespace App\Http\Controllers;

use App\Models\Flete;
use App\Models\Gasto;
use App\Models\Diesel;
use Illuminate\Http\Request;

class RegistroController extends Controller
{
    public function destroy($id)
    {
        \Log::info("Intentando eliminar registro ID: $id");

        // Buscar gasto o diesel
        $registro = Gasto::find($id);
        if ($registro) {
            $rendicion = $registro->rendicion;
            $registro->delete();
        } else {
            $registro = Diesel::find($id);
            if (!$registro) {
                return response()->json(['message' => 'Registro no encontrado'], 404);
            }
            $rendicion = $registro->rendicion;
            $registro->delete();
        }

        // Cargar flete con todas las relaciones necesarias
        $flete = Flete::with([
            'cliente',
            'destino',
            'conductor',
            'tracto',
            'rendicion.gastos' => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.diesels' => fn($q) => $q->orderByDesc('created_at'),
        ])->find($rendicion->flete_id);

        if (!$flete) {
            return response()->json(['message' => 'Flete no encontrado'], 404);
        }

        // Asegurar que los atributos virtuales estén visibles
        if ($flete->rendicion) {
            $flete->rendicion->makeVisible([
                'total_gastos',
                'total_diesel',
                'viatico_calculado',
                'saldo_temporal',
            ]);
        }

        return response()->json([
            'ok' => true,
            'flete' => $flete,
        ]);
    }
}
