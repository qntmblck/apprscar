<?php

namespace App\Http\Controllers;

use App\Models\Rendicion;
use Illuminate\Http\Request;

class RendicionController extends Controller
{
    public function asignarPeriodo(Request $request)
    {
        $request->validate([
            'rendicion_ids' => 'required|array',
            'periodo' => 'required|string|max:20',
        ]);

        Rendicion::whereIn('id', $request->rendicion_ids)
            ->update(['periodo' => $request->periodo]);

        return response()->json(['message' => 'Periodo asignado correctamente.']);
    }

    public function index()
    {
        $rendiciones = Rendicion::with([
            'flete.conductor',
            'flete.destino',
            'gastos',
            'diesels'
        ])->get();

        return inertia('Rendiciones/Index', [
            'rendiciones' => $rendiciones
        ]);
    }
}
