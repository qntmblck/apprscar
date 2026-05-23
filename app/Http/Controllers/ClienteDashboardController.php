<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Flete;
use App\Models\Cliente;
use App\Models\SolicitudTransporte;

class ClienteDashboardController extends Controller
{
    public function index(): Response
    {
        $userId  = auth()->id();
        $cliente = Cliente::where('user_id', $userId)->first();

        $solicitudStatus = SolicitudTransporte::where('user_id', $userId)
            ->whereIn('status', ['approved', 'rejected'])
            ->latest('approved_at')
            ->first(['status', 'admin_notes']);

        $resumen = $cliente ? [
            'en_curso'  => Flete::where('cliente_principal_id', $cliente->id)->where('estado', 'En curso')->count(),
            'rendidos'  => Flete::where('cliente_principal_id', $cliente->id)->where('estado', 'Rendido')->count(),
            'aprobados' => Flete::where('cliente_principal_id', $cliente->id)->where('estado', 'Aprobado')->count(),
            'pagados'   => Flete::where('cliente_principal_id', $cliente->id)->where('estado', 'Pagado')->count(),
            'total'     => Flete::where('cliente_principal_id', $cliente->id)->count(),
        ] : ['en_curso' => 0, 'rendidos' => 0, 'aprobados' => 0, 'pagados' => 0, 'total' => 0];

        $ultimosFletes = $cliente ? Flete::with(['destino:id,nombre'])
            ->where('cliente_principal_id', $cliente->id)
            ->orderByDesc('fecha_salida')
            ->limit(3)
            ->get(['id', 'destino_id', 'estado', 'fecha_salida', 'fecha_llegada']) : [];

        return Inertia::render('Dashboards/ClienteDashboard', [
            'solicitudStatus' => $solicitudStatus
                ? ['status' => $solicitudStatus->status, 'admin_notes' => $solicitudStatus->admin_notes]
                : null,
            'resumen'       => $resumen,
            'ultimosFletes' => $ultimosFletes,
        ]);
    }
}
