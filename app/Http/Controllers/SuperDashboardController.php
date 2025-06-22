<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Flete;
use App\Models\User;
use App\Models\Mantencion;

class SuperDashboardController extends Controller
{
    public function index(): Response
    {
        // Totales para el resumen
        $fletesRealizados      = Flete::count();
        $conductoresActivos    = User::role('conductor')
                                      ->where('estado', 'Activo')
                                      ->count();
        $solicitudesMantencion = Mantencion::where('estado', 'pendiente')->count();

        // Actividad reciente: últimos fletes y mantenciones
        $ultimosFletes = Flete::with('destino')
            ->latest()
            ->take(3)
            ->get()
            ->map(fn($f) =>
                "🟢 Flete #{$f->id} a {$f->destino->nombre}"
            )->toArray();

        $ultimasMantenciones = Mantencion::with('tracto')
            ->latest()
            ->take(2)
            ->get()
            ->map(fn($m) =>
                "🔧 Solicitud de mantención para {$m->tracto->patente}"
            )->toArray();

        $actividadReciente = array_merge($ultimosFletes, $ultimasMantenciones);

        // Empaquetamos el summary
        $summary = [
            'fletesRealizados'      => $fletesRealizados,
            'conductoresActivos'    => $conductoresActivos,
            'solicitudesMantencion' => $solicitudesMantencion,
        ];

        return Inertia::render('Dashboards/SuperDashboard', [
            'summary'           => $summary,
            'actividadReciente' => $actividadReciente,
        ]);
    }
}
