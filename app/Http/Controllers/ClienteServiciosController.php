<?php

namespace App\Http\Controllers;

use App\Models\Flete;
use App\Models\Cliente;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ClienteServiciosController extends Controller
{
    /**
     * Lista los servicios/fletes asociados al cliente autenticado.
     * Vista de solo lectura: el cliente ve estado, destino y fechas.
     * NO se exponen datos de rendición ni gastos del conductor.
     */
    public function index(): Response
    {
        $user    = Auth::user();
        $cliente = Cliente::where('user_id', $user->id)->first();

        $fletes = $cliente
            ? Flete::with([
                'destino:id,nombre',
                'tracto:id,patente',
                'conductor:id,name',
            ])
                ->where('cliente_principal_id', $cliente->id)
                ->orderByDesc('fecha_salida')
                ->paginate(20)
            : collect([]);

        $totales = $cliente ? [
            'en_curso'  => Flete::where('cliente_principal_id', $cliente->id)->where('estado', 'En curso')->count(),
            'rendidos'  => Flete::where('cliente_principal_id', $cliente->id)->where('estado', 'Rendido')->count(),
            'aprobados' => Flete::where('cliente_principal_id', $cliente->id)->where('estado', 'Aprobado')->count(),
            'pagados'   => Flete::where('cliente_principal_id', $cliente->id)->where('estado', 'Pagado')->count(),
        ] : ['en_curso' => 0, 'rendidos' => 0, 'aprobados' => 0, 'pagados' => 0];

        return Inertia::render('Cliente/Servicios/Index', [
            'fletes'  => $fletes,
            'totales' => $totales,
            'cliente' => $cliente ? ['razon_social' => $cliente->razon_social] : null,
            'auth'    => [
                'user'  => $user,
                'roles' => $user->getRoleNames()->toArray(),
            ],
        ]);
    }
}
