<?php

namespace App\Http\Controllers;

use App\Models\Flete;
use App\Mail\FleteNotificado;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

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
    $validated = $request->validate([
        'flete_ids'   => 'required|array',
        'flete_ids.*' => 'integer|exists:fletes,id',
    ]);

    $fletes = Flete::with('rendicion.adicionales')
                    ->findMany($validated['flete_ids']);

    foreach ($fletes as $flete) {
        try {
            // 1) Renderizamos el HTML
            $html = view('emails.fletes.notificado', [
                'flete'       => $flete,
                'adicionales' => $flete->rendicion->adicionales,
            ])->render();

            // 2) Preparamos los adicionales y capturamos los “zeros” (monto = 0 o null)
            $items = collect($flete->rendicion->adicionales);
            $zeros = $items->filter(fn($ad) => $ad->monto == 0 || is_null($ad->monto));

            // 3) Construimos el subjectList incluyendo las descripciones de esos zeros
            $subjectList = collect()
                ->push($flete->guiaruta)                         // "124768 - 124765"
                ->push(optional($flete->destino)->nombre ?? '')   // "Coquimbo"
                ->merge($zeros->pluck('descripcion'))             // ["La Cantera","Peñuelas"]
                ->filter()                                        // elimina cadenas vacías
                ->implode(', ');                                  // => "124768 - 124765, Coquimbo, La Cantera, Peñuelas"

            // 4) Enviamos el correo con el subject definitivo
            Mail::html($html, function($msg) use ($subjectList) {
                $msg->from(config('mail.from.address'), config('mail.from.name'));
                $msg->to('contacto@scartransportes.cl');
                $msg->cc('scartransportes@gmail.com');
                $msg->subject("Rendición {$subjectList}");
            });

            // 5) Marcamos en BD que este flete ya fue notificado
            $flete->estado = 'Notificado';
            $flete->save();

            Log::info("Email Flete #{$flete->id} enviado y estado guardado como Notificado.");
        } catch (Throwable $e) {
            Log::error("Error enviando Flete #{$flete->id}: " . $e->getMessage());
            return response()->json([
                'message' => 'Error interno enviando correo.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    return response()->json([
        'message' => 'Todos los correos procesados con éxito.',
    ]);
}


}








