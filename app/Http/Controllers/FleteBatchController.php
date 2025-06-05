<?php

namespace App\Http\Controllers;

use App\Models\Flete;
use Illuminate\Http\Request;

class FleteBatchController extends Controller
{
    public function asignarPeriodo(Request $request)
    {
        $request->validate([
            'flete_ids' => 'required|array',
            'flete_ids.*' => 'integer|exists:fletes,id',
            'periodo' => 'required|string|in:Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
            'pagado' => 'required|boolean',
        ]);

        $fletes = Flete::whereIn('id', $request->flete_ids)->get();

        foreach ($fletes as $flete) {
            $flete->update([
                'periodo' => $request->periodo,
                'pagado' => $request->pagado,
            ]);
        }

        return response()->json(['message' => 'Fletes actualizados correctamente.']);
    }
}
