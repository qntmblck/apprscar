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
use App\Models\Retorno;
use App\Models\Adicional;
use App\Models\Mantencion;
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

        // 2) Crear 5 conductores activos
        $conductores = User::factory()
            ->count(5)
            ->state(fn() => [
                'email_verified_at' => now(),
                'estado'            => 'Activo',
            ])
            ->create()
            ->each(fn(User $u) => $u->assignRole('conductor'));

        // 3) Crear 5 colaboradores activos
        $colaboradores = User::factory()
            ->count(5)
            ->state(fn() => [
                'email_verified_at' => now(),
                'estado'            => 'Activo',
            ])
            ->create()
            ->each(fn(User $u) => $u->assignRole('colaborador'));

        // 4) Presets: clientes, destinos, tractos, ramplas
        $clientes = Cliente::factory(ClienteFactory::PRESET_COUNT)->create();
        $destinos = Destino::factory(DestinoFactory::PRESET_COUNT)->create();
        $tractos  = Tracto::factory(TractoFactory::PRESET_COUNT)->create();
        $ramplas  = Rampla::factory(RamplaFactory::PRESET_COUNT)->create();

        // 5) Crear todas las tarifas (cliente × destino × tipo)
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

        // 6) Generar 1000 fletes + rendiciones + expendables + adicionales (Jul–Dic 2025)
        $inicio = Carbon::create(2025,7,1);
        $fin    = Carbon::create(2025,12,30);
        $totalDias = $fin->diffInDays($inicio);

        for ($i = 0; $i < 1000; $i++) {
            // Actor: 20% colaboradores, 80% conductores
            if (rand(1,100) <= 20) {
                $actorKey = 'colaborador_id';
                $actor    = $colaboradores->random();
            } else {
                $actorKey = 'conductor_id';
                $actor    = $conductores->random();
            }

            // Datos aleatorios
            $cli = $clientes->random();
            $des = $destinos->random();
            $tra = $tractos->random();
            $ram = $ramplas->random();
            $tp  = $faker->randomElement($tipos);

            // Obtener tarifa existente
            $tarifa = Tarifa::where([
                ['cliente_principal_id', $cli->id],
                ['destino_id',           $des->id],
                ['tipo',                 $tp],
            ])->first();

            // Fechas y km
            $km         = ($des->km_destino ?? 0) * 2;
            $fechaSalida  = (clone $inicio)->addDays(rand(0,$totalDias));
            $fechaLlegada = (clone $fechaSalida)->addDays(rand(0,5));
            if ($fechaLlegada->gt($fin)) $fechaLlegada = $fin->copy();

            // Comisión manual para rendición
            $manual = $faker->numberBetween(5000,20000);

            // Crear flete con comisión total (fija + manual)
            $flete = Flete::create([
                'cliente_principal_id' => $cli->id,
                'destino_id'           => $des->id,
                'tarifa_id'            => $tarifa->id,
                'tipo'                 => $tp,
                'estado'               => 'Sin Notificar',
                'fecha_salida'         => $fechaSalida,
                'fecha_llegada'        => $fechaLlegada,
                'kilometraje'          => $km,
                'rendimiento'          => $faker->randomFloat(2,3,7),
                'comision'             => $tarifa->valor_comision + $manual,
                'retorno'              => rand(0,1) ? $faker->numberBetween(10000,50000) : 0,
                'pagado'               => $fechaLlegada->month <= 3,
                'guiaruta'             => $faker->bothify('GR-??-####'),
                'tracto_id'            => $tra->id,
                'rampla_id'            => $ram->id,
                $actorKey              => $actor->id,
            ]);

            // Mantenciones cada 5000 km
            $prevTra = $tra->kilometraje;
            $prevRam = $ram->kilometraje;
            $tra->increment('kilometraje', $km);
            $ram->increment('kilometraje', $km);

            $nTra = intdiv($prevTra + $km, 5000) - intdiv($prevTra, 5000);
            $nRam = intdiv($prevRam + $km, 5000) - intdiv($prevRam, 5000);

            for ($j = 0; $j < $nTra; $j++) {
                Mantencion::create([
                    'user_id'   => $actor->id,
                    'flete_id'  => $flete->id,
                    'tracto_id' => $tra->id,
                    'rampla_id' => null,
                    'fecha'     => $faker->dateTimeBetween($fechaSalida, $fechaLlegada),
                    'tipo'      => 'Mantención',
                    'detalle'   => $faker->sentence(),
                    'costo'     => $faker->numberBetween(50000,150000),
                    'estado'    => 'pendiente',
                ]);
            }
            for ($j = 0; $j < $nRam; $j++) {
                Mantencion::create([
                    'user_id'   => $actor->id,
                    'flete_id'  => $flete->id,
                    'tracto_id' => null,
                    'rampla_id' => $ram->id,
                    'fecha'     => $faker->dateTimeBetween($fechaSalida, $fechaLlegada),
                    'tipo'      => 'Mantención',
                    'detalle'   => $faker->sentence(),
                    'costo'     => $faker->numberBetween(50000,150000),
                    'estado'    => 'pendiente',
                ]);
            }

            // Crear rendición solo con manual
            $rend = Rendicion::create([
                'flete_id'         => $flete->id,
                'user_id'          => $actor->id,
                'estado'           => 'Activo',
                'caja_flete'       => 0,
                'viatico_efectivo' => 15000 * max(1, $fechaSalida->diffInDays($fechaLlegada)),
                'viatico_calculado'=> 0,
                'saldo'            => 0,
                'comision'         => $manual,
            ]);
            // Recalcular para sumar fija+manual internamente en rendición
            $rend->recalcularTotales();

            // Expendables
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
                    'tipo'         => $faker->randomElement(['Peaje','Estacionamiento','Carga']),
                    'descripcion'  => $faker->words(3, true),
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
            // Crear Retorno si aplica
            if ($flete->retorno > 0) {
                Retorno::create([
                    'flete_id'    => $flete->id,
                    'valor'       => $flete->retorno,
                    'descripcion' => 'Retorno automático',
                ]);
            }
            foreach (range(1, rand(0,2)) as $_) {
                Adicional::create([
                    'flete_id'     => $flete->id,
                    'rendicion_id' => $rend->id,
                    'tipo'         => 'Adicional',
                    'descripcion'  => $faker->randomElement(['Camioneta','Peoneta','Extra']),
                    'monto'        => $faker->numberBetween(5000,20000),
                ]);
            }
        }

        $this->command->info("✅ Seed completo con 1000 fletes y rendiciones con comisiones totales.");
    }
}
