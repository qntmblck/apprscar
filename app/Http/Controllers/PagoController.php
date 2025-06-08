<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flete;
use App\Models\Pago;
use Barryvdh\Snappy\Facades\SnappyPdf;

class PagoController extends Controller
{
    public function togglePago(Request $request)
    {
        $request->validate([
            'flete_id' => 'required|exists:fletes,id',
            'pagado'   => 'required|boolean',
        ]);

        // Cargar flete con relaciones necesarias
        $flete = Flete::with(['rendicion', 'conductor'])->findOrFail($request->flete_id);
        $rendicion = $flete->rendicion;

        if (!$rendicion) {
            return response()->json(['message' => 'Este flete no tiene rendición.'], 422);
        }

        $rendicion->pagado = $request->pagado;

        // Obtener ID del conductor de forma segura
        $conductorId = $flete->conductor_id;
        if (!$conductorId) {
            return response()->json(['message' => 'Este flete no tiene conductor asignado.'], 422);
        }

        // ✅ MARCAR COMO PAGADO
        if ($request->pagado && $rendicion->estado === 'Activo') {
            $saldoTemporal = $rendicion->saldo_temporal ?? 0;

            $ultimoPago = Pago::where('conductor_id', $conductorId) // CORREGIDO
                ->where('periodo', '!=', $rendicion->periodo)
                ->latest('fecha_pago')
                ->first();

            if ($ultimoPago) {
                $ultimoPago->saldo_anterior += $saldoTemporal;
                $ultimoPago->save();
            } else {
                Pago::create([
                    'conductor_id'     => $conductorId, // CORREGIDO
                    'periodo'          => 'Pendiente',
                    'total_comision'   => 0,
                    'total_saldo'      => 0,
                    'anticipo_sueldo'  => 0,
                    'saldo_anterior'   => $saldoTemporal,
                    'fecha_pago'       => now(),
                ]);
            }
        }

        // ✅ DESMARCAR COMO PAGADO
        if (!$request->pagado) {
            $rendicion->estado = 'Activo';
            $rendicion->periodo = null;
        }

        $rendicion->save();

        // Refrescar flete con todas sus relaciones
        $fleteActualizado = Flete::with([
            'cliente',
            'destino',
            'conductor',
            'tracto',
            'rampla',
            'rendicion',
            'rendicion.diesels',
            'rendicion.gastos',
            'rendicion.abonos',
        ])->find($flete->id);

        return response()->json([
            'message' => 'Pago actualizado correctamente.',
            'flete' => $fleteActualizado,
        ]);
    }

    public function generarResumen(Request $request)
{
    $request->validate([
        'fletes' => 'required|array',
        'periodo' => 'required|string',
    ]);

    $conductorFletes = collect();

    foreach ($request->fletes as $item) {
        $flete = Flete::with(['rendicion', 'conductor'])->find($item['flete_id']);
        if (!$flete || !$flete->rendicion || !$flete->conductor) continue;

        $rend = $flete->rendicion;
        $rend->pagado = $item['pagado'];

        if ($item['pagado']) {
            $rend->periodo = $request->periodo;
        } else {
            $rend->periodo = null;
            $rend->estado = 'Activo';
        }

        $rend->save();
        $conductorFletes->push($flete);
    }

    $agrupadoPorConductor = $conductorFletes
        ->groupBy(fn($f) => $f->conductor->id)
        ->map(function ($fletes, $conductorId) use ($request) {
            $fletesPagados = Flete::with(['rendicion', 'cliente', 'destino'])
                ->where('conductor_id', $conductorId)
                ->whereHas('rendicion', function ($q) use ($request) {
                    $q->where('pagado', true)->where('periodo', $request->periodo);
                })
                ->get();

            $fletesResumen = [];
            $totalComision = 0;
            $totalSaldo = 0;
            $saldoTemporalActivo = 0;

            foreach ($fletesPagados as $flete) {
                $r = $flete->rendicion;

                $diesel = $r->total_diesel ?? 0;
                $gastos = $r->total_gastos ?? 0;
                $viatico = $r->viatico ?? 0;
                $comision = $r->comision ?? 0;
                $comisionTotal = $flete->comision_total ?? 0;

                $estado = $r->estado;
                $saldo = $estado === 'Cerrado' ? ($r->saldo ?? 0) : 0;
                if ($estado === 'Activo') {
                    $saldoTemporalActivo += $r->saldo_temporal ?? 0;
                }

                $totalComision += $comisionTotal;
                $totalSaldo += $saldo;

                $fletesResumen[] = [
                    'destino' => $flete->destino->nombre ?? '-',
                    'cliente' => $flete->cliente->razon_social ?? '-',
                    'salida'  => $flete->fecha_salida,
                    'diesel'  => $diesel,
                    'gastos'  => $gastos,
                    'viatico' => $viatico,
                    'saldo'   => $saldo,
                    'comision' => $comision,
                    'comision_total' => $comisionTotal,
                    'estado' => $estado,
                ];
            }

            // Guardar el saldo_anterior en el siguiente periodo
            $proximoPeriodo = now()->addMonthNoOverflow()->format('F');
            $pago = Pago::firstOrNew([
                'conductor_id' => $conductorId,
                'periodo' => $proximoPeriodo,
            ]);

            $pago->saldo_anterior = $saldoTemporalActivo;
            $pago->save();

            return [
                'conductor' => $fletes->first()->conductor->name ?? 'Sin nombre',
                'fletes' => $fletesResumen,
                'resumen' => [
                    'total_comision' => $totalComision,
                    'total_saldo' => $totalSaldo,
                    'total_anticipo' => $pago->anticipo_sueldo ?? 0,
                    'saldo_anterior' => $saldoTemporalActivo,
                ]
            ];
        });

    // Juntar todos los fletes y usar solo un resumen si hay uno solo
    $todo = $agrupadoPorConductor->flatMap(fn($r) => $r['fletes']);
    $resumen = $agrupadoPorConductor->count() === 1
        ? $agrupadoPorConductor->first()['resumen']
        : ['total_comision' => 0, 'total_saldo' => 0, 'total_anticipo' => 0, 'saldo_anterior' => 0];

        $logoPath = public_path('img/scar3.png');
$logoBase64 = '';

// Asegúrate de que el archivo exista y sea legible
if (file_exists($logoPath)) {
    $logoBase64 = base64_encode(file_get_contents($logoPath));
}

    $pdf = SnappyPdf::loadView('pdf.resumen_pagos', [
    'fletes' => $todo,
    'resumen' => $resumen,
    'periodo' => $request->periodo,
    'agrupados' => $agrupadoPorConductor,
    'logoBase64' => $logoBase64,
]);


    return response($pdf->output(), 200)->header('Content-Type', 'application/pdf');
}


}
