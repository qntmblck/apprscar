<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Flete;
use App\Models\SolicitudColaborador;

class ColaboradorDashboardController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();

        $solicitudStatus = SolicitudColaborador::where('user_id', $userId)
            ->whereIn('status', ['approved', 'rejected'])
            ->latest('approved_at')
            ->first(['status', 'admin_notes']);

        $resumen = [
            'en_curso'  => Flete::where('colaborador_id', $userId)->where('estado', 'En curso')->count(),
            'rendidos'  => Flete::where('colaborador_id', $userId)->where('estado', 'Rendido')->count(),
            'aprobados' => Flete::where('colaborador_id', $userId)->where('estado', 'Aprobado')->count(),
            'pagados'   => Flete::where('colaborador_id', $userId)->where('estado', 'Pagado')->count(),
            'total'     => Flete::where('colaborador_id', $userId)->count(),
        ];

        $ultimosFletes = Flete::with(['destino:id,nombre'])
            ->where('colaborador_id', $userId)
            ->orderByDesc('fecha_salida')
            ->limit(3)
            ->get(['id', 'destino_id', 'estado', 'fecha_salida', 'fecha_llegada']);

        return Inertia::render('Dashboards/ColaboradorDashboard', [
            'solicitudStatus' => $solicitudStatus
                ? ['status' => $solicitudStatus->status, 'admin_notes' => $solicitudStatus->admin_notes]
                : null,
            'resumen'       => $resumen,
            'ultimosFletes' => $ultimosFletes,
        ]);
    }
}
