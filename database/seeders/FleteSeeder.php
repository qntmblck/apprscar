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
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Spatie\Permission\Models\Role;

class FleteSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create('es_CL');
        $meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

        // Ciudades chilenas como destinos
        $ciudades = [
            'Santiago','Valparaíso','Concepción','La Serena','Antofagasta',
            'Iquique','Puerto Montt','Temuco','Rancagua','Talca',
        ];
        // Regiones de Chile para asignar
        $regiones = [
            'Metropolitana','Valparaíso','Biobío','Coquimbo','Antofagasta',
            'Araucanía','O\'Higgins','Maule','Los Lagos','Tarapacá',
        ];

        // 1. Roles
        foreach (['superadmin','conductor','cliente','colaborador'] as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // 2. Superadmin
        $super = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            ['name' => 'Super Admin', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        $super->syncRoles(['superadmin']);

        // 3. Conductores
        $conductores = User::factory(10)
            ->create()
            ->each(fn($u) => $u->assignRole('conductor'));

        // 4. Clientes + modelo Cliente
        $clientes = collect();
        foreach (range(1,10) as $i) {
            $u = User::factory()->create(['email' => "cliente{$i}@mail.com"]);
            $u->assignRole('cliente');
            $clientes->push(Cliente::create([
                'user_id'      => $u->id,
                'razon_social' => $faker->company,
                'rut'          => $faker->unique()->numerify('76.###.###-#'),
                'giro'         => 'Transporte',
                'direccion'    => $faker->address,
                'telefono'     => $faker->phoneNumber,
            ]));
        }

        // 5. Crear destinos basados en ciudades (ahora con region y km)
        foreach ($ciudades as $city) {
            Destino::firstOrCreate(
                ['nombre' => $city],
                [
                    'region' => $faker->randomElement($regiones),
                    'km'     => rand(50, 500),
                ]
            );
        }
        $destinos = Destino::all();

        // 6. Tractos y Ramplas
        $tractos = Tracto::factory(5)->create();
        $ramplas = Rampla::factory(5)->create();

        // 7. Tarifas
        foreach ($clientes as $cliente) {
            foreach ($destinos as $destino) {
                foreach (['Directo','Reparto'] as $tipo) {
                    Tarifa::firstOrCreate(
                        [
                            'cliente_principal_id' => $cliente->id,
                            'destino_id'           => $destino->id,
                            'tipo'                 => $tipo
                        ],
                        ['valor_factura' => 100_000, 'valor_comision' => 10_000]
                    );
                }
            }
        }

        // 8. Generar 1000 fletes
        foreach (range(1,1000) as $_) {
            $cliente   = $clientes->random();
            $conductor = $conductores->random();
            $destino   = $destinos->random();
            $tracto    = $tractos->random();
            $rampla    = $ramplas->random();
            $tipo      = $faker->randomElement(['Directo','Reparto']);
            $tarifa    = Tarifa::where([
                'cliente_principal_id' => $cliente->id,
                'destino_id'           => $destino->id,
                'tipo'                 => $tipo
            ])->first();

            // Fechas
            $fechaSalida  = Carbon::now()->subDays(rand(10,40));
            $fechaLlegada = (clone $fechaSalida)->addDays(rand(1,5));

            // 70% cerrados y pagados, 30% activos y sin pagar
            $isPaidClosed = rand(1,100) <= 70;

            // Cálculo de viático
            $dias   = $fechaSalida->diffInDays($fechaLlegada) ?: 1;
            $viatico = 15000 * $dias;

            // Comisión y retorno
            $comision = $tarifa->valor_comision;
            $retorno   = $comision > 0 ? rand(10000,50000) : null;

            // Crear Flete
            $flete = Flete::create([
                'conductor_id'         => $conductor->id,
                'cliente_principal_id' => $cliente->id,
                'tracto_id'            => $tracto->id,
                'rampla_id'            => $rampla->id,
                'destino_id'           => $destino->id,
                'tarifa_id'            => $tarifa->id,
                'tipo'                 => $tipo,
                'estado'               => $faker->randomElement(['Sin Notificar','Notificado']),
                'fecha_salida'         => $fechaSalida,
                'fecha_llegada'        => $fechaLlegada,
                'kilometraje'          => rand(200,900),
                'rendimiento'          => round(rand(30,65)/10,1),
                'comision'             => $comision,
                'retorno'              => $retorno,
                'guiaruta'             => $faker->numerify('GR-#####'),
                'periodo'              => $faker->randomElement($meses),
                'pagado'               => $isPaidClosed,
            ]);

            // Crear Rendición
            $rendicion = Rendicion::create([
                'flete_id'         => $flete->id,
                'user_id'          => $conductor->id,
                'estado'           => $isPaidClosed ? 'Cerrado' : 'Activo',
                'periodo'          => $flete->periodo,
                'viatico_efectivo' => $viatico,
                'caja_flete'       => 0,
                'comision'         => $comision,
                'pagado'           => $flete->pagado,
            ]);

            $dieselTotal = 0;
            $gastoTotal  = 0;

            // Diesel (1–2 registros)
            foreach (range(1, rand(1,2)) as $_d) {
                $monto = rand(70000,150000);
                Diesel::create([
                    'rendicion_id' => $rendicion->id,
                    'flete_id'     => $flete->id,
                    'user_id'      => $conductor->id,
                    'litros'       => rand(50,150),
                    'monto'        => $monto,
                    'metodo_pago'  => $faker->randomElement(['Efectivo','Transferencia','Crédito']),
                ]);
                $dieselTotal += $monto;
            }

            // Gastos (1–3 registros)
            foreach (range(1, rand(1,3)) as $_g) {
                $monto = rand(5000,25000);
                Gasto::create([
                    'flete_id'     => $flete->id,
                    'rendicion_id' => $rendicion->id,
                    'user_id'      => $conductor->id,
                    'tipo'         => $faker->randomElement(['Peaje','Carga','Descarga','Estacionamiento','Otros','Comisión']),
                    'descripcion'  => $faker->sentence,
                    'foto'         => null,
                    'monto'        => $monto,
                ]);
                $gastoTotal += $monto;
            }

            // Abonos de caja (1–3 registros)
            foreach (range(1, rand(1,3)) as $_a) {
                AbonoCaja::create([
                    'rendicion_id' => $rendicion->id,
                    'monto'        => rand(20000,60000),
                    'metodo'       => $faker->randomElement(['Efectivo','Transferencia']),
                ]);
            }

            // Actualizar caja_flete para saldos cercanos a cero
            $caja = $dieselTotal + $gastoTotal + $viatico;
            $rendicion->update(['caja_flete' => $caja]);
        }
    }
}
