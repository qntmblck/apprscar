<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
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

        return Inertia::render('Dashboards/ColaboradorDashboard', [
            'solicitudStatus' => $solicitudStatus
                ? ['status' => $solicitudStatus->status, 'admin_notes' => $solicitudStatus->admin_notes]
                : null,
        ]);
    }
}
