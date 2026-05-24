<?php

namespace App\Http\Controllers;

use App\Models\Flete;
use App\Models\User;
use App\Models\PostulacionConductor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SuperRendicionesController extends Controller
{
    /**
     * Panel de rendiciones para superadmin — análogo al panel de reseñas.
     *
     * Muestra:
     *  - Fletes EN CURSO sin rendición cerrada (pendientes de rendir)
     *  - Fletes RENDIDOS esperando aprobación
     *  - Fletes APROBADOS pendientes de pago
     *  - Historial de PAGADOS
     *
     * El superadmin puede solicitar la rendición a conductores que no han rendido.
     */
    public function index(Request $request): Response
    {
        $filtros = [
            'conductor_id' => $request->input('conductor_id'),
            'estado'       => $request->input('estado'),
            'desde'        => $request->input('desde'),
            'hasta'        => $request->input('hasta'),
        ];

        // ── Contadores generales ──────────────────────────────────────────────
        $stats = [
            'sin_rendir'  => Flete::where('estado', 'En curso')
                ->whereDoesntHave('rendicion', fn ($q) => $q->where('estado', 'Cerrado'))
                ->whereNotNull('conductor_id')
                ->count(),
            'rendidos'    => Flete::where('estado', 'Rendido')->count(),
            'aprobados'   => Flete::where('estado', 'Aprobado')->count(),
            'pagados'     => Flete::where('estado', 'Pagado')->count(),
        ];

        // ── Lista principal (filtrable) ────────────────────────────────────────
        $query = Flete::with([
            'destino:id,nombre',
            'clientePrincipal:id,razon_social',
            'conductor:id,name,email',
            'tracto:id,patente',
            'rampla:id,patente',
            'tarifa:id,valor_comision',
            'rendicion:id,flete_id,estado,saldo,viatico_calculado,viatico_efectivo,comision,observaciones,updated_at',
            'rendicion.gastos:id,rendicion_id,tipo,descripcion,monto',
            'rendicion.diesels:id,rendicion_id,litros,metodo_pago,monto',
            'rendicion.abonos:id,rendicion_id,metodo,monto',
            'retorno:id,flete_id,valor,descripcion',
        ])
            ->whereNotNull('conductor_id')   // Solo fletes con conductor asignado
            ->when($filtros['conductor_id'], fn ($q) => $q->where('conductor_id', $filtros['conductor_id']))
            ->when($filtros['estado'],       fn ($q) => $q->where('estado', $filtros['estado']))
            ->when($filtros['desde'],        fn ($q) => $q->whereDate('fecha_salida', '>=', $filtros['desde']))
            ->when($filtros['hasta'],        fn ($q) => $q->whereDate('fecha_salida', '<=', $filtros['hasta']))
            ->orderByRaw("CASE estado
                WHEN 'Rendido'  THEN 1
                WHEN 'En curso' THEN 2
                WHEN 'Aprobado' THEN 3
                WHEN 'Pagado'   THEN 4
                ELSE 5 END")
            ->orderByDesc('fecha_salida');

        $fletes = $query->paginate(30)->appends($filtros);

        $fletes->each(function ($flete) {
            if ($flete->rendicion) {
                $flete->rendicion->makeVisible([
                    'saldo', 'total_gastos', 'total_diesel', 'viatico_calculado', 'comision', 'observaciones',
                ]);
            }
            // comision_total = tarifa + retorno
            $flete->comision_total = ($flete->tarifa?->valor_comision ?? 0)
                                   + ($flete->retorno?->valor ?? 0);
        });

        // Enrich each flete's conductor with their phone from PostulacionConductor
        $fletes->each(function ($flete) {
            if ($flete->conductor_id) {
                $postulacion = PostulacionConductor::where('user_id', $flete->conductor_id)
                    ->where('status', 'approved')
                    ->first(['phone']);
                $flete->conductor_phone = $postulacion?->phone;
            }
        });

        $conductores = User::role('conductor')->orderBy('name')->get(['id', 'name'])->map(function ($u) {
            $p = PostulacionConductor::where('user_id', $u->id)
                ->where('status', 'approved')
                ->first(['phone']);
            $u->phone = $p?->phone;
            return $u;
        });

        return Inertia::render('Super/Rendiciones/Index', [
            'fletes'      => $fletes,
            'stats'       => $stats,
            'filtros'     => $filtros,
            'conductores' => $conductores,
            'estados'     => ['En curso', 'Rendido', 'Aprobado', 'Pagado'],
            'auth'        => ['user' => Auth::user(), 'roles' => Auth::user()->getRoleNames()],
        ]);
    }

    /**
     * El superadmin solicita al conductor que rinda sus gastos.
     * Marca la fecha de solicitud en el flete (análogo a "solicitar reseña").
     */
    public function solicitarRendicion(Flete $flete): JsonResponse
    {
        abort_if($flete->conductor_id === null, 422, 'Este flete no tiene conductor asignado.');
        abort_if($flete->estado !== 'En curso', 422, 'Solo se puede solicitar rendición en fletes En curso.');

        $flete->update(['rendicion_solicitada_at' => now()]);

        // TODO: disparar notificación/email al conductor
        // Notification::send($flete->conductor, new RendicionSolicitadaNotification($flete));

        return response()->json([
            'message' => "Rendición solicitada al conductor {$flete->conductor->name}.",
            'flete'   => $flete->only(['id', 'estado', 'rendicion_solicitada_at']),
        ]);
    }

    /**
     * Aprobar la rendición: pasa el flete de Rendido → Aprobado.
     */
    public function aprobar(Flete $flete): JsonResponse
    {
        abort_if($flete->estado !== 'Rendido', 422, "El flete debe estar en estado 'Rendido' para aprobarlo.");

        $flete->update(['estado' => 'Aprobado']);

        if ($flete->rendicion) {
            $flete->rendicion->recalcularTotales();
        }

        return response()->json([
            'message' => "Flete #{$flete->id} aprobado.",
            'flete'   => $flete->fresh(['rendicion', 'conductor:id,name', 'destino:id,nombre']),
        ]);
    }

    /**
     * Marcar como pagado: pasa el flete de Aprobado → Pagado.
     */
    public function marcarPagado(Flete $flete): JsonResponse
    {
        abort_if($flete->estado !== 'Aprobado', 422, "El flete debe estar 'Aprobado' antes de marcarlo como pagado.");

        $flete->update(['estado' => 'Pagado', 'pagado' => true]);

        return response()->json([
            'message' => "Flete #{$flete->id} marcado como pagado.",
            'flete'   => $flete->fresh(['conductor:id,name', 'destino:id,nombre']),
        ]);
    }

    /**
     * Objetar rendición — devuelve a "En curso" con observación, dejándola editable.
     */
    public function objetar(Flete $flete, Request $request): JsonResponse
    {
        abort_if($flete->estado !== 'Rendido', 422, "Solo se puede objetar una rendición en estado 'Rendido'.");

        $validated = $request->validate([
            'observacion' => 'required|string|max:500',
        ]);

        $flete->update(['estado' => 'En curso']);

        if ($flete->rendicion) {
            $flete->rendicion->update([
                'observaciones' => $validated['observacion'],
            ]);
        }

        return response()->json([
            'message' => "Rendición del flete #{$flete->id} objetada y devuelta al conductor.",
            'flete'   => $flete->fresh(['rendicion', 'conductor:id,name,email', 'destino:id,nombre']),
        ]);
    }

    /**
     * Aprobar múltiples rendiciones en batch.
     */
    public function aprobarBatch(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids'   => 'required|array|min:1',
            'ids.*' => 'integer|exists:fletes,id',
        ]);

        $aprobados = 0;
        foreach ($validated['ids'] as $id) {
            $flete = Flete::find($id);
            if ($flete && $flete->estado === 'Rendido') {
                $flete->update(['estado' => 'Aprobado']);
                if ($flete->rendicion) $flete->rendicion->recalcularTotales();
                $aprobados++;
            }
        }

        return response()->json([
            'message'   => "{$aprobados} rendición(es) aprobada(s).",
            'aprobados' => $aprobados,
        ]);
    }
}
