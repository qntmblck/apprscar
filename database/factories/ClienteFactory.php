<?php

namespace Database\Factories;

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClienteFactory extends Factory
{
    protected $model = Cliente::class;

    public function definition(): array
    {
        $presets = [
    ['razon_social' => 'Latam',         'rut' => '76.543.210-1', 'direccion' => 'Av. Aeropuerto 1000',       'telefono' => '+56 9 1234 0001'],
    ['razon_social' => 'Essity',        'rut' => '76.543.210-2', 'direccion' => 'Camino Industriales 2020',  'telefono' => '+56 9 1234 0002'],
    ['razon_social' => 'Ripley',        'rut' => '76.543.210-3', 'direccion' => 'Av. Costanera 1234',        'telefono' => '+56 9 1234 0003'],
    ['razon_social' => 'Walmart',       'rut' => '76.543.210-4', 'direccion' => 'Av. Central 5555',          'telefono' => '+56 9 1234 0004'],
    ['razon_social' => 'Deco Muebles',  'rut' => '76.543.210-5', 'direccion' => 'Calle Diseño 789',          'telefono' => '+56 9 1234 0005'],
    ['razon_social' => 'Fruna',         'rut' => '76.543.210-6', 'direccion' => 'Av. Dulce 4321',            'telefono' => '+56 9 1234 0006'],
    ['razon_social' => 'Fibox',         'rut' => '76.543.210-7', 'direccion' => 'Bodega Norte 250',          'telefono' => '+56 9 1234 0007'],
    ['razon_social' => 'Tottus',        'rut' => '76.543.210-8', 'direccion' => 'Av. Mercado 3030',          'telefono' => '+56 9 1234 0008'],
    ['razon_social' => 'Falabella',     'rut' => '76.543.210-9', 'direccion' => 'Centro Comercial 100',      'telefono' => '+56 9 1234 0009'],
    ['razon_social' => 'Canontex',      'rut' => '76.543.211-0', 'direccion' => 'Pasaje Textil 2000',        'telefono' => '+56 9 1234 0010'],
    ['razon_social' => 'Prisa',         'rut' => '76.543.211-1', 'direccion' => 'Av. Papel 456',             'telefono' => '+56 9 1234 0011'],
    ['razon_social' => 'Paris',         'rut' => '76.543.211-2', 'direccion' => 'Av. Tienda 2222',           'telefono' => '+56 9 1234 0012'],
    ['razon_social' => 'Geoprospec',    'rut' => '76.543.211-3', 'direccion' => 'Calle Geología 1414',       'telefono' => '+56 9 1234 0013'],
    ['razon_social' => 'Construmart',   'rut' => '76.543.211-4', 'direccion' => 'Camino Construcción 300',   'telefono' => '+56 9 1234 0014'],
    ['razon_social' => 'Tecnopapel',    'rut' => '76.543.211-5', 'direccion' => 'Pasaje Papelera 888',       'telefono' => '+56 9 1234 0015'],
];


        static $index = 0;

        if ($index >= count($presets)) {
            throw new \Exception('No quedan clientes únicos disponibles en ClienteFactory. Agrega más presets.');
        }

        $preset = $presets[$index++];

        // Crear usuario asociado al cliente
        $user = User::factory()->create([
            'name' => $preset['razon_social'] . ' S.A.',
            'email' => strtolower(str_replace(' ', '', $preset['razon_social'])) . '@cliente.cl',
            'estado' => 'Activo',
        ]);
        $user->assignRole('cliente');

        return [
            'user_id'      => $user->id,
            'razon_social' => $preset['razon_social'],
            'rut'          => $preset['rut'],
            'giro'         => 'Transporte',
            'direccion'    => $preset['direccion'],
            'telefono'     => $preset['telefono'],
        ];
    }
}
