<?php

namespace App\Http\Controllers;

use App\Models\Flete;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FleteConductorController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $fletes = Flete::with([
                'cliente',
                'destino',
                'rendicion.gastos',
                'rendicion.diesels',
            ])
            ->where('conductor_id', $user->id)
            ->latest()
            ->get();

        $fletes->each(function ($flete) {
            if ($flete->rendicion) {
                $flete->rendicion->makeVisible([
                    'saldo_temporal',
                    'total_gastos',
                    'total_diesel',
                    'viatico_calculado',
                ]);
            }
        });

        return Inertia::render('Conductor/Fletes/Index', [
            'fletes' => $fletes,
            'auth' => [
                'user' => $user,
                'roles' => $user->getRoleNames()->toArray(), // ← IMPORTANTE
            ],
            'role' => $user->getRoleNames()->first(),
            'filters' => [
                'conductor_id' => '',
                'cliente_id' => '',
                'tracto_id' => '',
            ],
            'conductores' => [],
            'clientes' => [],
            'tractos' => [],
        ]);
    }
}
