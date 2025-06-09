<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Cliente;
use App\Models\Destino;
use App\Models\Flete;
use App\Models\Rampla;
use App\Models\Rendicion;
use App\Models\Tarifa;
use App\Models\Tracto;
use App\Models\Diesel;
use App\Models\Gasto;
use App\Models\AbonoCaja;
use App\Models\PagoMensualConductor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Spatie\Permission\Models\Role;

class FleteSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create('es_CL');

        // ─── Crear roles base ───────────────────────────
        foreach (['superadmin', 'conductor', 'cliente', 'colaborador'] as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // ─── Crear o obtener superadmin ─────────────────
        $super = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
                'estado' => 'Activo',
                'email_verified_at' => now(),
            ]
        );
        $super->syncRoles(['superadmin']);

        // ─── Crear usuarios de cada rol si no existen ──
        User::factory()->count(5)->afterCreating(function ($user) {
            $user->assignRole('conductor');
        })->create();

        User::factory()->count(5)->afterCreating(function ($user) {
            $user->assignRole('colaborador');
        })->create();

        User::factory()->count(5)->afterCreating(function ($user) {
            $user->assignRole('cliente');
        })->create();

        // ─── Crear modelos únicos según factories ──────
        Cliente::factory()->count(11)->create();
        Destino::factory()->count(11)->create();
        Tracto::factory()->count(7)->create();
        Rampla::factory()->count(11)->create();

        // ─── Recuperar para reutilizar ─────────────────
        $clientes = Cliente::all();
        $destinos = Destino::all();
        $tractos  = Tracto::all();
        $ramplas  = Rampla::all();
        $conductores = User::role('conductor')->get();
        $colaboradores = User::role('colaborador')->get();

        if ($clientes->isEmpty() || $destinos->isEmpty() || $tractos->isEmpty() || $ramplas->isEmpty()) {
            $this->command->error('Faltan clientes, destinos, tractos o ramplas.');
            return;
        }

        // ─── Crear Tarifas ─────────────────────────────
        foreach ($clientes as $cliente) {
            foreach ($destinos as $destino) {
                foreach (['Directo', 'Reparto'] as $tipo) {
                    Tarifa::firstOrCreate([
                        'cliente_principal_id' => $cliente->id,
                        'destino_id' => $destino->id,
                        'tipo' => $tipo,
                    ], [
                        'valor_factura' => 100_000,
                        'valor_comision' => 10_000,
                    ]);
                }
            }
        }

        // ─── Generar Fletes y Rendiciones ─────────────
        $startOfYear = Carbon::create(date('Y'), 1, 1);
        $hoy = now();
        $diasTotales = $hoy->diffInDays($startOfYear);
        $rendicionesPagadas = collect();

        for ($i = 0; $i < 1000; $i++) {
            $cliente = $clientes->random();
            $actor = rand(1, 100) <= 20 ? $colaboradores->random() : $conductores->random();
            $actorKey = $actor->hasRole('conductor') ? 'conductor_id' : 'colaborador_id';

            $destino = $destinos->random();
            $tracto = $tractos->random();
            $rampla = $ramplas->random();
            $tipo = $faker->randomElement(['Directo', 'Reparto']);

            $tarifa = Tarifa::where([
                ['cliente_principal_id', $cliente->id],
                ['destino_id', $destino->id],
                ['tipo', $tipo],
            ])->first();

            $fechaSalida = (clone $startOfYear)->addDays(rand(0, $diasTotales - 5));
            $fechaLlegada = (clone $fechaSalida)->addDays(rand(1, 4));
            $periodo = ucfirst($fechaLlegada->monthName);
            $estadoFlete = rand(1, 100) <= 50 ? 'Sin Notificar' : 'Notificado';

            $cerrado = false;
            $pagado = false;
            if ($fechaLlegada->month === 3 && rand(1, 100) <= 30) {
                $cerrado = true;
                $pagado = true;
                $fechaLlegada->addDays(rand(10, 20));
            }

            if ($fechaLlegada->greaterThanOrEqualTo(Carbon::create(date('Y'), 4, 30))) {
                $cerrado = false;
                $pagado = false;
            }

            $dias = max(1, $fechaSalida->diffInDays($fechaLlegada));
            $viatico = 15_000 * $dias;
            $comision = $tarifa->valor_comision;
            $retorno = rand(0, 1) ? rand(10_000, 50_000) : 0;

            $flete = Flete::create([
                'cliente_principal_id' => $cliente->id,
                'destino_id' => $destino->id,
                'tarifa_id' => $tarifa->id,
                'tipo' => $tipo,
                'estado' => $estadoFlete,
                'fecha_salida' => $fechaSalida,
                'fecha_llegada' => $fechaLlegada,
                'kilometraje' => rand(100, 1000),
                'rendimiento' => rand(30, 70) / 10,
                'comision' => $comision,
                'retorno' => $retorno,
                'pagado' => $pagado,
                'guiaruta' => $faker->numerify('GR-#####'),
                'tracto_id' => $tracto->id,
                'rampla_id' => $rampla->id,
                $actorKey => $actor->id,
            ]);

            $rend = Rendicion::create([
                'flete_id' => $flete->id,
                'user_id' => $actor->id,
                'estado' => $cerrado ? 'Cerrado' : 'Activo',
                'viatico_efectivo' => $viatico,
                'caja_flete' => 0,
                'comision' => $comision,
                'pagado' => $pagado,
                'periodo' => $periodo,
            ]);

            foreach (range(1, rand(1, 2)) as $_) {
                Diesel::create([
                    'flete_id' => $flete->id,
                    'rendicion_id' => $rend->id,
                    'user_id' => $actor->id,
                    'litros' => rand(40, 120),
                    'monto' => rand(80_000, 140_000),
                    'metodo_pago' => $faker->randomElement(['Efectivo', 'Transferencia', 'Crédito']),
                ]);
            }

            foreach (range(1, rand(1, 3)) as $_) {
                Gasto::create([
                    'flete_id' => $flete->id,
                    'rendicion_id' => $rend->id,
                    'user_id' => $actor->id,
                    'tipo' => $faker->randomElement(['Peaje', 'Carga', 'Estacionamiento']),
                    'descripcion' => $faker->words(3, true),
                    'monto' => rand(10_000, 40_000),
                ]);
            }

            foreach (range(1, rand(1, 2)) as $_) {
                AbonoCaja::create([
                    'rendicion_id' => $rend->id,
                    'monto' => rand(30_000, 70_000),
                    'metodo' => $faker->randomElement(['Efectivo', 'Transferencia']),
                ]);
            }

            if ($pagado) {
                $rendicionesPagadas->push($rend);
            }
        }

        // ─── Pagos Mensuales ──────────────────────────
        $grouped = $rendicionesPagadas->groupBy(fn($r) => $r->user_id . '-' . $r->periodo);

        foreach ($grouped as $key => $rendiciones) {
            [$user_id, $periodo] = explode('-', $key);

            PagoMensualConductor::create([
                'conductor_id' => $user_id,
                'periodo' => $periodo,
                'total_comision' => $rendiciones->sum('comision'),
                'total_saldo' => $rendiciones->sum(fn($r) => $r->flete->saldo ?? 0),
                'fecha_pago' => Carbon::createFromDate(date('Y'), date('n'), rand(20, 25)),
            ]);
        }
    }
}
