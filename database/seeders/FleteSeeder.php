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
use App\Models\Mantencion;
use Database\Factories\ClienteFactory;
use Database\Factories\DestinoFactory;
use Database\Factories\TractoFactory;
use Database\Factories\RamplaFactory;
use Database\Factories\TarifaFactory;

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

        // 2) Crear conductores y colaboradores
        $conductores = User::factory()
            ->count(5)
            ->state(fn() => ['email_verified_at' => now(), 'estado' => 'Activo'])
            ->create()
            ->each(fn(User $u) => $u->assignRole('conductor'));

        $colaboradores = User::factory()
            ->count(5)
            ->state(fn() => ['email_verified_at' => now(), 'estado' => 'Activo'])
            ->create()
            ->each(fn(User $u) => $u->assignRole('colaborador'));

        // 3) Presets de clientes, destinos, tractos y ramplas
        Cliente::factory(ClienteFactory::PRESET_COUNT)->create();
        Destino::factory(DestinoFactory::PRESET_COUNT)->create();
        Tracto::factory(TractoFactory::PRESET_COUNT)->create();
        Rampla::factory(RamplaFactory::PRESET_COUNT)->create();

        // 4) Crear tarifas usando los presets de TarifaFactory
        TarifaFactory::resetIndex();
        Tarifa::factory()
            ->count(TarifaFactory::presetCount())
            ->create();

        // 5) Generar 1000 fletes
        $inicio    = Carbon::create(2025, 7, 1);
        $fin       = Carbon::create(2025, 12, 30);
        $totalDias = $fin->diffInDays($inicio);

        for ($i = 0; $i < 1000; $i++) {
            // 5.1) Elegir aleatoriamente una tarifa ya creada
            $tarifa = Tarifa::inRandomOrder()->first();

            // 5.2) Obtener cliente y destino directamente de la tarifa
            $cli = Cliente::findOrFail($tarifa->cliente_principal_id);
            $des = Destino::findOrFail($tarifa->destino_id);

            // 5.3) Quién maneja el flete
            if (rand(1, 100) <= 20) {
                $actorKey = 'colaborador_id';
                $actor    = $colaboradores->random();
                $isColab  = true;
            } else {
                $actorKey = 'conductor_id';
                $actor    = $conductores->random();
                $isColab  = false;
            }

            // 5.4) Fechas y kilometraje estimado
            $fechaSalida  = (clone $inicio)->addDays(rand(0, $totalDias));
            $fechaLlegada = (clone $fechaSalida)->addDays(rand(0, 5));
            if ($fechaLlegada->gt($fin)) {
                $fechaLlegada = $fin->copy();
            }
            // Asumo que en tu modelo Destino la columna se llama 'km_destino'
            $kmDestino = $des->km_destino ?? 0;
            $km = $kmDestino * 2;

            // 5.5) Crear el Flete
            $flete = Flete::create([
                'cliente_principal_id' => $cli->id,
                'destino_id'           => $des->id,
                'tarifa_id'            => $tarifa->id,
                'tipo'                 => $tarifa->tipo,
                'estado'               => 'Sin Notificar',
                'fecha_salida'         => $fechaSalida,
                'fecha_llegada'        => $fechaLlegada,
                'kilometraje'          => $km,
                'rendimiento'          => $faker->randomFloat(2, 3, 7),
                'comision'             => $tarifa->valor_comision + $faker->numberBetween(5000, 20000),
                'retorno'              => rand(0, 1) ? $faker->numberBetween(10000, 50000) : 0,
                'pagado'               => $fechaLlegada->lt(now()->subMonths(2)),
                'guiaruta'             => $faker->bothify('GR-??-####'),
                'conductor_id'         => $actorKey === 'conductor_id' ? $actor->id : null,
                'colaborador_id'       => $actorKey === 'colaborador_id' ? $actor->id : null,
                'tracto_id'            => Tracto::inRandomOrder()->first()->id,
                'rampla_id'            => Rampla::inRandomOrder()->first()->id,
            ]);

            // 5.6) Mantenciones automáticas
            $prevTra = $flete->tracto->kilometraje;
            $prevRam = $flete->rampla->kilometraje;
            $flete->tracto->increment('kilometraje', $km);
            $flete->rampla->increment('kilometraje', $km);
            $nTra = intdiv($prevTra + $km, 5000) - intdiv($prevTra, 5000);
            $nRam = intdiv($prevRam + $km, 5000) - intdiv($prevRam, 5000);

            for ($j = 0; $j < $nTra; $j++) {
                Mantencion::create([
                    'user_id'   => $actor->id,
                    'flete_id'  => $flete->id,
                    'tracto_id' => $flete->tracto->id,
                    'rampla_id' => null,
                    'fecha'     => $faker->dateTimeBetween($fechaSalida, $fechaLlegada),
                    'tipo'      => 'Mantención',
                    'detalle'   => $faker->sentence(),
                    'costo'     => $faker->numberBetween(50000, 150000),
                    'estado'    => 'pendiente',
                ]);
            }
            for ($j = 0; $j < $nRam; $j++) {
                Mantencion::create([
                    'user_id'   => $actor->id,
                    'flete_id'  => $flete->id,
                    'tracto_id' => null,
                    'rampla_id' => $flete->rampla->id,
                    'fecha'     => $faker->dateTimeBetween($fechaSalida, $fechaLlegada),
                    'tipo'      => 'Mantención',
                    'detalle'   => $faker->sentence(),
                    'costo'     => $faker->numberBetween(50000, 150000),
                    'estado'    => 'pendiente',
                ]);
            }

            // 5.7) Rendición y gastos
            $diasViaje = max(1, $fechaSalida->diffInDays($fechaLlegada) + 1);
            $viatico   = $isColab ? 0 : (15000 * $diasViaje);

            $rend = Rendicion::create([
                'flete_id'          => $flete->id,
                'user_id'           => $actor->id,
                'estado'            => 'Activo',
                'caja_flete'        => 0,
                'viatico_efectivo'  => $viatico,
                'viatico_calculado' => 0,
                'saldo'             => 0,
                'comision'          => $faker->numberBetween(5000, 20000),
            ]);
            $rend->recalcularTotales();

            if (! $isColab) {
                // Diesel
                $dieselTotal = $faker->numberBetween(50000, 150000);
                $gastosTotal = $faker->numberBetween(20000, 80000);
                $saldoTarget = $faker->numberBetween(-40000, 40000);
                $abonosTotal = $dieselTotal + $gastosTotal + $viatico + $saldoTarget;

                // Partes de diesel
                $partes = rand(1, 2);
                $resto  = $dieselTotal;
                for ($j = 1; $j <= $partes; $j++) {
                    $m     = $j === $partes
                        ? $resto
                        : $faker->numberBetween((int)($dieselTotal * 0.3), (int)($dieselTotal * 0.7));
                    $resto -= $m;
                    Diesel::create([
                        'flete_id'     => $flete->id,
                        'rendicion_id' => $rend->id,
                        'user_id'      => $actor->id,
                        'litros'       => $faker->numberBetween(40, 120),
                        'monto'        => $m,
                        'metodo_pago'  => $faker->randomElement(['Efectivo','Transferencia','Crédito']),
                    ]);
                }

                // Partes de gastos
                $partes = rand(1, 3);
                $resto  = $gastosTotal;
                for ($j = 1; $j <= $partes; $j++) {
                    $m     = $j === $partes
                        ? $resto
                        : $faker->numberBetween((int)($gastosTotal * 0.3), (int)($gastosTotal * 0.7));
                    $resto -= $m;
                    Gasto::create([
                        'flete_id'     => $flete->id,
                        'rendicion_id' => $rend->id,
                        'user_id'      => $actor->id,
                        'tipo'         => $faker->randomElement(['Peaje','Estacionamiento','Carga']),
                        'descripcion'  => $faker->words(3, true),
                        'monto'        => $m,
                    ]);
                }

                // Partes de abonos
                $partes = rand(1, 2);
                $resto  = $abonosTotal;
                for ($j = 1; $j <= $partes; $j++) {
                    $m     = $j === $partes
                        ? $resto
                        : $faker->numberBetween((int)($abonosTotal * 0.3), (int)($abonosTotal * 0.7));
                    $resto -= $m;
                    AbonoCaja::create([
                        'rendicion_id' => $rend->id,
                        'monto'        => $m,
                        'metodo'       => $faker->randomElement(['Efectivo','Transferencia']),
                    ]);
                }

                $rend->recalcularTotales();
                $rend->update(['saldo' => $saldoTarget]);
            }

            // 5.8) Adicionales
            foreach (range(1, rand(0, 2)) as $_) {
                Adicional::create([
                    'flete_id'     => $flete->id,
                    'rendicion_id' => $rend->id,
                    'tipo'         => 'Adicional',
                    'descripcion'  => $faker->randomElement(['Camioneta','Peoneta','Extra']),
                    'monto'        => $faker->numberBetween(5000, 20000),
                ]);
            }
        }

        $this->command->info('✅ Seed completo con 1000 fletes y lógica de roles aplicada.');
    }
}
