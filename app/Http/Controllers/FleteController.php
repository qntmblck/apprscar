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
        'conductor_ids'    => $request->input('conductor_ids', []),
        'colaborador_ids'  => $request->input('colaborador_ids', []),
        'cliente_ids'      => $request->input('cliente_ids',   []),
        'tracto_ids'       => $request->input('tracto_ids',    []),
        'destino'          => $request->input('destino',       ''),
        'fecha_desde'      => $request->input('fecha_desde',   ''),
        'fecha_hasta'      => $request->input('fecha_hasta',   ''),
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
        // Filtro “Titular”: conductor OR colaborador
        ->when(
            ($request->filled('conductor_ids') && is_array($request->conductor_ids))
            || ($request->filled('colaborador_ids') && is_array($request->colaborador_ids)),
            function($q) use ($request) {
                $q->where(function($sub) use ($request) {
                    if (!empty($request->conductor_ids)) {
                        $sub->whereIn('conductor_id', $request->conductor_ids);
                    }
                    if (!empty($request->colaborador_ids)) {
                        $sub->orWhereIn('colaborador_id', $request->colaborador_ids);
                    }
                });
            }
        )
        // Otros filtros multi-select
        ->when(
            $request->filled('cliente_ids') && is_array($request->cliente_ids),
            fn($q) => $q->whereIn('cliente_principal_id', $request->cliente_ids)
        )
        ->when(
            $request->filled('tracto_ids') && is_array($request->tracto_ids),
            fn($q) => $q->whereIn('tracto_id', $request->tracto_ids)
        )
        // Filtro por periodo de mes
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
        // Filtro de texto en destino
        ->when(
            $request->filled('destino'),
            function($q) use ($request) {
                $term = strtoupper($request->input('destino'));
                $q->whereHas('destino', fn($q2) => $q2->whereRaw('UPPER(nombre) LIKE ?', ["%{$term}%"]));
            }
        )
        // Orden descendente por fecha_salida
        ->orderBy('fecha_salida', 'desc');

    $fletes = $query->paginate(48)->withQueryString();

    return Inertia::render('Fletes/Index', [
        'fletes'        => $fletes,
        'filters'       => $filters,
        'conductores'   => User::role('conductor')->orderBy('name')->get(['id','name']),
        'colaboradores' => User::role('colaborador')->orderBy('name')->get(['id','name']),
        'clientes'      => Cliente::select('id','razon_social')->get(),
        'tractos'       => Tracto::select('id','patente')->get(),
        'destinos'      => Destino::select('id','nombre')->get(),
        'ramplas'       => Rampla::select('id','patente')->get(),
        'auth'          => [
            'user'  => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ],
    ]);
}

    public function store(Request $request)
{
    // 1) Validar destino y cliente principal
    $validated = $request->validate([
        'destino_id'           => 'required|exists:destinos,id',
        'cliente_principal_id' => 'required|exists:clientes,id',
    ]);

    // 2) Determinar tracto_id: último usado o aleatorio
    $userId    = $request->user()->id;
    $lastFlete = Flete::where(function($q) use ($userId) {
            $q->where('conductor_id', $userId)
              ->orWhere('colaborador_id', $userId);
        })
        ->whereNotNull('tracto_id')
        ->orderByDesc('created_at')
        ->first();
    $tractoId = $lastFlete
        ? $lastFlete->tracto_id
        : Tracto::inRandomOrder()->value('id');

    // 3) Crear flete con valores por defecto para estado, notificar y tipo
    $flete = Flete::create([
        'destino_id'           => $validated['destino_id'],
        'cliente_principal_id' => $validated['cliente_principal_id'],
        'tracto_id'            => $tractoId,
        'fecha_salida'         => now()->toDateString(),
        'estado'               => 'Activo',
        'notificar'            => false,
        'tipo'                 => 'Directo',
    ]);

    // 3bis) Asociar tarifa por defecto antes de crear rendición
    $tarifa = Tarifa::where('destino_id', $flete->destino_id)
                    ->where('tipo', $flete->tipo)
                    ->first();

    if ($tarifa) {
        $flete->tarifa_id = $tarifa->id;
        $flete->save();
    }

    // 4) Crear rendición asociada para permitir gastos, diesel, comisiones, etc.
    $rendicion = $flete->rendicion()->create([
        'user_id'           => $userId,
        'estado'            => 'Activo',
        'viatico_efectivo'  => 0,
        'viatico_calculado' => 0,
    ]);

    // ← Aquí nos aseguramos de recalcular los totales (incluida la comisión)
    $rendicion->recalcularTotales();
    $rendicion->save();

    // 5) Recargar el flete con su rendición y relaciones necesarias
    $flete->load([
        'clientePrincipal:id,razon_social',
        'conductor:id,name',
        'colaborador:id,name',
        'tracto:id,patente',
        'rampla:id,patente',
        'destino:id,nombre',
        'rendicion:id,flete_id,estado,viatico_efectivo,viatico_calculado,saldo,caja_flete,comision',
    ]);

    // 6) Responder igual que antes (JSON o redirect)
    if ($request->expectsJson()) {
        return response()->json([
            'message' => 'Flete “borrador” creado correctamente.',
            'flete'   => $flete,
        ], 201);
    }

    return redirect()
        ->route('fletes.index')
        ->with('success', 'Flete “borrador” creado correctamente.');
}



    public function finalizar(Request $request)
    {
        $validated = $request->validate([
            'flete_id'         => 'required|exists:fletes,id',
            'rendicion_id'     => 'required|exists:rendiciones,id',
            'fecha_termino'    => 'nullable|date',
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
        // Recalcular totales para asegurar que la comisión esté actualizada
        $flete->rendicion->recalcularTotales();
        $flete->rendicion->save();

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

public function updateTitular(Request $request, Flete $flete)
{
    $request->validate([
        'conductor_id'   => 'required_without:colaborador_id|nullable|exists:users,id',
        'colaborador_id' => 'required_without:conductor_id|nullable|exists:users,id',
    ]);

    $conductor   = $request->input('conductor_id');
    $colaborador = $request->input('colaborador_id');

    if ($conductor !== null) {
        $flete->update([
            'conductor_id'   => $conductor,
            'colaborador_id' => null,
        ]);
    } else {
        $flete->update([
            'conductor_id'   => null,
            'colaborador_id' => $colaborador,
        ]);
    }

    // Recalcular comisión tras cambiar titular
    if ($flete->rendicion) {
        $flete->rendicion->recalcularTotales();
        $flete->rendicion->save();
    }

    $flete->load(['conductor', 'colaborador', 'tracto', 'rampla', 'rendicion']);

    return response()->json([
        'flete' => $flete,
    ]);
}

public function updateTracto(Request $request, Flete $flete)
{
    $request->validate([
        'tracto_id' => 'nullable|exists:tractos,id',
    ]);

    $flete->update([
        'tracto_id' => $request->input('tracto_id'),
    ]);

    // Recalcular comisión tras cambiar tracto
    if ($flete->rendicion) {
        $flete->rendicion->recalcularTotales();
        $flete->rendicion->save();
    }

    $flete->load(['conductor', 'colaborador', 'tracto', 'rampla', 'rendicion']);

    return response()->json([
        'flete' => $flete,
    ]);
}

public function updateRampla(Request $request, Flete $flete)
{
    $request->validate([
        'rampla_id' => 'nullable|exists:ramplas,id',
    ]);

    $flete->update([
        'rampla_id' => $request->input('rampla_id'),
    ]);

    // Recalcular comisión tras cambiar rampla
    if ($flete->rendicion) {
        $flete->rendicion->recalcularTotales();
        $flete->rendicion->save();
    }

    $flete->load(['conductor', 'colaborador', 'tracto', 'rampla', 'rendicion']);

    return response()->json([
        'flete' => $flete,
    ]);
}

public function updateGuiaRuta(Request $request, Flete $flete)
{
    $request->validate([
        'guiaruta' => 'nullable|string|max:100',
    ]);

    $flete->update([
        'guiaruta' => $request->input('guiaruta'),
    ]);

    // Recalcular comisión tras cambiar guía/ruta
    if ($flete->rendicion) {
        $flete->rendicion->recalcularTotales();
        $flete->rendicion->save();
    }

    $flete->load(['conductor', 'colaborador', 'tracto', 'rampla', 'rendicion']);

    return response()->json([
        'flete' => $flete,
    ]);
}

public function updateFechaSalida(Request $request, Flete $flete)
{
    $request->validate([
        'fecha_salida' => 'required|date',
    ]);

    $flete->update([
        'fecha_salida' => $request->input('fecha_salida'),
    ]);

    // Recalcular comisión tras cambiar fecha de salida
    if ($flete->rendicion) {
        $flete->rendicion->recalcularTotales();
        $flete->rendicion->save();
    }

    $fresh = $flete->fresh()->load([
        'conductor',
        'clientePrincipal',
        'destino',
        'colaborador',
        'tracto',
        'rampla',
        'rendicion',
        'cliente',
        'destino',
    ]);

    return response()->json(['flete' => $fresh]);
}

public function update(Request $request, Flete $flete)
{
    $data = $request->validate([
        'conductor_id'    => 'nullable|exists:users,id',
        'colaborador_id'  => 'nullable|exists:users,id',
        'tracto_id'       => 'nullable|exists:tractos,id',
        'rampla_id'       => 'nullable|exists:ramplas,id',
        'guiaruta'        => 'nullable|string|max:50',
        'fecha_salida'    => 'nullable|date',
        'fecha_llegada'   => 'nullable|date',
        'tipo'            => 'nullable|in:Reparto,Directo',
    ]);

    // 1) Guardar cambios en el flete
    $flete->fill($data)->save();

    // 2) Recalcular y guardar la rendición si existe
    if ($flete->rendicion) {
        $flete->rendicion->recalcularTotales();
        $flete->rendicion->save();
    }

    // 3) Recargar el flete con todas las relaciones necesarias
    $flete = Flete::with([
        'clientePrincipal:id,razon_social',
        'conductor:id,name',
        'colaborador:id,name',
        'tracto:id,patente',
        'rampla:id,patente',
        'destino:id,nombre',
        'rendicion.abonos'  => fn($q) => $q->orderByDesc('created_at'),
        'rendicion.gastos'  => fn($q) => $q->orderByDesc('created_at'),
        'rendicion.diesels' => fn($q) => $q->orderByDesc('created_at'),
    ])->findOrFail($flete->id);

    // 4) Exponer campos calculados para la tarjeta
    $flete->makeVisible(['retorno']);
    $flete->rendicion->makeVisible([
        'saldo',
        'total_gastos',
        'total_diesel',
        'viatico_calculado',
        'comision',
    ]);

    // 5) Devolver el flete completo
    return response()->json([
        'flete' => $flete,
    ], 200);
}



    public function suggestTitulares()
    {
        $since = now()->subDays(45);

        // Conteo por conductor
        $drivers = DB::table('fletes')
            ->whereNotNull('conductor_id')
            ->where('updated_at', '>=', $since)
            ->groupBy('conductor_id')
            ->select('conductor_id as id', DB::raw('count(*) as cnt'));

        // Conteo por colaborador
        $collabs = DB::table('fletes')
            ->whereNotNull('colaborador_id')
            ->where('updated_at', '>=', $since)
            ->groupBy('colaborador_id')
            ->select('colaborador_id as id', DB::raw('count(*) as cnt'));

        // Unir y sumar
        $union = $drivers->unionAll($collabs);
        $topIds = DB::table(DB::raw("({$union->toSql()}) as stats"))
            ->mergeBindings($union)
            ->select('id', DB::raw('SUM(cnt) as total'))
            ->groupBy('id')
            ->orderByDesc('total')
            ->limit(10)
            ->pluck('id')
            ->toArray();

        // Traer los usuarios en ese orden
        $users = User::whereIn('id', $topIds)
            ->select('id', 'name')
            ->get()
            ->sortBy(fn($u) => array_search($u->id, $topIds))
            ->values();

        return response()->json(['suggestions' => $users]);
    }


}
