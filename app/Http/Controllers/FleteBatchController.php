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
}
