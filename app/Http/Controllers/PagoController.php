<?php

namespace App\Http\Controllers;

use App\Models\Flete;
use App\Models\Pago;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\JsonResponse;
use Throwable;

class PagoController extends Controller
{
    /**
     * Genera el PDF de resumen de los fletes seleccionados.
     */
    public function resumen(Request $request): Response|JsonResponse
    {
        $request->validate([
            'flete_ids'   => 'required|array',
            'flete_ids.*' => 'integer|exists:fletes,id',
        ]);

        try {
            // 1) Recuperar los fletes con sus relaciones
            $fletes = Flete::with([
                    'conductor',
                    'destino',
                    'clientePrincipal',
                    'rendicion',
                ])
                ->whereIn('id', $request->flete_ids)
                ->get();

            // 2) Preparar variables para la vista
            $periodo    = Carbon::now()->format('Y-m');
            $logoPath   = public_path('img/scar3.png');
            $logoBase64 = file_exists($logoPath)
                ? base64_encode(file_get_contents($logoPath))
                : '';

            // 3) Renderizar Blade con Dompdf y forzar descarga
            $pdf = Pdf::loadView('pdf.resumen_pagos', compact('fletes', 'periodo', 'logoBase64'))
                ->setPaper('a4', 'portrait')
                ->setOptions([
                    'isHtml5ParserEnabled' => true,
                    'isRemoteEnabled'      => true,
                ]);

            return $pdf->download("resumen-pagos-{$periodo}.pdf");
        } catch (Throwable $e) {
            return response()->json([
                'message'   => $e->getMessage(),
                'exception' => (string) $e,
            ], 500);
        }
    }

    /**
     * Marca los fletes como pagados, crea registros en pagos y genera el PDF de liquidación.
     */
    public function liquidar(Request $request): Response|JsonResponse
    {
        $request->validate([
            'flete_ids'   => 'required|array',
            'flete_ids.*' => 'integer|exists:fletes,id',
        ]);

        try {
            // 1) Dentro de una transacción, marcar y crear Pago por conductor
            $fletes = DB::transaction(function() use ($request) {
                $fletes = Flete::with([
                        'conductor',
                        'destino',
                        'clientePrincipal',
                        'rendicion',
                    ])
                    ->whereIn('id', $request->flete_ids)
                    ->get();

                // Marcar cada uno como pagado
                $fletes->each->update(['pagado' => true]);

                // Agrupar por conductor y crear registro en pagos
                $fletes->groupBy('conductor_id')->each(function($group, $conductorId) {
                    Pago::create([
                        'conductor_id'   => $conductorId,
                        'periodo'        => Carbon::now()->format('Y-m'),
                        'total_comision' => $group->sum(fn($f) => $f->rendicion->comision ?? 0),
                        'total_saldo'    => $group->sum(fn($f) => $f->rendicion->saldo ?? 0),
                        'fecha_pago'     => Carbon::now(),
                    ]);
                });

                return $fletes;
            });

            // 2) Preparar variables para la vista de liquidación
            $periodo    = Carbon::now()->format('Y-m');
            $logoPath   = public_path('img/scar3.png');
            $logoBase64 = file_exists($logoPath)
                ? base64_encode(file_get_contents($logoPath))
                : '';

            // 3) Renderizar Blade de liquidación y forzar descarga
            $pdf = Pdf::loadView('pdf.liquidacion_pago', compact('fletes', 'periodo', 'logoBase64'))
                ->setPaper('a4', 'portrait')
                ->setOptions([
                    'isHtml5ParserEnabled' => true,
                    'isRemoteEnabled'      => true,
                ]);

            return $pdf->download("liquidacion-fletes-{$periodo}.pdf");
        } catch (Throwable $e) {
            return response()->json([
                'message'   => $e->getMessage(),
                'exception' => (string) $e,
            ], 500);
        }
    }
}
