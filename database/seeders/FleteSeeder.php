<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Faker\Factory as Faker;
use Spatie\Permission\Models\Role;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Destino;
use App\Models\Tracto;
use App\Models\Rampla;
use App\Models\Tarifa;
use App\Models\Flete;
use App\Models\Rendicion;
use App\Models\Diesel;
use App\Models\Gasto;
use App\Models\AbonoCaja;
use App\Models\PagoMensualConductor;
use Database\Factories\ClienteFactory;
use Database\Factories\DestinoFactory;
use Database\Factories\TractoFactory;
use Database\Factories\RamplaFactory;

class FleteSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_CL');

        // 1) Roles + superadmin
        foreach (['superadmin','conductor','colaborador','cliente'] as $r) {
            Role::firstOrCreate(['name' => $r, 'guard_name' => 'web']);
        }
        User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name'              => 'Super Admin',
                'password'          => bcrypt('password'),
                'estado'            => 'Activo',
                'email_verified_at' => now(),
            ]
        )->syncRoles(['superadmin']);

        // 2) Crear 5 conductores y 5 colaboradores
        $conductores = User::factory()
            ->count(5)
            ->state(fn() => ['email_verified_at' => now()])
            ->create()
            ->each(fn(User $u) => $u->assignRole('conductor'));

        $colaboradores = User::factory()
            ->count(5)
            ->state(fn() => ['email_verified_at' => now()])
            ->create()
            ->each(fn(User $u) => $u->assignRole('colaborador'));

        // 3) Presets únicos: clientes, destinos, tractos, ramplas
        $clientes = Cliente::factory(ClienteFactory::PRESET_COUNT)->create();
        $destinos = Destino::factory(DestinoFactory::PRESET_COUNT)->create();
        $tractos  = Tracto::factory(TractoFactory::PRESET_COUNT)->create();
        $ramplas  = Rampla::factory(RamplaFactory::PRESET_COUNT)->create();

        // 4) Crear tarifas (cliente × destino × tipo)
        $tipos = ['Directo','Reparto'];
        foreach ($clientes as $cli) {
            foreach ($destinos as $des) {
                foreach ($tipos as $tp) {
                    Tarifa::firstOrCreate(
                        [
                            'cliente_principal_id' => $cli->id,
                            'destino_id'           => $des->id,
                            'tipo'                 => $tp,
                        ],
                        [
                            'valor_factura'  => $faker->numberBetween(80_000,300_000),
                            'valor_comision' => $faker->numberBetween(10_000,50_000),
                        ]
                    );
                }
            }
        }

        // 5) Generar 1.000 fletes + expendables + pagos mensuales
        $inicioAnio  = Carbon::create(now()->year,1,1);
        $diasPasados = now()->diffInDays($inicioAnio);
        $rendPagadas = collect();

        for ($i = 0; $i < 1000; $i++) {
            // actor: 20% colaborador / 80% conductor
            $actor    = rand(1,100) <= 20
                        ? $colaboradores->random()
                        : $conductores->random();
            $actorKey = $actor->hasRole('conductor')
                        ? 'conductor_id'
                        : 'colaborador_id';

            // relaciones
            $cli    = $clientes->random();
            $des    = $destinos->random();
            $tra    = $tractos->random();
            $ram    = $ramplas->random();
            $tp     = $faker->randomElement($tipos);
            $tarifa = Tarifa::where([
                         ['cliente_principal_id',$cli->id],
                         ['destino_id',$des->id],
                         ['tipo',$tp],
                     ])->first();

            // fechas
            $salida  = (clone $inicioAnio)->addDays(rand(0,$diasPasados-5));
            $llegada = (clone $salida)->addDays(rand(1,4));
            $periodo = ucfirst($llegada->monthName);

            // estados
            $estadoF = rand(0,1) ? 'Notificado' : 'Sin Notificar';
            $cerrado = $pagado = false;
            if ($llegada->month === 3 && rand(1,100) <= 30) {
                $cerrado = $pagado = true;
                $llegada->addDays(rand(10,20));
            }
            if ($llegada->gte(now()->setMonth(4)->setDay(30))) {
                $cerrado = $pagado = false;
            }

            // crear flete
            $flete = Flete::create([
                'cliente_principal_id' => $cli->id,
                'destino_id'           => $des->id,
                'tarifa_id'            => $tarifa->id,
                'tipo'                 => $tp,
                'estado'               => $estadoF,
                'fecha_salida'         => $salida,
                'fecha_llegada'        => $llegada,
                'kilometraje'          => $faker->numberBetween(100,1000),
                'rendimiento'          => $faker->randomFloat(1,3.0,7.0),
                'comision'             => $tarifa->valor_comision,
                'retorno'              => rand(0,1) ? $faker->numberBetween(10_000,50_000) : 0,
                'pagado'               => $pagado,
                'guiaruta'             => $faker->bothify('GR-#####'),
                'tracto_id'            => $tra->id,
                'rampla_id'            => $ram->id,
                'conductor_id'         => $actorKey === 'conductor_id' ? $actor->id : null,
                'colaborador_id'       => $actorKey === 'colaborador_id' ? $actor->id : null,
            ]);

            // crear rendición
            $rend = Rendicion::create([
                'flete_id'        => $flete->id,
                'user_id'         => $actor->id,
                'estado'          => $cerrado ? 'Cerrado' : 'Activo',
                'viatico_efectivo'=> 15_000 * max(1,$salida->diffInDays($llegada)),
                'caja_flete'      => 0,
                'comision'        => $tarifa->valor_comision,
                'pagado'          => $pagado,
                'periodo'         => $periodo,
            ]);

            // diesel
            foreach (range(1,rand(1,2)) as $_) {
                Diesel::create([
                    'flete_id'    => $flete->id,
                    'rendicion_id'=> $rend->id,
                    'user_id'     => $actor->id,
                    'litros'      => $faker->numberBetween(40,120),
                    'monto'       => $faker->numberBetween(80_000,140_000),
                    'metodo_pago' => $faker->randomElement(['Efectivo','Transferencia','Crédito']),
                ]);
            }

            // gastos
            foreach (range(1,rand(1,3)) as $_) {
                Gasto::create([
                    'flete_id'    => $flete->id,
                    'rendicion_id'=> $rend->id,
                    'user_id'     => $actor->id,
                    'tipo'        => $faker->randomElement(['Peaje','Carga','Estacionamiento']),
                    'descripcion' => $faker->words(3,true),
                    'monto'       => $faker->numberBetween(10_000,40_000),
                ]);
            }

            // abonos de caja
            foreach (range(1,rand(1,2)) as $_) {
                AbonoCaja::create([
                    'rendicion_id'=> $rend->id,
                    'monto'       => $faker->numberBetween(30_000,70_000),
                    'metodo'      => $faker->randomElement(['Efectivo','Transferencia']),
                ]);
            }

            if ($pagado) {
                $rendPagadas->push($rend);
            }
        }

        // 6) Pagos mensuales
        $porPeriodo = $rendPagadas->groupBy(fn($r) => $r->user_id.'-'.$r->periodo);
        foreach ($porPeriodo as $key => $col) {
            [$uid, $per] = explode('-', $key);
            PagoMensualConductor::create([
                'conductor_id'   => $uid,
                'periodo'        => $per,
                'total_comision' => $col->sum('comision'),
                'total_saldo'    => $col->sum(fn($r) => $r->flete->saldo ?? 0),
                'fecha_pago'     => Carbon::now()->setDay(rand(20,25)),
            ]);
        }

        $this->command->info("✅ Seed completo con todo en FleteSeeder.");
    }
}
