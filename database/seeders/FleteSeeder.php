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
use App\Models\Adicional;
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
        foreach (['superadmin','conductor','colaborador','cliente','admin'] as $r) {
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
                            'valor_factura'  => $faker->numberBetween(80000,300000),
                            'valor_comision' => $faker->numberBetween(10000,50000),
                        ]
                    );
                }
            }
        }

        // 5) Generar 1000 fletes + expendables + adicionales (Ene–Jun 2025)
        $inicioPeriodo = Carbon::create(2025, 7, 1);
        $finPeriodo    = Carbon::create(2025, 12, 30);
        $diasPeriodo   = $finPeriodo->diffInDays($inicioPeriodo);

        for ($i = 0; $i < 1000; $i++) {
            // Actor: 20% colaboradores, 80% conductores
            if (rand(1, 100) <= 20) {
                $actor    = $colaboradores->random();
                $actorKey = 'colaborador_id';
            } else {
                $actor    = $conductores->random();
                $actorKey = 'conductor_id';
            }

            // Relaciones aleatorias
            $cli = $clientes->random();
            $des = $destinos->random();
            $tra = $tractos->random();
            $ram = $ramplas->random();
            $tp  = $faker->randomElement($tipos);

            // Obtener tarifa
            $tarifa = Tarifa::where([
                ['cliente_principal_id', $cli->id],
                ['destino_id',           $des->id],
                ['tipo',                 $tp],
            ])->first();

            // Kilometraje (ida y vuelta)
            $kmdest = $des->km_destino ?? 0;
            $km     = $kmdest * 2;

            // Fechas: salida aleatoria entre inicio y fin
            $salida  = (clone $inicioPeriodo)->addDays(rand(0, $diasPeriodo));
            // Llegada a 0–5 días después de la salida
            $llegada = (clone $salida)->addDays(rand(0, 5));
            if ($llegada->gt($finPeriodo)) {
                $llegada = $finPeriodo->copy();
            }

            // Crear flete con estado "Sin Notificar" siempre
            $flete = Flete::create([
                'cliente_principal_id' => $cli->id,
                'destino_id'           => $des->id,
                'tarifa_id'            => $tarifa->id,
                'tipo'                 => $tp,
                'estado'               => 'Sin Notificar',
                'fecha_salida'         => $salida,
                'fecha_llegada'        => $llegada,
                'kilometraje'          => $km,
                'rendimiento'          => $faker->randomFloat(1,3.0,7.0),
                'comision'             => $tarifa->valor_comision,
                'retorno'              => rand(0,1) ? $faker->numberBetween(10000,50000) : 0,
                'pagado'               => $llegada->month <= 3,
                'guiaruta'             => $faker->bothify('GR-??-####'),
                'tracto_id'            => $tra->id,
                'rampla_id'            => $ram->id,
                'conductor_id'         => $actorKey === 'conductor_id' ? $actor->id : null,
                'colaborador_id'       => $actorKey === 'colaborador_id' ? $actor->id : null,
            ]);

            // Actualizar kms
            $tra->increment('kilometraje', $km);
            $ram->increment('kilometraje', $km);

            // Crear rendición siempre con estado "Activo"
            $rend = Rendicion::create([
                'flete_id'         => $flete->id,
                'user_id'          => $actor->id,
                'estado'           => 'Activo',
                'caja_flete'       => 0,
                'viatico_efectivo' => 15000 * max(1, $salida->diffInDays($llegada)),
                'viatico_calculado'=> 0,
                'saldo'            => 0,
                'comision'         => $tarifa->valor_comision,
            ]);

            // Expendables: diesel, gastos y abonos
            foreach (range(1, rand(1,2)) as $_) {
                Diesel::create([
                    'flete_id'     => $flete->id,
                    'rendicion_id' => $rend->id,
                    'user_id'      => $actor->id,
                    'litros'       => $faker->numberBetween(40,120),
                    'monto'        => $faker->numberBetween(80000,140000),
                    'metodo_pago'  => $faker->randomElement(['Efectivo','Transferencia','Crédito']),
                ]);
            }
            foreach (range(1, rand(1,3)) as $_) {
                Gasto::create([
                    'flete_id'     => $flete->id,
                    'rendicion_id' => $rend->id,
                    'user_id'      => $actor->id,
                    'tipo'         => $faker->randomElement(['Peaje','Carga','Estacionamiento']),
                    'descripcion'  => $faker->words(3,true),
                    'monto'        => $faker->numberBetween(10000,40000),
                ]);
            }
            foreach (range(1, rand(1,2)) as $_) {
                AbonoCaja::create([
                    'rendicion_id' => $rend->id,
                    'monto'        => $faker->numberBetween(30000,70000),
                    'metodo'       => $faker->randomElement(['Efectivo','Transferencia']),
                ]);
            }

            // Adicionales: 0–2 por flete
            foreach (range(1, rand(0,2)) as $_) {
                Adicional::create([
                    'flete_id'     => $flete->id,
                    'rendicion_id' => $rend->id,
                    'tipo'         => $faker->randomElement(['Demora','Peaje','Carga Extra']),
                    'descripcion'  => $faker->sentence(4),
                    'monto'        => $faker->numberBetween(5000,20000),
                ]);
            }
        }

        $this->command->info("✅ Seed completo con 1000 fletes (Ene–Jun 2025), expendables y adicionales.");
    }
}
