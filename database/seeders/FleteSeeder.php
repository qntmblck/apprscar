<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Tracto;
use App\Models\Rampla;
use App\Models\Destino;
use App\Models\Tarifa;
use App\Models\Flete;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;
use Carbon\Carbon;

class FleteSeeder extends Seeder
{
    public function run(): void
    {
        // Asegurar todos los roles necesarios
        foreach (['conductor', 'cliente', 'colaborador', 'superadmin'] as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Crear 20 conductores con usuario
        $conductores = collect();
        for ($i = 1; $i <= 20; $i++) {
            $user = User::firstOrCreate(
                ['email' => "conductor{$i}@mail.com"],
                [
                    'name' => "Conductor {$i}",
                    'email_verified_at' => now(),
                    'password' => bcrypt('password'),
                    'remember_token' => Str::random(10),
                ]
            );
            $user->assignRole('conductor');
            $conductores->push($user);
        }

        // Crear 20 clientes y su registro en clientes
        $clientes = collect();
        for ($i = 1; $i <= 20; $i++) {
            $user = User::firstOrCreate(
                ['email' => "cliente{$i}@mail.com"],
                [
                    'name' => "Cliente {$i}",
                    'email_verified_at' => now(),
                    'password' => bcrypt('password'),
                    'remember_token' => Str::random(10),
                ]
            );
            $user->assignRole('cliente');

            $cliente = Cliente::firstOrCreate([
                'user_id' => $user->id,
                'razon_social' => "Cliente Empresa {$i}",
                'rut' => "76.000." . str_pad($i, 3, '0', STR_PAD_LEFT) . "-K",
                'giro' => "Transporte de carga",
                'direccion' => "Calle Falsa #{$i}",
                'telefono' => "987654" . str_pad($i, 3, '0', STR_PAD_LEFT),
            ]);

            $clientes->push($cliente);
        }

        // Crear 1 tracto y 1 rampla
        $tracto = Tracto::firstOrCreate([
            'patente' => 'ABC123',
            'marca' => 'Volvo',
            'modelo' => 'FH',
            'año' => 2020,
            'color' => 'Azul'
        ]);

        $rampla = Rampla::firstOrCreate([
            'patente' => 'XYZ789',
            'tipo' => 'Plataforma',
            'marca' => 'Randon',
            'capacidad' => 28000,
            'longitud' => 13.5,
        ]);

        // Crear 10 destinos únicos
        $destinos = collect([
            ['nombre' => 'Santiago', 'region' => 'RM', 'km' => 0],
            ['nombre' => 'Valparaíso', 'region' => 'Valparaíso', 'km' => 120],
            ['nombre' => 'Concepción', 'region' => 'Biobío', 'km' => 500],
            ['nombre' => 'Antofagasta', 'region' => 'Antofagasta', 'km' => 1300],
            ['nombre' => 'La Serena', 'region' => 'Coquimbo', 'km' => 470],
            ['nombre' => 'Puerto Montt', 'region' => 'Los Lagos', 'km' => 1000],
            ['nombre' => 'Temuco', 'region' => 'Araucanía', 'km' => 680],
            ['nombre' => 'Iquique', 'region' => 'Tarapacá', 'km' => 1800],
            ['nombre' => 'Rancagua', 'region' => 'O’Higgins', 'km' => 90],
            ['nombre' => 'Copiapó', 'region' => 'Atacama', 'km' => 800],
        ]);

        $destinosMap = collect();
        foreach ($destinos as $d) {
            $destino = Destino::firstOrCreate(['nombre' => $d['nombre']], [
                'region' => $d['region'],
                'km' => $d['km']
            ]);
            $destinosMap->push($destino);
        }

        // Crear tarifa por destino (Directo)
        $tarifas = collect();
        foreach ($destinosMap as $destino) {
            $tarifas->push(Tarifa::firstOrCreate([
                'destino_id' => $destino->id,
                'tipo' => 'Directo',
            ], [
                'monto' => rand(150000, 500000),
            ]));
        }

        // Crear 1000 fletes aleatorios
        for ($i = 0; $i < 1000; $i++) {
            $conductor = $conductores->random();
            $cliente = $clientes->random();
            $destino = $destinosMap->random();
            $tarifa = $tarifas->firstWhere('destino_id', $destino->id);
            $km_ida = $destino->km;
            $rendimiento = round(mt_rand(25, 65) / 10, 2);
            $estado = collect(['activo', 'rendido', 'pendiente'])->random();
            $fecha_salida = Carbon::now()->subDays(rand(1, 60));
            $fecha_llegada = (clone $fecha_salida)->addDays(rand(1, 5));

            Flete::create([
                'conductor_id' => $conductor->id,
                'cliente_principal_id' => $cliente->id,
                'tracto_id' => $tracto->id,
                'rampla_id' => $rampla->id,
                'destino_id' => $destino->id,
                'tarifa_id' => $tarifa->id,
                'tipo' => 'Directo',
                'km_ida' => $km_ida,
                'rendimiento' => $rendimiento,
                'estado' => $estado,
                'fecha_salida' => $fecha_salida,
                'fecha_llegada' => $fecha_llegada,
            ]);
        }

        // Crear superadmin si no existe
$superadmin = User::firstOrCreate(
    ['email' => 'superadmin@example.com'],
    [
        'name' => 'Súper Admin',
        'email_verified_at' => now(),
        'password' => bcrypt('password'),
        'remember_token' => Str::random(10),
    ]
);
$superadmin->assignRole('superadmin');

    }
}
