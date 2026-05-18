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

class SuperDashboardController extends Controller
{
    public function index(): Response
    {
        $fletesRealizados      = Flete::count();
        $conductoresActivos    = User::role('conductor')->where('estado', 'Activo')->count();
        $solicitudesMantencion = Mantencion::where('estado', 'pendiente')->count();
        $usuariosTotal         = User::count();

        $ultimosFletes = Flete::with('destino')->latest()->take(3)->get()
            ->map(fn($f) => "🟢 Flete #{$f->id} a {$f->destino->nombre}")->toArray();

        $ultimasMantenciones = Mantencion::with('tracto')->latest()->take(2)->get()
            ->map(fn($m) => "🔧 Mantención para {$m->tracto->patente}")->toArray();

        $actividadReciente = array_merge($ultimosFletes, $ultimasMantenciones);

        // Solicitudes pendientes con info del usuario
        $solicitudesTransporte = SolicitudTransporte::with('user')
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn($s) => [
                'id'           => $s->id,
                'user_name'    => $s->user?->name,
                'user_email'   => $s->user?->email ?? $s->contact_email,
                'origin'       => $s->origin,
                'destination'  => $s->destination,
                'cargo_type'   => $s->cargo_type,
                'pickup_date'  => $s->pickup_date,
                'created_at'   => $s->created_at,
            ]);

        $solicitudesConductor = PostulacionConductor::with('user')
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn($s) => [
                'id'           => $s->id,
                'user_name'    => $s->user?->name,
                'user_email'   => $s->user?->email,
                'city'         => $s->city,
                'license_type' => $s->license_type,
                'experience_years' => $s->experience_years,
                'created_at'   => $s->created_at,
            ]);

        $solicitudesColaborador = SolicitudColaborador::with('user')
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn($s) => [
                'id'           => $s->id,
                'user_name'    => $s->user?->name,
                'user_email'   => $s->user?->email ?? $s->email,
                'company_name' => $s->company_name,
                'fleet_size'   => $s->fleet_size,
                'coverage'     => $s->coverage,
                'created_at'   => $s->created_at,
            ]);

        return Inertia::render('Dashboards/SuperDashboard', [
            'summary' => [
                'fletesRealizados'      => $fletesRealizados,
                'conductoresActivos'    => $conductoresActivos,
                'solicitudesMantencion' => $solicitudesMantencion,
                'usuariosTotal'         => $usuariosTotal,
            ],
            'actividadReciente'    => $actividadReciente,
            'solicitudesPendientes' => [
                'transporte'  => $solicitudesTransporte,
                'conductor'   => $solicitudesConductor,
                'colaborador' => $solicitudesColaborador,
            ],
        ]);
    }
}
