<?php

namespace Database\Factories;

use App\Models\Tracto;
use Illuminate\Database\Eloquent\Factories\Factory;
use Exception;

class TractoFactory extends Factory
{
    protected $model = Tracto::class;

    /** @var array<int, array<string, mixed>> */
    protected static array $presets = [
        ['patente' => 'SBXT-68', 'marca' => 'SCANIA', 'modelo' => 'R540A8X2', 'anio' => 2022, 'color' => 'BLANCO'],
        ['patente' => 'SVRC-71', 'marca' => 'SCANIA', 'modelo' => 'R500A',    'anio' => 2021, 'color' => 'ROJO'],
        ['patente' => 'RRVH-50', 'marca' => 'SCANIA', 'modelo' => 'R500A',    'anio' => 2021, 'color' => 'AZUL'],
        ['patente' => 'HKFH-19', 'marca' => 'VOLVO',  'modelo' => 'FH',       'anio' => 2020, 'color' => 'AZUL'],
        ['patente' => 'HKFH-20', 'marca' => 'VOLVO',  'modelo' => 'FH',       'anio' => 2020, 'color' => 'AZUL'],
        ['patente' => 'WH8466',  'marca' => 'VOLVO',  'modelo' => 'FH 12',    'anio' => 2019, 'color' => 'BLANCO'],
        ['patente' => 'GKPK-86', 'marca' => 'SCANIA', 'modelo' => 'G410',     'anio' => 2023, 'color' => 'GRIS'],
    ];

    protected static int $index = 0;

    public const PRESET_COUNT = 7;

    /**
     * Devuelve la cantidad de presets.
     */
    public static function presetCount(): int
    {
        return self::PRESET_COUNT;
    }

    /**
     * Reinicia el índice interno.
     */
    public static function resetIndex(): void
    {
        static::$index = 0;
    }

    /**
     * @return array<string, mixed>
     * @throws Exception
     */
    public function definition(): array
    {
        if (static::$index >= self::PRESET_COUNT) {
            throw new Exception('No quedan tractos únicos disponibles en TractoFactory. Agrega más presets.');
        }

        $choice = self::$presets[static::$index++];

        return [
            'patente'     => $choice['patente'],
            'marca'       => $choice['marca'],
            'modelo'      => $choice['modelo'],
            'anio'        => $choice['anio'],
            'color'       => $choice['color'],
            'kilometraje' => $this->faker->numberBetween(10_000, 800_000),
            'estado'      => $this->faker->randomElement(['Activo', 'Inactivo']),
        ];
    }
}
