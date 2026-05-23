<?php

namespace App\Http\Controllers;

use App\Models\Flete;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ConductorServiciosController extends Controller
{
    /**
     * Lista los servicios/fletes del conductor autenticado.
     * Incluye rendición y sus totales para que el conductor pueda ver su estado
     * y rendir gastos si aún no lo ha hecho.
     */
    public function index(): Response
    {
        $user = Auth::user();

        $fletes = Flete::with([
            'destino:id,nombre',
            'clientePrincipal:id,razon_social',
            'tracto:id,patente',
            'rampla:id,patente',
            'rendicion.gastos:id,rendicion_id,tipo,monto',
            'rendicion.diesels:id,rendicion_id,litros,monto',
            'rendicion.abonos:id,rendicion_id,monto',
        ])
            ->where('conductor_id', $user->id)
            ->orderByDesc('fecha_salida')
            ->paginate(20);

        $fletes->each(function ($flete) {
            if ($flete->rendicion) {
                $flete->rendicion->makeVisible([
                    'total_gastos',
                    'total_diesel',
                    'viatico_calculado',
                    'saldo_temporal',
                ]);
            }
        });

        // Contadores para el resumen del conductor
        $totales = [
            'en_curso'  => Flete::where('conductor_id', $user->id)->where('estado', 'En curso')->count(),
            'pendiente' => Flete::where('conductor_id', $user->id)->where('estado', 'En curso')
                ->whereDoesntHave('rendicion', fn ($q) => $q->where('estado', 'Cerrado'))
                ->count(),
            'rendidos'  => Flete::where('conductor_id', $user->id)->where('estado', 'Rendido')->count(),
            'aprobados' => Flete::where('conductor_id', $user->id)->where('estado', 'Aprobado')->count(),
            'pagados'   => Flete::where('conductor_id', $user->id)->where('estado', 'Pagado')->count(),
        ];

        return Inertia::render('Conductor/Servicios/Index', [
            'fletes'  => $fletes,
            'totales' => $totales,
            'auth'    => [
                'user'  => $user,
                'roles' => $user->getRoleNames()->toArray(),
            ],
        ]);
    }
}
