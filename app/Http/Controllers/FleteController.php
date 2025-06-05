<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flete;
use App\Models\Cliente;
use App\Models\Tracto;
use App\Models\User;
use App\Models\Rendicion;
use App\Models\Rampla;
use App\Models\Destino;
use App\Models\Tarifa;
use Inertia\Inertia;
use Carbon\Carbon;

class FleteController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = Flete::query()
            ->with([
                'cliente:id,razon_social',
                'conductor:id,name',
                'tracto:id,patente',
                'rampla:id,patente',
                'destino:id,nombre',
                'rendicion.abonos:id,rendicion_id,monto,metodo',
                'rendicion.gastos:id,rendicion_id,monto,descripcion,tipo',
                'rendicion.diesels:id,rendicion_id,monto,litros,metodo_pago',
            ]);

        if ($user->hasRole('conductor')) {
            $query->where('conductor_id', $user->id);
        } elseif ($user->hasRole('cliente')) {
            $query->where('cliente_principal_id', $user->cliente_id);
        } elseif ($user->hasRole('colaborador')) {
            $query->whereHas('colaboradores', fn($q) => $q->where('colaborador_id', $user->id));
        }

        if ($user->hasAnyRole(['superadmin', 'admin'])) {
            if ($request->filled('conductor_id')) {
                $query->where('conductor_id', $request->conductor_id);
            }
            if ($request->filled('cliente_id')) {
                $query->where('cliente_principal_id', $request->cliente_id);
            }
            if ($request->filled('tracto_id')) {
                $query->where('tracto_id', $request->tracto_id);
            }
        }

        $fletes = $query->latest()->limit(1000)->get();

        $fletes->each(function ($flete) {
            if ($flete->rendicion) {
                $flete->rendicion->makeVisible([
                    'saldo_temporal',
                    'total_gastos',
                    'total_diesel',
                    'viatico_calculado',
                    'viatico_efectivo',
                    'caja_flete_acumulada',
                ]);
            }
        });

        return Inertia::render('Fletes/Index', [
            'fletes' => $fletes,
            'role' => $user->getRoleNames()->first(),
            'filters' => $request->only('conductor_id', 'cliente_id', 'tracto_id'),
            'conductores' => User::role('conductor')->get(['id', 'name']),
            'clientes' => Cliente::select('id', 'razon_social')->get(),
            'tractos' => Tracto::select('id', 'patente')->get(),
            'auth' => [
                'user' => $user,
                'roles' => $user->getRoleNames()->toArray(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'conductor_id' => 'required|exists:users,id',
            'cliente_id' => 'required|exists:clientes,id',
            'destino_id' => 'required|exists:destinos,id',
            'tipo' => 'required|in:Directo,Reparto',
            'fecha_salida' => 'required|date',
            'kilometraje' => 'required|numeric|min:1',
        ]);

        $conductor = User::findOrFail($request->conductor_id);
        $cliente = Cliente::findOrFail($request->cliente_id);
        $destino = Destino::findOrFail($request->destino_id);
        $tarifa = Tarifa::where('cliente_principal_id', $cliente->id)
            ->where('destino_id', $destino->id)
            ->where('tipo', $request->tipo)
            ->first();

        $tracto = Tracto::inRandomOrder()->first();
        $rampla = Rampla::inRandomOrder()->first();

        $flete = Flete::create([
            'conductor_id' => $conductor->id,
            'cliente_principal_id' => $cliente->id,
            'tracto_id' => $tracto->id,
            'rampla_id' => $rampla->id,
            'destino_id' => $destino->id,
            'tarifa_id' => $tarifa?->id,
            'tipo' => $request->tipo,
            'kilometraje' => $request->kilometraje,
            'rendimiento' => round(mt_rand(30, 65) / 10, 1),
            'estado' => 'Sin Notificar',
            'fecha_salida' => $request->fecha_salida,
        ]);

        Rendicion::create([
            'flete_id' => $flete->id,
            'user_id' => $conductor->id,
            'estado' => 'Activo',
            'caja_flete' => 0,
            'viatico_efectivo' => 0,
            'viatico_calculado' => 0,
            'saldo' => 0,
        ]);

        return redirect()->route('fletes.index')->with('success', 'Flete creado correctamente.');
    }

    public function finalizar(Request $request)
{
    $validated = $request->validate([
        'flete_id' => 'required|exists:fletes,id',
        'rendicion_id' => 'required|exists:rendiciones,id',
        'fecha_termino' => 'nullable|date',
        'viatico_efectivo' => 'nullable|numeric|min:0',
    ]);

    $flete = Flete::findOrFail($validated['flete_id']);
    $rendicion = Rendicion::with(['diesels', 'gastos'])->findOrFail($validated['rendicion_id']);

    if (isset($validated['fecha_termino'])) {
        $flete->update(['fecha_llegada' => $validated['fecha_termino']]);
    }

    if (isset($validated['viatico_efectivo'])) {
        $rendicion->update([
            'viatico_efectivo' => $validated['viatico_efectivo'],
            'viatico' => $validated['viatico_efectivo'],
        ]);
    }

    $rendicion->recalcularTotales();

    return response()->json([
    'message' => 'Flete finalizado correctamente.',
    'flete' => $flete->fresh([
        'cliente',
        'destino',
        'conductor',
        'tracto',
        'rampla',
        'rendicion.gastos',
        'rendicion.diesels',
        'rendicion.abonos',
    ]),
]);
}


    public function registrarViatico(Request $request)
    {
        $validated = $request->validate([
            'flete_id' => 'required|exists:fletes,id',
            'rendicion_id' => 'required|exists:rendiciones,id',
            'viatico_efectivo' => 'required|numeric|min:0',
        ]);

        $rendicion = Rendicion::with(['diesels', 'gastos'])->findOrFail($validated['rendicion_id']);

        $rendicion->update([
            'viatico_efectivo' => $validated['viatico_efectivo'],
            'viatico' => $validated['viatico_efectivo'],
        ]);

        $rendicion->recalcularTotales();




        return response()->json([
    'message' => 'Flete finalizado correctamente.',
    'flete' => $flete->fresh([
        'cliente',
        'destino',
        'conductor',
        'tracto',
        'rampla',
        'rendicion.gastos',
        'rendicion.diesels',
        'rendicion.abonos',
    ]),
]);

    }


public function cerrarRendicion(Request $request, Flete $flete)
{
    $rendicion = $flete->rendicion;

    if (!$flete->fecha_llegada) {
        return response()->json(['error' => 'El flete no tiene una fecha de llegada registrada.'], 422);
    }

    // Solo si la comisión es MANUAL (≠ a la de la tarifa), se requiere retorno
    $comisionTarifa = $flete->tarifa?->valor_comision;

    if (!is_null($flete->comision) && $flete->comision != 0 && $flete->comision !== $comisionTarifa) {
        if (is_null($flete->retorno) || $flete->retorno == 0) {
            return response()->json(['error' => 'El flete tiene comisión manual, pero no tiene un valor válido para retorno.'], 422);
        }
    }

    if (!$rendicion) {
        return response()->json(['error' => 'La rendición asociada no existe.'], 422);
    }

    $rendicion->update([
        'viatico'     => $rendicion->viatico_efectivo,
        'saldo'       => $rendicion->saldo_temporal,
        'caja_flete'  => $rendicion->caja_flete_acumulada,
        'estado'      => 'Cerrado',
    ]);

    $flete->load([
        'cliente',
        'conductor',
        'tracto',
        'rampla',
        'destino',
        'rendicion.abonos',
        'rendicion.gastos',
        'rendicion.diesels',
    ]);

    $flete->rendicion->makeVisible([
        'saldo_temporal',
        'total_diesel',
        'total_gastos',
        'viatico_efectivo',
        'viatico_calculado',
        'caja_flete_acumulada',
    ]);

    return response()->json([
        'message' => '✅ Rendición cerrada correctamente.',
        'flete' => $flete,
    ]);
}



}
