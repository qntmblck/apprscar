<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\PostulacionConductor;
use App\Models\SolicitudTransporte;
use App\Models\SolicitudColaborador;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();

        // Buscar la solicitud más reciente que haya sido procesada (approved/rejected)
        $conductor = PostulacionConductor::where('user_id', $userId)
            ->whereIn('status', ['approved', 'rejected'])
            ->latest('approved_at')
            ->first(['status', 'admin_notes']);

        $transporte = SolicitudTransporte::where('user_id', $userId)
            ->whereIn('status', ['approved', 'rejected'])
            ->latest('approved_at')
            ->first(['status', 'admin_notes']);

        $colaborador = SolicitudColaborador::where('user_id', $userId)
            ->whereIn('status', ['approved', 'rejected'])
            ->latest('approved_at')
            ->first(['status', 'admin_notes']);

        // Consolidar notificaciones por tipo
        $notifications = [];
        if ($conductor) {
            $notifications[] = ['tipo' => 'conductor', 'status' => $conductor->status, 'admin_notes' => $conductor->admin_notes];
        }
        if ($transporte) {
            $notifications[] = ['tipo' => 'transporte', 'status' => $transporte->status, 'admin_notes' => $transporte->admin_notes];
        }
        if ($colaborador) {
            $notifications[] = ['tipo' => 'colaborador', 'status' => $colaborador->status, 'admin_notes' => $colaborador->admin_notes];
        }

        return Inertia::render('Dashboard', [
            'solicitudNotifications' => $notifications,
        ]);
    }
}
