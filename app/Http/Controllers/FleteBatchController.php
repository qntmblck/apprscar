<?php

namespace App\Http\Controllers;

use App\Models\Flete;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class FleteBatchController extends Controller
{
    /**
     * Export selected fletes as CSV respaldo.
     */
    public function exportExcel(Request $request): StreamedResponse|JsonResponse
    {
        try {
            $request->validate([
                'flete_ids'   => 'required|array',
                'flete_ids.*' => 'integer|exists:fletes,id',
            ]);

            $fletes = Flete::with(['conductor', 'clientePrincipal', 'destino', 'rendicion'])
                            ->whereIn('id', $request->flete_ids)
                            ->get();

            $exportData = $fletes->map(function($f) {
                return [
                    'ID'            => $f->id,
                    'Conductor'     => optional($f->conductor)->name,
                    'Cliente'       => optional($f->clientePrincipal)->nombre,
                    'Destino'       => optional($f->destino)->nombre,
                    'Fecha Salida'  => $f->fecha_salida,
                    'Fecha Llegada' => $f->fecha_llegada,
                    'Comisión'      => $f->rendicion->comision ?? 0,
                    'Saldo'         => $f->rendicion->saldo ?? 0,
                    'Pagado'        => $f->pagado ? 'Sí' : 'No',
                ];
            })->toArray();

            return response()->streamDownload(function() use ($exportData) {
                $handle = fopen('php://output', 'w');
                // BOM UTF-8 para Excel
                fprintf($handle, "\xEF\xBB\xBF");
                // Cabeceras
                if (!empty($exportData)) {
                    fputcsv($handle, array_keys($exportData[0]));
                }
                // Filas
                foreach ($exportData as $row) {
                    fputcsv($handle, $row);
                }
                fclose($handle);
            }, 'respaldo_fletes.csv', [
                'Content-Type'        => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="respaldo_fletes.csv"',
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'message'   => $e->getMessage(),
                'exception' => $e->__toString(),
            ], 500);
        }
    }

    public function notificarMasivo(Request $request): JsonResponse
    {
        $request->validate([
            'flete_ids'   => 'required|array',
            'flete_ids.*' => 'integer|exists:fletes,id',
        ]);

        $ids = $request->input('flete_ids');

        // Procesamos en chunks de 3 para no saturar
        Flete::whereIn('id', $ids)
            ->chunk(3, function ($chunk) {
                foreach ($chunk as $flete) {
                    // Cargamos relaciones necesarias
                    $flete->load(['clientePrincipal', 'conductor', 'rendicion.adicionales']);

                    // Preparamos payload
                    $payload = [
                        'flete'       => $flete,
                        'adicionales' => $flete->rendicion->adicionales ?? [],
                    ];

                    // Envío síncrono para validar errores
                    try {
                        Mail::to($flete->clientePrincipal->email)
                            ->cc($flete->conductor->email)
                            ->send(new FleteNotificado($payload));

                        // Opcional: marcar notificado sólo si no hay failures
                        if (count(Mail::failures()) === 0) {
                            $flete->update(['estado_notificado' => true]);
                        }
                    } catch (\Throwable $e) {
                        // Loguear y continuar con el siguiente
                        \Log::error("Error notificando flete {$flete->id}: ".$e->getMessage());
                    }
                }
            });

        return response()->json([
            'message' => 'Envío de notificaciones iniciado en lotes de 3.',
        ]);
    }

}
