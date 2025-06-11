<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Flete;
use App\Models\Cliente;
use App\Models\Tracto;
use App\Models\User;
use App\Models\Rendicion;
use App\Models\Rampla;
use App\Models\Destino;
use App\Models\Tarifa;
use Inertia\Inertia;

class FleteController extends Controller
{
    public function index(Request $request)
{
    $user = auth()->user();

    // Recogemos filtros para enviarlos de vuelta a la vista
    $filters = [
        'conductor_ids' => $request->input('conductor_ids', []),
        'cliente_ids'   => $request->input('cliente_ids', []),
        'tracto_ids'    => $request->input('tracto_ids', []),
        'fecha_desde'   => $request->input('fecha_desde', ''),  // yyyy-MM-dd
        'fecha_hasta'   => $request->input('fecha_hasta', ''),  // yyyy-MM-dd
    ];

    $meses = [
        'Enero'      => 1,
        'Febrero'    => 2,
        'Marzo'      => 3,
        'Abril'      => 4,
        'Mayo'       => 5,
        'Junio'      => 6,
        'Julio'      => 7,
        'Agosto'     => 8,
        'Septiembre' => 9,
        'Octubre'    => 10,
        'Noviembre'  => 11,
        'Diciembre'  => 12,
    ];

    $query = Flete::query()
        ->select([
            'id',
            'destino_id',
            'cliente_principal_id',
            'conductor_id',
            'colaborador_id',
            'tracto_id',
            'rampla_id',
            'fecha_salida',
            'fecha_llegada',
            'estado',
            'pagado',
            'retorno',
            'guiaruta',
        ])
        ->with([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'colaborador:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'destino:id,nombre',
            'rendicion:id,flete_id,estado,viatico_efectivo,viatico_calculado,saldo,caja_flete,comision',
            'rendicion.gastos'  => fn($q) => $q->select(['id','rendicion_id','monto','descripcion','tipo','created_at'])->orderBy('id','desc'),
            'rendicion.diesels' => fn($q) => $q->select(['id','rendicion_id','monto','litros','metodo_pago','created_at'])->orderBy('id','desc'),
            'rendicion.abonos'  => fn($q) => $q->select(['id','rendicion_id','monto','metodo','created_at'])->orderBy('id','desc'),
        ])
        // Filtros multi-select
        ->when(
            $request->filled('conductor_ids') && is_array($request->conductor_ids),
            fn($q) => $q->whereIn('conductor_id', $request->conductor_ids)
        )
        ->when(
            $request->filled('cliente_ids') && is_array($request->cliente_ids),
            fn($q) => $q->whereIn('cliente_principal_id', $request->cliente_ids)
        )
        ->when(
            $request->filled('tracto_ids') && is_array($request->tracto_ids),
            fn($q) => $q->whereIn('tracto_id', $request->tracto_ids)
        )
        // Filtro por mes (opcional)
        ->when(
            $request->filled('periodo'),
            function($q) use ($request, $meses) {
                $numMes = $meses[$request->periodo] ?? null;
                if ($numMes) {
                    $q->whereMonth('fecha_salida', $numMes);
                }
            }
        )
        // Filtros de fecha
        ->when(
            $request->filled('fecha_desde') && $request->filled('fecha_hasta'),
            fn($q) => $q->whereBetween('fecha_salida', [
                $request->fecha_desde,
                $request->fecha_hasta,
            ])
        )
        ->when(
            $request->filled('fecha_desde') && ! $request->filled('fecha_hasta'),
            fn($q) => $q->whereDate('fecha_salida', '>=', $request->fecha_desde)
        )
        ->when(
            ! $request->filled('fecha_desde') && $request->filled('fecha_hasta'),
            fn($q) => $q->whereDate('fecha_salida', '<=', $request->fecha_hasta)
        )
        // Orden descendente
        ->orderBy('fecha_salida', 'desc');

    $fletes = $query->paginate(48)->withQueryString();

    return Inertia::render('Fletes/Index', [
        'fletes'      => $fletes,
        'filters'     => $filters,
        'conductores' => User::orderBy('name')->get(['id','name']),
        'clientes'    => Cliente::select('id','razon_social')->get(),
        'tractos'     => Tracto::select('id','patente')->get(),
        'auth'        => [
            'user'  => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ],
    ]);
}




    public function store(Request $request)
    {
        $request->validate([
            'conductor_id'          => 'required|exists:users,id',
            'cliente_principal_id'  => 'required|exists:clientes,id',
            'destino_id'            => 'required|exists:destinos,id',
            'tipo'                  => 'required|in:Directo,Reparto',
            'fecha_salida'          => 'required|date',
            'kilometraje'           => 'required|numeric|min:1',
            'fecha_desde' => 'nullable|date',
  'fecha_hasta' => 'nullable|date|after_or_equal:fecha_desde',
        ]);

        $conductor = User::findOrFail($request->conductor_id);
        $cliente   = Cliente::findOrFail($request->cliente_principal_id);
        $destino   = Destino::findOrFail($request->destino_id);
        $tarifa    = Tarifa::where([
                        ['cliente_principal_id', $cliente->id],
                        ['destino_id',            $destino->id],
                        ['tipo',                  $request->tipo],
                     ])->first();

        $tracto = Tracto::inRandomOrder()->first();
        $rampla = Rampla::inRandomOrder()->first();

        $flete = Flete::create([
            'conductor_id'           => $conductor->id,
            'cliente_principal_id'   => $cliente->id,
            'tracto_id'              => $tracto->id,
            'rampla_id'              => $rampla->id,
            'destino_id'             => $destino->id,
            'tarifa_id'              => $tarifa?->id,
            'tipo'                   => $request->tipo,
            'kilometraje'            => $request->kilometraje,
            'rendimiento'            => round(mt_rand(30,65)/10,1),
            'estado'                 => 'Sin Notificar',
            'fecha_salida'           => $request->fecha_salida,
            'pagado'                 => false,
            'retorno'                => 0,
        ]);

        Rendicion::create([
            'flete_id'         => $flete->id,
            'user_id'          => $conductor->id,
            'estado'           => 'Activo',
            'caja_flete'       => 0,
            'viatico_efectivo' => 0,
            'viatico_calculado'=> 0,
            'saldo'            => 0,
            'comision'         => 0,
        ]);

        return redirect()
            ->route('fletes.index')
            ->with('success', 'Flete creado correctamente.');
    }

    public function finalizar(Request $request)
    {
        $validated = $request->validate([
            'flete_id'      => 'required|exists:fletes,id',
            'rendicion_id'  => 'required|exists:rendiciones,id',
            'fecha_termino' => 'nullable|date',
            'viatico_efectivo' => 'nullable|numeric|min:0',
        ]);

        $flete     = Flete::findOrFail($validated['flete_id']);
        $rendicion = Rendicion::with(['diesels','gastos','abonos'])
                              ->findOrFail($validated['rendicion_id']);

        if (! empty($validated['fecha_termino'])) {
            $flete->update(['fecha_llegada' => $validated['fecha_termino']]);
            $rendicion->estado = 'Cerrado';
        } else {
            $rendicion->estado = 'Activo';
        }

        if (isset($validated['viatico_efectivo'])) {
            $rendicion->viatico_efectivo  = $validated['viatico_efectivo'];
            $rendicion->viatico_calculado = $validated['viatico_efectivo'];
        }

        $rendicion->recalcularTotales();
        $rendicion->save();

        $fresh = $flete->fresh([
            'clientePrincipal',
            'destino',
            'conductor',
            'tracto',
            'rampla',
            'rendicion.abonos',
            'rendicion.diesels',
            'rendicion.gastos',
        ]);

        return response()->json([
            'message' => 'Flete finalizado correctamente.',
            'flete'   => $fresh,
        ], 200);
    }

    public function registrarViatico(Request $request)
    {
        $validated = $request->validate([
            'flete_id'         => 'required|exists:fletes,id',
            'rendicion_id'     => 'required|exists:rendiciones,id',
            'viatico_efectivo' => 'required|numeric|min:0',
        ]);

        $rendicion = Rendicion::with(['diesels','gastos','abonos'])
                              ->findOrFail($validated['rendicion_id']);
        $flete     = Flete::findOrFail($validated['flete_id']);

        $rendicion->update([
            'viatico_efectivo'  => $validated['viatico_efectivo'],
            'viatico_calculado' => $validated['viatico_efectivo'],
        ]);

        $rendicion->recalcularTotales();

        $fresh = $flete->fresh([
            'clientePrincipal',
            'destino',
            'conductor',
            'tracto',
            'rampla',
            'rendicion.abonos',
            'rendicion.diesels',
            'rendicion.gastos',
        ]);

        return response()->json([
            'message' => 'Viático registrado correctamente.',
            'flete'   => $fresh,
        ], 200);
    }

    public function show(Flete $flete): JsonResponse
    {
        $flete = Flete::with([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'destino:id,nombre',
            'rendicion.abonos',
            'rendicion.gastos',
            'rendicion.diesels',
        ])->findOrFail($flete->id);

        if ($flete->rendicion) {
            $flete->makeVisible(['retorno']);
            $flete->rendicion->makeVisible([
                'saldo',
                'total_gastos',
                'total_diesel',
                'viatico_calculado',
                'comision',
            ]);
        }

        return response()->json([
            'flete' => $flete,
        ], 200);
    }
}
