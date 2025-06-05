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
    public function actualizarPagos(Request $request)
{
    $request->validate([
        'conductor_id' => 'required|exists:users,id',
        'periodo' => 'required|string|in:Enero,Febrero,...,Diciembre',
        'flete_ids' => 'required|array',
        'flete_ids.*' => 'integer|exists:fletes,id',
    ]);

    $conductorId = $request->conductor_id;
    $periodo = $request->periodo;
    $fleteIdsPagados = $request->flete_ids;

    // Traer todos los fletes del conductor en ese periodo
    $todosFletesPeriodo = Flete::where('conductor_id', $conductorId)
        ->where('periodo', $periodo)
        ->get();

    // Marcar los seleccionados como pagados, el resto como no pagados
    foreach ($todosFletesPeriodo as $flete) {
        $flete->update([
            'pagado' => in_array($flete->id, $fleteIdsPagados),
        ]);
    }

    // Recalcular total
    $fletesPagados = $todosFletesPeriodo->whereIn('id', $fleteIdsPagados);
    $totalComision = $fletesPagados->sum('comision');
    $totalSaldo = $fletesPagados->pluck('rendicion.saldo')->sum();

    // Crear o actualizar pago
    \App\Models\Pago::updateOrCreate(
        ['conductor_id' => $conductorId, 'periodo' => $periodo],
        ['total_comision' => $totalComision, 'total_saldo' => $totalSaldo, 'fecha_pago' => now()]
    );

    return response()->json(['message' => '✅ Pagos actualizados.']);
}

}
