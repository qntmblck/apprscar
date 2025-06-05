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
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Spatie\Permission\Models\Role;

class FleteSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create('es_CL');
        $meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        foreach (['superadmin', 'conductor', 'cliente', 'colaborador'] as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $super = User::firstOrCreate(['email' => 'superadmin@example.com'], [
            'name' => 'Super Admin',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $super->syncRoles(['superadmin']);

        $conductores = User::factory(10)->create()->each(fn($u) => $u->assignRole('conductor'));

        $clientes = collect();
        foreach (range(1, 10) as $i) {
            $user = User::factory()->create(['email' => "cliente{$i}@mail.com"]);
            $user->assignRole('cliente');
            $clientes->push(
                Cliente::create([
                    'user_id' => $user->id,
                    'razon_social' => $faker->company,
                    'rut' => $faker->unique()->numerify('76.###.###-#'),
                    'giro' => 'Transporte',
                    'direccion' => $faker->address,
                    'telefono' => $faker->phoneNumber,
                ])
            );
        }

        $destinos = Destino::factory(5)->create();
        $tractos = Tracto::factory(5)->create();
        $ramplas = Rampla::factory(5)->create();

        foreach ($clientes as $cliente) {
            foreach ($destinos as $destino) {
                foreach (['Directo', 'Reparto'] as $tipo) {
                    Tarifa::firstOrCreate([
                        'cliente_principal_id' => $cliente->id,
                        'destino_id' => $destino->id,
                        'tipo' => $tipo,
                    ], [
                        'valor_factura' => 100000,
                        'valor_comision' => 10000,
                    ]);
                }
            }
        }

        foreach (range(1, 500) as $i) {
            $cliente = $clientes->random();
            $conductor = $conductores->random();
            $destino = $destinos->random();
            $tracto = $tractos->random();
            $rampla = $ramplas->random();
            $tipo = $faker->randomElement(['Directo', 'Reparto']);

            $tarifa = Tarifa::where([
                'cliente_principal_id' => $cliente->id,
                'destino_id' => $destino->id,
                'tipo' => $tipo
            ])->first();

            $fechaSalida = Carbon::now()->subDays(rand(10, 40));
            $fechaLlegada = (clone $fechaSalida)->addDays(rand(1, 5));

            $usarComisionManual = rand(1, 100) <= 10;
            $comisionManual = $usarComisionManual ? rand(8000, 20000) : null;
            $retorno = $usarComisionManual ? rand(10000, 50000) : null;

            $flete = Flete::create([
                'conductor_id' => $conductor->id,
                'cliente_principal_id' => $cliente->id,
                'tracto_id' => $tracto->id,
                'rampla_id' => $rampla->id,
                'destino_id' => $destino->id,
                'tarifa_id' => $tarifa->id,
                'tipo' => $tipo,
                'estado' => rand(0, 1) ? 'Notificado' : 'Sin Notificar',
                'fecha_salida' => $fechaSalida,
                'fecha_llegada' => rand(1, 100) <= 70 ? $fechaLlegada : null,
                'kilometraje' => rand(200, 900),
                'rendimiento' => round(rand(30, 65) / 10, 1),
                'comision' => $comisionManual ?? $tarifa->valor_comision,
                'retorno' => $retorno,
                'guiaruta' => $faker->numerify('GR-#####'),
                'periodo' => $faker->randomElement($meses),
                'pagado' => rand(1, 100) <= 30,
            ]);

            $rendicion = Rendicion::create([
                'flete_id' => $flete->id,
                'user_id' => $conductor->id,
                'estado' => rand(1, 100) <= 70 ? 'Cerrado' : 'Activo',
                'periodo' => $flete->periodo,
                'viatico_efectivo' => 30000,
                'caja_flete' => 0,
                'comision' => $flete->comision,
                'pagado' => $flete->pagado,
            ]);

            foreach (range(1, rand(1, 3)) as $a) {
                AbonoCaja::create([
                    'rendicion_id' => $rendicion->id,
                    'monto' => rand(20000, 60000),
                    'metodo' => $faker->randomElement(['Efectivo', 'Transferencia']),
                ]);
            }

            foreach (range(1, rand(1, 2)) as $d) {
                Diesel::create([
                    'rendicion_id' => $rendicion->id,
                    'flete_id' => $flete->id,
                    'litros' => rand(50, 150),
                    'monto' => rand(70000, 150000),
                    'metodo_pago' => $faker->randomElement(['Efectivo', 'Transferencia', 'Crédito']),
                ]);
            }

            foreach (range(1, rand(1, 3)) as $g) {
                Gasto::create([
                    'rendicion_id' => $rendicion->id,
                    'flete_id' => $flete->id,
                    'usuario_id' => $conductor->id,
                    'tipo' => $faker->randomElement(['Peaje', 'Carga', 'Descarga', 'Estacionamiento', 'Otros']),
                    'monto' => rand(5000, 25000),
                    'descripcion' => $faker->sentence,
                ]);
            }
        }
    }
}
