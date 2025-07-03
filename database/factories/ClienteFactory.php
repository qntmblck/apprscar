<?php

namespace Database\Factories;

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Exception;

class ClienteFactory extends Factory
{
    /**
     * El modelo asociado.
     *
     * @var string
     */
    protected $model = Cliente::class;

    /**
     * Presets para clientes, exactamente los que aparecen en TarifaFactory.
     *
     * @var array<int, array<string, string>>
     */
    protected static array $presets = [
        ['razon_social' => 'Adquim',               'rut' => '77.100.000-1', 'direccion' => 'Av. Industrias 100',     'telefono' => '+56 9 7000 0001'],
        ['razon_social' => 'Ashley',               'rut' => '77.100.000-2', 'direccion' => 'Calle Comercio 200',     'telefono' => '+56 9 7000 0002'],
        ['razon_social' => 'Canontex',             'rut' => '76.543.211-0', 'direccion' => 'Pasaje Textil 2000',     'telefono' => '+56 9 1234 0010'],
        ['razon_social' => 'Particular',           'rut' => '77.100.000-3', 'direccion' => 'Calle Libre 300',        'telefono' => '+56 9 7000 0003'],
        ['razon_social' => 'Prisa',                'rut' => '76.543.211-1', 'direccion' => 'Av. Papel 456',          'telefono' => '+56 9 1234 0011'],
        ['razon_social' => 'Tecnopapel',           'rut' => '76.543.211-5', 'direccion' => 'Pasaje Papelera 888',    'telefono' => '+56 9 1234 0015'],
        ['razon_social' => 'e-Log',                'rut' => '77.100.000-4', 'direccion' => 'Av. Digital 400',        'telefono' => '+56 9 7000 0004'],
        ['razon_social' => 'Fruna',                'rut' => '76.543.210-6', 'direccion' => 'Av. Dulce 4321',         'telefono' => '+56 9 1234 0006'],
        ['razon_social' => 'Tottus',               'rut' => '76.543.210-8', 'direccion' => 'Av. Mercado 3030',       'telefono' => '+56 9 1234 0008'],
        ['razon_social' => 'Carrasco Crédito',     'rut' => '77.100.000-5', 'direccion' => 'Calle Financiera 500',   'telefono' => '+56 9 7000 0005'],
        ['razon_social' => 'Comercial Felp',       'rut' => '77.100.000-6', 'direccion' => 'Av. Comercio 600',       'telefono' => '+56 9 7000 0006'],
        ['razon_social' => 'Deco Mueble',          'rut' => '76.543.210-5', 'direccion' => 'Calle Diseño 789',       'telefono' => '+56 9 1234 0005'],
        ['razon_social' => 'Muebles San Sebastian','rut' => '77.100.000-7', 'direccion' => 'Av. Muebles 700',        'telefono' => '+56 9 7000 0007'],
        ['razon_social' => 'Ralo',                 'rut' => '77.100.000-8', 'direccion' => 'Calle Herramientas 800', 'telefono' => '+56 9 7000 0008'],
        ['razon_social' => 'Trans. Ortega',        'rut' => '77.100.000-9', 'direccion' => 'Pasaje Transporte 900',  'telefono' => '+56 9 7000 0009'],
        ['razon_social' => 'Trans. Huara',         'rut' => '77.100.001-0', 'direccion' => 'Av. Ruta 1000',          'telefono' => '+56 9 7010 0010'],
        ['razon_social' => 'Trans. Tapia',         'rut' => '77.100.001-1', 'direccion' => 'Calle Logística 1010',   'telefono' => '+56 9 7010 0011'],
        ['razon_social' => 'Fabian Uribe',         'rut' => '77.100.001-2', 'direccion' => 'Av. Profesional 1112',    'telefono' => '+56 9 7010 0012'],
        ['razon_social' => 'Ferreiro',             'rut' => '77.100.001-3', 'direccion' => 'Calle Síntesis 1314',    'telefono' => '+56 9 7010 0013'],
        ['razon_social' => 'Fibox',                'rut' => '76.543.210-7', 'direccion' => 'Bodega Norte 250',       'telefono' => '+56 9 1234 0007'],
        ['razon_social' => 'Geoprospec',           'rut' => '76.543.211-3', 'direccion' => 'Calle Geología 1414',    'telefono' => '+56 9 1234 0013'],
        ['razon_social' => 'Innova',               'rut' => '77.100.001-4', 'direccion' => 'Av. Innovación 1516',    'telefono' => '+56 9 7010 0014'],
        ['razon_social' => 'Marcelo Mondaca',      'rut' => '77.100.001-5', 'direccion' => 'Calle Experto 1718',     'telefono' => '+56 9 7010 0015'],
        ['razon_social' => 'Proxeso',              'rut' => '77.100.001-6', 'direccion' => 'Av. Procesos 1920',      'telefono' => '+56 9 7010 0016'],
        ['razon_social' => 'Prinorte',             'rut' => '77.100.001-7', 'direccion' => 'Av. Norte 2122',         'telefono' => '+56 9 7010 0017'],
    ];

    /**
     * Cantidad exacta de presets disponibles.
     */
    public const PRESET_COUNT = 25;

    /**
     * Índice interno para recorrer presets.
     *
     * @var int
     */
    protected static int $index = 0;

    /**
     * Define el estado por defecto del factory.
     *
     * @return array<string,mixed>
     * @throws Exception
     */
    public function definition(): array
    {
        if (static::$index >= self::PRESET_COUNT) {
            throw new Exception(
                'No quedan clientes únicos disponibles en ClienteFactory. '
                . 'Agrega más presets o revisa los existentes.'
            );
        }

        $preset = self::$presets[static::$index++];

        // Crear usuario asociado al cliente sin usar UserFactory
        $user = User::create([
            'name'              => $preset['razon_social'] . ' S.A.',
            'email'             => Str::slug($preset['razon_social'], '') . '@cliente.cl',
            'email_verified_at' => now(),
            'password'          => Hash::make('password'),
            'remember_token'    => Str::random(10),
            'estado'            => 'Activo',
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
