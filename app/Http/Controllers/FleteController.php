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
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FleteController extends Controller
{
    // En tu FleteController.php

public function index(Request $request)
{
    $user = Auth::user();

    // 1) Recogemos filtros para enviarlos de vuelta a la vista
    $filters = [
        'conductor_ids'    => array_filter((array) $request->input('conductor_ids')),
        'colaborador_ids'  => array_filter((array) $request->input('colaborador_ids')),
        'cliente_ids'      => array_filter((array) $request->input('cliente_ids')),
        'tracto_ids'       => array_filter((array) $request->input('tracto_ids')),
        'destino_ids'      => array_filter((array) $request->input('destino_ids')),
        'fecha_desde'      => $request->input('fecha_desde'),
        'fecha_hasta'      => $request->input('fecha_hasta'),
        'rendicion_estado' => $request->input('rendicion_estado'),
        'notificar_estado' => $request->input('notificar_estado'),
    ];

    // 2) Meses para el filtro por periodo
    $meses = [
        'Enero'      => 1,  'Febrero'   => 2,  'Marzo'      => 3,  'Abril'    => 4,
        'Mayo'       => 5,  'Junio'     => 6,  'Julio'      => 7,  'Agosto'   => 8,
        'Septiembre' => 9,  'Octubre'   => 10, 'Noviembre'  => 11, 'Diciembre'=> 12,
    ];

    // 3) Construcción de la consulta principal
    $query = Flete::query()
        ->leftJoin('tarifas',    'tarifas.id',      '=', 'fletes.tarifa_id')
        ->leftJoin('rendiciones','rendiciones.flete_id', '=', 'fletes.id')
        ->select([
            'fletes.id',
            'fletes.id as viaje_numero',
            'fletes.destino_id',
            'fletes.cliente_principal_id',
            'fletes.conductor_id',
            'fletes.colaborador_id',
            'fletes.tracto_id',
            'fletes.rampla_id',
            'fletes.fecha_salida',
            'fletes.fecha_llegada',
            'fletes.estado',
            'fletes.pagado',
            'fletes.retorno',
            'fletes.guiaruta',
            'fletes.tarifa_id',
            'fletes.comision',
            'fletes.kilometraje',
            DB::raw('
              COALESCE(tarifas.valor_comision,0)
            + COALESCE(rendiciones.comision,0)
              as comision_total
            '),
        ])
        ->with([
            'clientePrincipal:id,razon_social',
            'conductor:id,name',
            'colaborador:id,name',
            'tracto:id,patente',
            'rampla:id,patente',
            'destino:id,nombre',
            'rendicion.gastos'      => fn($q) => $q
                ->select(['id','rendicion_id','tipo','descripcion','monto','created_at'])
                ->orderByDesc('created_at'),
            'rendicion.diesels'     => fn($q) => $q
                ->select(['id','rendicion_id','litros','metodo_pago','monto','created_at'])
                ->orderByDesc('created_at'),
            'rendicion.abonos'      => fn($q) => $q
                ->select(['id','rendicion_id','metodo','monto','created_at'])
                ->orderByDesc('created_at'),
            'rendicion.adicionales' => fn($q) => $q
                ->select(['id','rendicion_id','tipo','descripcion','monto','created_at'])
                ->orderByDesc('created_at'),
        ])
        // filtros: prefix de columnas ambiguas con 'fletes.'
        ->when(
            (! empty($filters['conductor_ids']) || ! empty($filters['colaborador_ids'])),
            fn($q) => $q->where(function($sub) use ($filters) {
                if (! empty($filters['conductor_ids'])) {
                    $sub->whereIn('fletes.conductor_id', $filters['conductor_ids']);
                }
                if (! empty($filters['colaborador_ids'])) {
                    $sub->orWhereIn('fletes.colaborador_id', $filters['colaborador_ids']);
                }
            })
        )
        ->when(
            ! empty($filters['cliente_ids']),
            fn($q) => $q->whereIn('fletes.cliente_principal_id', $filters['cliente_ids'])
        )
        ->when(
            ! empty($filters['tracto_ids']),
            fn($q) => $q->whereIn('fletes.tracto_id', $filters['tracto_ids'])
        )
        ->when(
            $request->filled('periodo'),
            fn($q) => $q->whereMonth('fletes.fecha_salida', $meses[$request->periodo] ?? 0)
        )
        ->when(
            $filters['fecha_desde'] && $filters['fecha_hasta'],
            fn($q) => $q
                ->whereDate('fletes.fecha_salida', '>=', $filters['fecha_desde'])
                ->whereDate('fletes.fecha_salida', '<=', $filters['fecha_hasta'])
        )
        ->when(
            $filters['fecha_desde'] && ! $filters['fecha_hasta'],
            fn($q) => $q->whereDate('fletes.fecha_salida', '>=', $filters['fecha_desde'])
        )
        ->when(
            ! $filters['fecha_desde'] && $filters['fecha_hasta'],
            fn($q) => $q->whereDate('fletes.fecha_salida', '<=', $filters['fecha_hasta'])
        )
        ->when(
            ! empty($filters['destino_ids']),
            fn($q) => $q->whereIn('fletes.destino_id', $filters['destino_ids'])
        )
        ->when(
            $filters['rendicion_estado'],
            fn($q) => $q->whereHas('rendicion', fn($q2) =>
                $q2->where('estado', $filters['rendicion_estado'])
            )
        )
        ->when(
            $filters['notificar_estado'],
            fn($q) => $q->where('fletes.estado', $filters['notificar_estado'])
        )
        ->orderBy('fletes.fecha_salida', 'desc');

    // 4) Paginación
    $fletes = $query->paginate(48)->appends($filters);

    // 5) Renderizado Inertia
    return Inertia::render('Fletes/Index', [
        'fletes'        => $fletes,
        'filters'       => $filters,
        'conductores'   => User::role('conductor')->orderBy('name')->get(['id','name']),
        'colaboradores' => User::role('colaborador')->orderBy('name')->get(['id','name']),
        'clientes'      => Cliente::orderBy('razon_social')->get(['id','razon_social']),
        'tractos'       => Tracto::select('id','patente')->get(),
        'destinos'      => Destino::orderBy('nombre')->select('id','nombre')->get(),
        'ramplas'       => Rampla::select('id','patente')->get(),
        'auth'          => [
            'user'  => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ],
    ]);
}


public function show(Flete $flete): JsonResponse
{
    // 1) Cargamos relaciones necesarias
    $flete = Flete::with([
        'clientePrincipal:id,razon_social',
        'conductor:id,name',
        'colaborador:id,name',
        'tracto:id,patente',                // <-- cargamos patente
        'rampla:id,patente',
        'destino:id,nombre',
        'tarifa:id,valor_comision',
        'rendicion.abonos'      => fn($q) => $q->orderByDesc('created_at'),
        'rendicion.gastos'      => fn($q) => $q->orderByDesc('created_at'),
        'rendicion.diesels'     => fn($q) => $q->orderByDesc('created_at'),
        'rendicion.adicionales' => fn($q) => $q->orderByDesc('created_at'),
    ])->findOrFail($flete->id);

    if ($flete->rendicion) {
        // 2) Recalcular totales de la rendición
        $flete->rendicion->recalcularTotales();
        $flete->rendicion->save();

        // 3) Actualizar la comisión total de Flete = tarifa + comisión manual
        $flete->comision =
            ($flete->tarifa?->valor_comision ?? 0)
          + ($flete->rendicion->comision   ?? 0);
        $flete->save();

        // 4) Exponer los campos calculados
        $flete->makeVisible(['retorno']);
        $flete->rendicion->makeVisible([
            'saldo',
            'total_gastos',
            'total_diesel',
            'viatico_calculado',
            'comision',
        ]);
    }

    return response()->json(['flete' => $flete], 200);
}

public function updateKilometraje(Request $request, Flete $flete)
{
    $data = $request->validate([
      'kilometraje' => 'required|numeric|min:0',
    ]);

    // 1) Guardar en el Flete
    $flete->kilometraje = $data['kilometraje'];
    $flete->save();

    // 2) Si el Flete tiene un tracto, actualizar también su odómetro
    if ($flete->tracto) {
        $tracto = $flete->tracto;
        $tracto->kilometraje = $data['kilometraje'];
        $tracto->save();
    }

    // 3) Devolver el Flete recargado con su relación tracto
    $flete->load('tracto');

    return response()->json([
      'message' => 'Kilometraje actualizado en flete y tracto',
      'flete'   => $flete,
    ]);
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


public function store(Request $request)
{
    // 1) Validar destino, cliente y opcionales (tarifa_id ahora es nullable)
    $validated = $request->validate([
        'destino_id'           => 'required|exists:destinos,id',
        'cliente_principal_id' => 'required|exists:clientes,id',
        'conductor_id'         => 'nullable|exists:users,id',
        'colaborador_id'       => 'nullable|exists:users,id',
        'tracto_id'            => 'nullable|exists:tractos,id',

        // tarifa_id ahora opcional
        'tarifa_id'            => 'nullable|exists:tarifas,id',
        'comision_retorno'     => 'nullable|numeric|min:0',
    ]);

    // 2) Extraer user_id del cliente principal
    $clienteModel = Cliente::findOrFail($validated['cliente_principal_id']);
    $userId       = $clienteModel->user_id;

    // 3) Determinar tracto si no viene en la petición
    $tractoId = $validated['tracto_id']
        ?? Flete::where(function($q) use ($userId) {
                $q->where('conductor_id', $userId)
                  ->orWhere('colaborador_id', $userId);
            })
            ->whereNotNull('tracto_id')
            ->orderByDesc('created_at')
            ->value('tracto_id')
        ?? Tracto::inRandomOrder()->value('id');

    // 4) Crear flete con tarifa_id si se envió
    $fleteData = [
        'destino_id'           => $validated['destino_id'],
        'cliente_principal_id' => $validated['cliente_principal_id'],
        'conductor_id'         => $validated['conductor_id']   ?? null,
        'colaborador_id'       => $validated['colaborador_id'] ?? null,
        'tracto_id'            => $tractoId,
        'fecha_salida'         => now()->toDateString(),
        'estado'               => 'Sin Notificar',
        'notificar'            => false,
        'tipo'                 => 'Directo',
    ];

    if (! empty($validated['tarifa_id'])) {
        $fleteData['tarifa_id'] = $validated['tarifa_id'];
    }

    $flete = Flete::create($fleteData);

    // 4bis) Asociar tarifa por defecto si no se envió ninguna
    if (empty($validated['tarifa_id'])
        && $tarifa = Tarifa::where('destino_id', $flete->destino_id)
                           ->where('tipo', $flete->tipo)
                           ->first()
    ) {
        $flete->tarifa_id = $tarifa->id;
        $flete->save();
    }

    // 5) Crear rendición inicial con la comisión de retorno “manual”
    $rendicion = $flete->rendicion()->create([
        'user_id'           => $userId,
        'estado'            => 'Activo',
        'viatico_efectivo'  => 0,
        'viatico_calculado' => 0,
        'comision'          => $validated['comision_retorno'] ?? 0,
    ]);

    // 6) Recalcular totales y guardar mensaje
    if ($mensaje = $rendicion->recalcularTotales()) {
        session()->flash('info', $mensaje);
        $rendicion->save();
    }

    // 7) Recargar relaciones
    $flete->load([
        'clientePrincipal:id,razon_social',
        'conductor:id,name',
        'colaborador:id,name',
        'tracto:id,patente',
        'rampla:id,patente',
        'destino:id,nombre',
        'tarifa:id,valor_comision',
        'rendicion:id,flete_id,estado,viatico_efectivo,viatico_calculado,saldo,caja_flete,comision',
    ]);

    // 8) Responder JSON o redirect
    if ($request->expectsJson()) {
        // antes de devolver, llamamos a show() para recálculo completo y sincronización
        return $this->show($flete);
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

    // 1) Cargar los modelos
    $flete     = Flete::findOrFail($validated['flete_id']);
    $rendicion = Rendicion::with([
        'abonos',
        'diesels',
        'gastos',
        'adicionales',
    ])->findOrFail($validated['rendicion_id']);

    // 2) Alternar estado y, al cerrar, actualizar fecha_llegada
    if (! empty($validated['fecha_termino'])) {
        $flete->update(['fecha_llegada' => $validated['fecha_termino']]);
        $rendicion->estado = 'Cerrado';
    } else {
        $rendicion->estado = 'Activo';
    }

    // 3) Ajustar viático si viene en el request
    if (isset($validated['viatico_efectivo'])) {
        $rendicion->viatico_efectivo  = $validated['viatico_efectivo'];
        $rendicion->viatico_calculado = $validated['viatico_efectivo'];
    }

    // 4) Recalcular totales y guardar
    $rendicion->recalcularTotales();
    $rendicion->save();

    // 5) Refrescar Flete con todas sus relaciones para la UI
    $fresh = $flete
        ->fresh()
        ->load([
            // Relaciones de cabecera de Flete
            'clientePrincipal:id,razon_social',
            'cliente:id,razon_social',
            'conductor:id,name',
            'colaborador:id,name',
            'destino:id,nombre',
            'tracto:id,patente',
            'rampla:id,patente',

            // Relación singular de Retorno en Flete
            'retorno:id,flete_id,valor,descripcion,created_at',

            // Rendición y sus sub-relaciones
            'rendicion',
            'rendicion.abonos'      => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.diesels'     => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.gastos'      => fn($q) => $q->orderByDesc('created_at'),
            'rendicion.adicionales' => fn($q) => $q->orderByDesc('created_at'),
        ])
        ->makeVisible([
            // Campos de Flete que usa tu UI
            'fecha_salida',
            'fecha_llegada',
            'guiaruta',
            // Campos calculados de Rendición
            'rendicion.saldo',
            'rendicion.saldo_temporal',
            'rendicion.viatico_calculado',
            'rendicion.comision',
            'rendicion.total_gastos',
            'rendicion.total_diesel',
        ]);

    return response()->json([
        'message' => 'Flete actualizado correctamente.',
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
    // 1) Validar
    $data = $request->validate([
        'fecha_salida' => [
            'required',
            'date',
            function($attribute, $value, $fail) use ($flete) {
                if ($flete->fecha_llegada && $value > $flete->fecha_llegada) {
                    $fail('La fecha de salida no puede ser posterior a la fecha de llegada.');
                }
            },
        ],
    ]);

    // 2) Actualizar solo la salida
    $flete->update(['fecha_salida' => $data['fecha_salida']]);

    // 3) Recalcular totales si ya existe rendición
    if ($flete->rendicion) {
        $flete->rendicion->recalcularTotales();
        $flete->rendicion->save();
    }

    // 4) Recargar el flete con todas las relaciones y campos necesarios,
    //    incluyendo tanto clientePrincipal como cliente
    $fresh = $flete->fresh()->load([
        'clientePrincipal:id,razon_social',
        'cliente:id,razon_social',
        'conductor:id,name',
        'colaborador:id,name',
        'tracto:id,patente',
        'rampla:id,patente',
        'destino:id,nombre',
        'rendicion.abonos'  => fn($q) => $q->orderByDesc('created_at'),
        'rendicion.gastos'  => fn($q) => $q->orderByDesc('created_at'),
        'rendicion.diesels' => fn($q) => $q->orderByDesc('created_at'),
    ]);

    // 5) Exponer campos calculados
    $fresh->makeVisible(['retorno']);
    if ($fresh->rendicion) {
        $fresh->rendicion->makeVisible([
            'saldo',
            'total_gastos',
            'total_diesel',
            'viatico_calculado',
            'comision',
        ]);
    }

    // 6) Devolver JSON con el flete completo
    return response()->json([
        'message' => 'Fecha de salida actualizada.',
        'flete'   => $fresh,
    ], 200);
}

public function updateFechaLlegada(Request $request, Flete $flete)
{
    // 1) Validar
    $data = $request->validate([
        'fecha_llegada' => 'required|date',
    ]);

    // 2) Actualizar solo la llegada
    $flete->update(['fecha_llegada' => $data['fecha_llegada']]);

    // 3) Recalcular totales si ya existe rendición
    if ($flete->rendicion) {
        $flete->rendicion->recalcularTotales();
        $flete->rendicion->save();
    }

    // 4) Recargar con mismas relaciones, incluyendo cliente
    $fresh = $flete->fresh()->load([
        'clientePrincipal:id,razon_social',
        'cliente:id,razon_social',
        'conductor:id,name',
        'colaborador:id,name',
        'tracto:id,patente',
        'rampla:id,patente',
        'destino:id,nombre',
        'rendicion.abonos'  => fn($q) => $q->orderByDesc('created_at'),
        'rendicion.gastos'  => fn($q) => $q->orderByDesc('created_at'),
        'rendicion.diesels' => fn($q) => $q->orderByDesc('created_at'),
    ]);

    // 5) Exponer campos calculados
    $fresh->makeVisible(['retorno']);
    if ($fresh->rendicion) {
        $fresh->rendicion->makeVisible([
            'saldo',
            'total_gastos',
            'total_diesel',
            'viatico_calculado',
            'comision',
        ]);
    }

    // 6) Devolver JSON con el flete completo
    return response()->json([
        'message' => 'Fecha de llegada actualizada.',
        'flete'   => $fresh,
    ], 200);
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
