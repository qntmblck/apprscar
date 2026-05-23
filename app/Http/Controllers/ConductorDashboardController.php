<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Flete;
use App\Models\PostulacionConductor;

class ConductorDashboardController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();

        $solicitudStatus = PostulacionConductor::where('user_id', $userId)
            ->whereIn('status', ['approved', 'rejected'])
            ->latest('approved_at')
            ->first(['status', 'admin_notes']);

        // Resumen de servicios del conductor
        $resumen = [
            'en_curso'       => Flete::where('conductor_id', $userId)->where('estado', 'En curso')->count(),
            'sin_rendir'     => Flete::where('conductor_id', $userId)
                ->where('estado', 'En curso')
                ->whereDoesntHave('rendicion', fn ($q) => $q->where('estado', 'Cerrado'))
                ->count(),
            'rendidos'       => Flete::where('conductor_id', $userId)->where('estado', 'Rendido')->count(),
            'aprobados'      => Flete::where('conductor_id', $userId)->where('estado', 'Aprobado')->count(),
            'pagados'        => Flete::where('conductor_id', $userId)->where('estado', 'Pagado')->count(),
            'total'          => Flete::where('conductor_id', $userId)->count(),
        ];

        // Últimos 3 fletes para el panel rápido
        $ultimosFletes = Flete::with(['destino:id,nombre', 'rendicion:id,flete_id,estado'])
            ->where('conductor_id', $userId)
            ->orderByDesc('fecha_salida')
            ->limit(3)
            ->get(['id', 'destino_id', 'estado', 'fecha_salida', 'fecha_llegada', 'rendicion_solicitada_at']);

        return Inertia::render('Dashboards/ConductorDashboard', [
            'solicitudStatus' => $solicitudStatus
                ? ['status' => $solicitudStatus->status, 'admin_notes' => $solicitudStatus->admin_notes]
                : null,
            'resumen'       => $resumen,
            'ultimosFletes' => $ultimosFletes,
        ]);
    }
}
