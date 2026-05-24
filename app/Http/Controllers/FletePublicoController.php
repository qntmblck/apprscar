<?php

namespace App\Http\Controllers;

use App\Models\Flete;
use App\Models\Rendicion;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FletePublicoController extends Controller
{
    /**
     * Genera (o devuelve) el token público del flete y retorna info para compartir.
     */
    public function generarToken(Flete $flete)
    {
        if (!$flete->public_token) {
            $flete->update(['public_token' => Str::random(48)]);
        }

        $url = route('flete.publico', ['token' => $flete->public_token]);

        return response()->json([
            'url'   => $url,
            'token' => $flete->public_token,
        ]);
    }

    /**
     * Vista pública del flete — sin login requerido.
     */
    public function show(string $token): Response
    {
        $flete = Flete::where('public_token', $token)
            ->with([
                'destino:id,nombre',
                'clientePrincipal:id,razon_social',
                'conductor:id,name,email',
                'tracto:id,patente',
                'rampla:id,patente',
                'tarifa:id,valor_comision',
                'rendicion:id,flete_id,estado,saldo,viatico_calculado,viatico_efectivo,comision,observaciones,updated_at',
                'rendicion.gastos:id,rendicion_id,tipo,descripcion,monto',
                'rendicion.diesels:id,rendicion_id,litros,metodo_pago,monto',
                'rendicion.abonos:id,rendicion_id,metodo,monto',
                'retorno:id,flete_id,valor,descripcion',
            ])
            ->firstOrFail();

        if ($flete->rendicion) {
            $flete->rendicion->makeVisible([
                'saldo', 'total_gastos', 'total_diesel', 'viatico_calculado', 'comision', 'observaciones',
            ]);
        }

        $flete->comision_total = ($flete->tarifa?->valor_comision ?? 0)
                               + ($flete->retorno?->valor ?? 0);

        return Inertia::render('Publico/FleteRendicion', [
            'flete' => $flete,
            'token' => $token,
        ]);
    }

    /**
     * Actualizar rendición pública — guarda gastos/diesel/abono/retorno sin finalizar.
     * Se usa el mismo token para identificar el flete.
     */
    public function actualizarRendicion(Request $request, string $token)
    {
        $flete = Flete::where('public_token', $token)->firstOrFail();

        // Solo editable si está En curso
        abort_if(!in_array($flete->estado, ['En curso']), 422, 'Este flete no está en curso.');

        // Crear rendicion si no existe
        if (!$flete->rendicion) {
            Rendicion::create([
                'flete_id' => $flete->id,
                'estado'   => 'Abierta',
                'saldo'    => 0,
            ]);
            $flete->refresh();
        }

        $rendicion = $flete->rendicion;

        // Agregar gasto
        if ($request->has('gasto')) {
            $v = $request->validate(['gasto.tipo' => 'required|string', 'gasto.monto' => 'required|numeric|min:0', 'gasto.descripcion' => 'nullable|string']);
            $rendicion->gastos()->create($v['gasto']);
        }

        // Agregar diesel
        if ($request->has('diesel')) {
            $v = $request->validate(['diesel.litros' => 'nullable|numeric', 'diesel.monto' => 'required|numeric|min:0', 'diesel.metodo_pago' => 'required|string']);
            $rendicion->diesels()->create($v['diesel']);
        }

        // Agregar abono
        if ($request->has('abono')) {
            $v = $request->validate(['abono.metodo' => 'required|string', 'abono.monto' => 'required|numeric|min:0']);
            $rendicion->abonos()->create($v['abono']);
        }

        // Retorno
        if ($request->has('retorno')) {
            $v = $request->validate(['retorno.valor' => 'required|numeric|min:0', 'retorno.descripcion' => 'nullable|string']);
            $flete->retorno()->updateOrCreate(['flete_id' => $flete->id], $v['retorno']);
        }

        $rendicion->recalcularTotales();
        $flete->refresh()->load([
            'rendicion.gastos', 'rendicion.diesels', 'rendicion.abonos', 'retorno',
        ]);

        return response()->json(['ok' => true, 'flete' => $flete]);
    }

    /**
     * Finalizar rendición pública — marca el flete como Rendido.
     */
    public function finalizarRendicion(Request $request, string $token)
    {
        $flete = Flete::where('public_token', $token)->firstOrFail();

        abort_if($flete->estado !== 'En curso', 422, 'Este flete no está en curso.');

        // Validar campos mínimos
        $faltantes = [];
        if (!$flete->destino_id)            $faltantes[] = 'Destino';
        if (!$flete->cliente_principal_id)  $faltantes[] = 'Cliente';
        if (!$flete->tracto_id)             $faltantes[] = 'Tracto';
        if (!$flete->rampla_id)             $faltantes[] = 'Rampla';
        if (!$flete->guiaruta)              $faltantes[] = 'Guía de ruta';
        if (!$flete->fecha_salida)          $faltantes[] = 'Fecha salida';
        if (!$flete->fecha_llegada)         $faltantes[] = 'Fecha llegada';

        if ($faltantes) {
            return response()->json(['error' => 'Faltan campos: ' . implode(', ', $faltantes)], 422);
        }

        // KM obligatorio
        $request->validate(['kilometraje' => 'required|integer|min:1']);
        $flete->update(['kilometraje' => (int) $request->kilometraje]);

        // Cerrar rendicion
        if ($flete->rendicion) {
            $flete->rendicion->update(['estado' => 'Cerrado']);
            $flete->rendicion->recalcularTotales();
        }

        $flete->update(['estado' => 'Rendido']);

        return response()->json(['ok' => true, 'estado' => 'Rendido']);
    }

    /**
     * Eliminar un item de rendición por tipo e id.
     */
    public function eliminarItem(Request $request, string $token)
    {
        $flete = Flete::where('public_token', $token)->firstOrFail();
        abort_if($flete->estado !== 'En curso', 422, 'Solo editable en curso.');

        $v = $request->validate(['tipo' => 'required|in:gasto,diesel,abono,retorno', 'id' => 'required|integer']);

        $rendicion = $flete->rendicion;
        if (!$rendicion) return response()->json(['ok' => true]);

        match ($v['tipo']) {
            'gasto'  => $rendicion->gastos()->where('id', $v['id'])->delete(),
            'diesel' => $rendicion->diesels()->where('id', $v['id'])->delete(),
            'abono'  => $rendicion->abonos()->where('id', $v['id'])->delete(),
            'retorno'=> $flete->retorno()->delete(),
        };

        $rendicion->recalcularTotales();
        $flete->refresh()->load(['rendicion.gastos', 'rendicion.diesels', 'rendicion.abonos', 'retorno']);

        return response()->json(['ok' => true, 'flete' => $flete]);
    }
}
