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
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class FleteSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['superadmin', 'conductor', 'cliente', 'colaborador'] as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $faker = \Faker\Factory::create('es_ES');
        $conductores = collect();
        $clientes = collect();

        // Conductores
        for ($i = 1; $i <= 20; $i++) {
            $user = User::firstOrCreate(['email' => "conductor{$i}@mail.com"], [
                'name' => $faker->name,
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]);
            $user->assignRole('conductor');
            $conductores->push($user);
        }

        // Clientes
        for ($i = 1; $i <= 20; $i++) {
            $user = User::firstOrCreate(['email' => "cliente{$i}@mail.com"], [
                'name' => $faker->company,
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]);
            $user->assignRole('cliente');

            $cliente = Cliente::firstOrCreate([
                'user_id' => $user->id,
                'razon_social' => $user->name,
                'rut' => '76.000.' . str_pad($i, 3, '0', STR_PAD_LEFT) . '-K',
                'giro' => 'Transporte',
                'direccion' => $faker->address,
                'telefono' => $faker->phoneNumber,
            ]);
            $clientes->push($cliente);
        }

        // Tractos
        $tractos = collect();
        for ($i = 1; $i <= 5; $i++) {
            $tractos->push(Tracto::firstOrCreate([
                'patente' => "TRC" . str_pad($i, 3, '0', STR_PAD_LEFT),
            ], [
                'marca' => 'Volvo',
                'modelo' => 'FH',
                'año' => rand(2015, 2023),
                'color' => 'Blanco',
            ]));
        }

        // Ramplas
        $ramplas = collect();
        for ($i = 1; $i <= 5; $i++) {
            $ramplas->push(Rampla::firstOrCreate([
                'patente' => "RMP" . str_pad($i, 3, '0', STR_PAD_LEFT),
            ], [
                'tipo' => 'Plataforma',
                'marca' => 'Randon',
                'capacidad' => 28000,
                'longitud' => 13.5,
            ]));
        }

        // Destinos
        $destinosRaw = [
            ['Santiago', 'RM', 0], ['Valparaíso', 'Valparaíso', 120], ['Concepción', 'Biobío', 500],
            ['Antofagasta', 'Antofagasta', 1300], ['La Serena', 'Coquimbo', 470], ['Puerto Montt', 'Los Lagos', 1000],
            ['Temuco', 'Araucanía', 680], ['Iquique', 'Tarapacá', 1800], ['Rancagua', 'O’Higgins', 90],
            ['Copiapó', 'Atacama', 800], ['Chillán', 'Ñuble', 400], ['Talca', 'Maule', 250],
            ['Arica', 'Arica y Parinacota', 2050], ['Punta Arenas', 'Magallanes', 2200], ['Quillota', 'Valparaíso', 135],
            ['Ovalle', 'Coquimbo', 410], ['Curicó', 'Maule', 200], ['Los Ángeles', 'Biobío', 510],
            ['Calama', 'Antofagasta', 1450], ['San Antonio', 'Valparaíso', 105], ['Melipilla', 'RM', 70],
            ['San Fernando', 'O’Higgins', 160], ['Angol', 'Araucanía', 700], ['Vallenar', 'Atacama', 950],
            ['Linares', 'Maule', 300], ['Castro', 'Los Lagos', 1200], ['Tocopilla', 'Antofagasta', 1350],
            ['Osorno', 'Los Lagos', 1050], ['Coyhaique', 'Aysén', 1900], ['Puerto Natales', 'Magallanes', 2250],
        ];

        $destinos = collect();
        foreach ($destinosRaw as [$nombre, $region, $km]) {
            $destinos->push(Destino::firstOrCreate(['nombre' => $nombre], [
                'region' => $region,
                'km' => $km,
            ]));
        }

        // Tarifas por cliente + destino + tipo
        $tarifas = collect();
        foreach ($clientes as $cliente) {
            foreach ($destinos as $destino) {
                foreach (['Directo', 'Reparto'] as $tipo) {
                    $tarifas->push(Tarifa::firstOrCreate([
                        'destino_id' => $destino->id,
                        'cliente_id' => $cliente->id,
                        'tipo' => $tipo,
                    ], [
                        'valor_factura' => rand(150000, 500000),
                        'valor_comision' => rand(20000, 60000),
                    ]));
                }
            }
        }

        $periodos = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'];

        for ($i = 0; $i < 1000; $i++) {
            $conductor = $conductores->random();
            $cliente = $clientes->random();
            $tracto = $tractos->random();
            $rampla = $ramplas->random();
            $destino = $destinos->random();
            $tipo = rand(0, 1) ? 'Directo' : 'Reparto';

            $tarifa = $tarifas->firstWhere(fn($t) =>
                $t->destino_id === $destino->id &&
                $t->cliente_id === $cliente->id &&
                $t->tipo === $tipo
            );

            $fecha_salida = Carbon::now()->subDays(rand(0, 90));
            $fecha_llegada = (clone $fecha_salida)->addDays(rand(1, 3));
            $estadoFlete = rand(0, 1) ? 'Notificado' : 'Sin Notificar';


            $flete = Flete::create([
                'conductor_id' => $conductor->id,
                'cliente_principal_id' => $cliente->id,
                'tracto_id' => $tracto->id,
                'rampla_id' => $rampla->id,
                'destino_id' => $destino->id,
                'tarifa_id' => $tarifa->id,
                'tipo' => $tipo,
                'km_ida' => $destino->km,
                'rendimiento' => round(mt_rand(30, 65) / 10, 1),
                'estado' => $estadoFlete,
                'fecha_salida' => $fecha_salida,
                'fecha_llegada' => $fecha_llegada,
            ]);

            $estadoRend = rand(0, 1) ? 'Activo' : 'Cerrado';
            $caja = rand(150000, 300000);
            $viaticoCalc = ($fecha_salida->diffInDays($fecha_llegada) + 1) * 15000;
            $viatico = $estadoRend === 'cerrada' ? $viaticoCalc : 0;
            $saldo = $estadoRend === 'cerrada' ? $caja - $viatico - rand(20000, 60000) : null;
            $periodo = $estadoRend === 'cerrada' ? $periodos[array_rand($periodos)] : null;

            Rendicion::create([
                'flete_id' => $flete->id,
                'user_id' => $conductor->id,
                'estado' => $estadoRend,
                'caja_flete' => $caja,
                'viatico_efectivo' => $viatico,
                'viatico_calculado' => $viaticoCalc,
                'viatico' => $estadoRend === 'cerrada' ? $viatico : null,
                'saldo' => $saldo,
                'periodo' => $periodo,
            ]);
        }

        User::firstOrCreate(['email' => 'colaborador@example.com'], [
            'name' => 'Usuario Colaborador',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'remember_token' => Str::random(10),
        ])->assignRole('colaborador');

        User::firstOrCreate(['email' => 'superadmin@example.com'], [
            'name' => 'Súper Admin',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'remember_token' => Str::random(10),
        ])->assignRole('superadmin');
    }
}
