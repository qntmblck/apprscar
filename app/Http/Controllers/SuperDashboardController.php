<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Flete;
use App\Models\User;
use App\Models\Mantencion;
use App\Models\PostulacionConductor;
use App\Models\SolicitudTransporte;
use App\Models\SolicitudColaborador;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SuperDashboardController extends Controller
{
    public function index(): Response
    {
        $now      = Carbon::now();
        $mesActual = $now->copy()->startOfMonth();
        $mesAnterior = $now->copy()->subMonth()->startOfMonth();
        $mesAnteriorFin = $now->copy()->subMonth()->endOfMonth();

        // ── KPIs Operacionales ────────────────────────────────────────
        $fletesEnCurso    = Flete::where('estado', 'En curso')->count();
        $fletesRendidos   = Flete::where('estado', 'Rendido')->count();
        $fletesAprobados  = Flete::where('estado', 'Aprobado')->count();
        $fletesMes        = Flete::where('fecha_salida', '>=', $mesActual)->count();
        $fletesMesAnterior = Flete::whereBetween('fecha_salida', [$mesAnterior, $mesAnteriorFin])->count();

        // ── KPIs Financieros (rendiciones) ────────────────────────────
        // Saldo promedio de rendiciones aprobadas este mes
        $saldoAprobadoMes = \App\Models\Rendicion::whereHas('flete', fn($q) =>
            $q->where('estado', 'Aprobado')->where('updated_at', '>=', $mesActual)
        )->avg('saldo') ?? 0;

        // Total pagado este mes
        $pagadoMes = Flete::where('estado', 'Pagado')
            ->where('updated_at', '>=', $mesActual)
            ->count();

        // Saldo total pendiente de pago (aprobados)
        $saldoTotalAprobado = \App\Models\Rendicion::whereHas('flete', fn($q) =>
            $q->where('estado', 'Aprobado')
        )->sum('saldo');

        // ── KPIs de Conductores ───────────────────────────────────────
        $conductoresActivos = User::role('conductor')->count();
        $conductoresConFlete = Flete::where('estado', 'En curso')
            ->whereNotNull('conductor_id')
            ->distinct('conductor_id')
            ->count('conductor_id');

        // ── Fletes sin rendir (en curso con conductor) ────────────────
        $sinRendir = Flete::where('estado', 'En curso')->whereNotNull('conductor_id')->count();

        // ── Actividad reciente ────────────────────────────────────────
        $ultimosFletes = Flete::with('destino:id,nombre', 'conductor:id,name')
            ->whereNotNull('conductor_id')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($f) => [
                'id'         => $f->id,
                'destino'    => $f->destino?->nombre ?? '—',
                'conductor'  => $f->conductor?->name ?? '—',
                'estado'     => $f->estado,
                'fecha'      => $f->created_at?->format('d/m'),
            ]);

        // ── Solicitudes pendientes ────────────────────────────────────
        $solicitudesTransporte = SolicitudTransporte::with('user')
            ->where('status', 'pending')->latest()->get()
            ->map(fn($s) => [
                'id' => $s->id, 'user_name' => $s->user?->name,
                'user_email' => $s->user?->email ?? $s->contact_email,
                'origin' => $s->origin, 'destination' => $s->destination,
                'created_at' => $s->created_at,
            ]);

        $solicitudesConductor = PostulacionConductor::with('user')
            ->where('status', 'pending')->latest()->get()
            ->map(fn($s) => [
                'id' => $s->id, 'user_name' => $s->user?->name,
                'user_email' => $s->user?->email,
                'city' => $s->city, 'license_type' => $s->license_type,
                'created_at' => $s->created_at,
            ]);

        $solicitudesColaborador = SolicitudColaborador::with('user')
            ->where('status', 'pending')->latest()->get()
            ->map(fn($s) => [
                'id' => $s->id, 'user_name' => $s->user?->name,
                'user_email' => $s->user?->email ?? $s->email,
                'company_name' => $s->company_name,
                'created_at' => $s->created_at,
            ]);

        $totalPendientes = $solicitudesTransporte->count()
                         + $solicitudesConductor->count()
                         + $solicitudesColaborador->count();

        return Inertia::render('Dashboards/SuperDashboard', [
            'kpis' => [
                'fletes_en_curso'       => $fletesEnCurso,
                'fletes_rendidos'       => $fletesRendidos,
                'fletes_aprobados'      => $fletesAprobados,
                'fletes_mes'            => $fletesMes,
                'fletes_mes_anterior'   => $fletesMesAnterior,
                'pagado_mes'            => $pagadoMes,
                'sin_rendir'            => $sinRendir,
                'conductores_activos'   => $conductoresActivos,
                'conductores_con_flete' => $conductoresConFlete,
                'saldo_total_aprobado'  => round($saldoTotalAprobado),
            ],
            'ultimosFletes'        => $ultimosFletes,
            'solicitudesPendientes' => [
                'transporte'  => $solicitudesTransporte,
                'conductor'   => $solicitudesConductor,
                'colaborador' => $solicitudesColaborador,
            ],
            'totalPendientes' => $totalPendientes,
        ]);
    }
}
