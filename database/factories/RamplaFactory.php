<?php

namespace Database\Factories;

use App\Models\Rampla;
use Illuminate\Database\Eloquent\Factories\Factory;

class RamplaFactory extends Factory
{
    /**
     * El model asociado
     *
     * @var string
     */
    protected $model = Rampla::class;

    /**
     * Presets para ramplas
     *
     * @var array<int, array<string, mixed>>
     */
    protected static array $presets = [
        ['patente' => 'JB-5050',   'tipo' => 'Semirremolque', 'marca' => 'Utility',    'modelo' => '3000R',        'capacidad' => 28.0, 'longitud' => 13.6],
        ['patente' => 'JE-5212-5', 'tipo' => 'Semirremolque', 'marca' => 'Great Dane', 'modelo' => '48 PIES',      'capacidad' => 27.0, 'longitud' => 14.6],
        ['patente' => 'JB-5065-K', 'tipo' => 'Semirremolque', 'marca' => 'Wabash',     'modelo' => 'Duraplate',    'capacidad' => 28.0, 'longitud' => 13.7],
        ['patente' => 'JB-6590-8', 'tipo' => 'Semirremolque', 'marca' => 'Great Dane', 'modelo' => 'Super Seal',   'capacidad' => 28.0, 'longitud' => 13.7],
        ['patente' => 'JB-6591-6', 'tipo' => 'Semirremolque', 'marca' => 'Great Dane', 'modelo' => 'Super Seal',   'capacidad' => 28.0, 'longitud' => 13.7],
        ['patente' => 'JB-5063-3', 'tipo' => 'Semirremolque', 'marca' => 'Dorsey',     'modelo' => 'DFVPTE',       'capacidad' => 27.0, 'longitud' => 13.6],
        ['patente' => 'JB-4893',   'tipo' => 'Remolque',      'marca' => 'Goren',      'modelo' => '18 Toneladas', 'capacidad' => 18.0, 'longitud' => 10.0],
        ['patente' => 'JB5064',    'tipo' => 'Semirremolque', 'marca' => 'Wabash',     'modelo' => 'Duraplate',    'capacidad' => 28.0, 'longitud' => 13.7],
        ['patente' => 'JD9302',    'tipo' => 'Semirremolque', 'marca' => 'Great Dane', 'modelo' => '744TJWLA',     'capacidad' => 27.0, 'longitud' => 13.7],
        ['patente' => 'HXFC64',    'tipo' => 'Remolque',      'marca' => 'Randon',     'modelo' => 'RQ PTCS 0216','capacidad' => 22.0, 'longitud' => 12.5],
        ['patente' => 'JWPJ-49',   'tipo' => 'Semirremolque', 'marca' => 'Randon',     'modelo' => 'SRT PTCS 0330','capacidad' => 28.0, 'longitud' => 13.5],
    ];

    /**
     * Número exacto de presets disponibles
     */
    public const PRESET_COUNT = 11;

    /**
     * Índice interno para recorrer presets
     *
     * @var int
     */
    protected static int $index = 0;

    /**
     * Define la generación de datos per-ofacto
     *
     * @return array<string, mixed>
     * @throws \Exception
     */
    public function definition(): array
    {
        if (static::$index >= self::PRESET_COUNT) {
            throw new \Exception('No quedan patentes únicas disponibles en RamplaFactory. Agrega más presets.');
        }

        $choice = self::$presets[static::$index++];

        return [
            'patente'     => $choice['patente'],
            'tipo'        => $choice['tipo'],
            'marca'       => $choice['marca'],
            'modelo'      => $choice['modelo'],
            'capacidad'   => $choice['capacidad'],
            'longitud'    => $choice['longitud'],
            'kilometraje' => $this->faker->numberBetween(0, 200000),
            'estado'      => $this->faker->randomElement(['Activo', 'Inactivo']),
        ];
    }
}
