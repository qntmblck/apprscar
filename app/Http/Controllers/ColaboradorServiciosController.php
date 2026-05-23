<?php

namespace App\Http\Controllers;

use App\Models\Flete;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ColaboradorServiciosController extends Controller
{
    /**
     * Lista los servicios/fletes donde el colaborador autenticado participó.
     * Vista de solo lectura: el colaborador ve estado, destino, cliente y fechas.
     * NO se exponen rendiciones ni gastos.
     */
    public function index(): Response
    {
        $user = Auth::user();

        $fletes = Flete::with([
            'destino:id,nombre',
            'clientePrincipal:id,razon_social',
            'tracto:id,patente',
        ])
            ->where('colaborador_id', $user->id)
            ->orderByDesc('fecha_salida')
            ->paginate(20);

        $totales = [
            'en_curso'  => Flete::where('colaborador_id', $user->id)->where('estado', 'En curso')->count(),
            'rendidos'  => Flete::where('colaborador_id', $user->id)->where('estado', 'Rendido')->count(),
            'aprobados' => Flete::where('colaborador_id', $user->id)->where('estado', 'Aprobado')->count(),
            'pagados'   => Flete::where('colaborador_id', $user->id)->where('estado', 'Pagado')->count(),
        ];

        return Inertia::render('Colaborador/Servicios/Index', [
            'fletes'  => $fletes,
            'totales' => $totales,
            'auth'    => [
                'user'  => $user,
                'roles' => $user->getRoleNames()->toArray(),
            ],
        ]);
    }
}
