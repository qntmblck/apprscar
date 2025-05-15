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
use App\Models\Rendicion;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Roles
        Role::firstOrCreate(['name' => 'conductor']);
        Role::firstOrCreate(['name' => 'colaborador']);
        Role::firstOrCreate(['name' => 'cliente']);
        Role::firstOrCreate(['name' => 'superadmin']);

        // Usuarios
        $conductor = User::firstOrCreate(
            ['email' => 'conductor@example.com'],
            ['name' => 'Carlos Conductor', 'password' => bcrypt('password')]
        );
        $conductor->assignRole('conductor');

        $colaborador = User::firstOrCreate(
            ['email' => 'colaborador@example.com'],
            ['name' => 'Ana Colaboradora', 'password' => bcrypt('password')]
        );
        $colaborador->assignRole('colaborador');

        $clienteUser = User::firstOrCreate(
            ['email' => 'cliente@example.com'],
            ['name' => 'Cliente Uno', 'password' => bcrypt('password')]
        );
        $clienteUser->assignRole('cliente');

        $superadmin = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            ['name' => 'Súper Admin', 'password' => bcrypt('password')]
        );
        $superadmin->assignRole('superadmin');

        // Cliente extendido
        $cliente = Cliente::firstOrCreate(
            ['user_id' => $clienteUser->id],
            [
                'razon_social' => 'Transportes Uno Ltda',
                'rut' => '76.543.210-1',
                'giro' => 'Transporte de carga',
                'direccion' => 'Av. Principal 123',
                'telefono' => '987654321',
            ]
        );

        // Vehículos
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

        // Destino y tarifa
        $destino = Destino::firstOrCreate([
            'nombre' => 'Puerto San Antonio',
            'region' => 'Valparaíso',
            'km' => 120
        ]);

        $tarifa = Tarifa::firstOrCreate([
            'destino_id' => $destino->id,
            'monto' => 250000,
            'tipo' => 'Reparto'
        ]);

        // Crear flete de prueba
        Flete::create([
            'conductor_id' => $conductor->id,
            'cliente_principal_id' => $cliente->id,
            'tracto_id' => $tracto->id,
            'rampla_id' => $rampla->id,
            'destino_id' => $destino->id,
            'tarifa_id' => $tarifa->id,
            'tipo' => 'Reparto',
            'km_ida' => 120,
            'rendimiento' => 3.5,
            'estado' => 'pendiente',
            'fecha_salida' => now()->subDays(2),
            'fecha_llegada' => now(),
        ]);

        // ✅ Llamar FleteSeeder adicional con 1000 fletes aleatorios
        $this->call(FleteSeeder::class);
    }
}
