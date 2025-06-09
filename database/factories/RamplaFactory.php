<?php

namespace Database\Factories;

use App\Models\Rampla;
use Illuminate\Database\Eloquent\Factories\Factory;

class RamplaFactory extends Factory
{
    protected $model = Rampla::class;

    public function definition(): array
{
    $presets = [
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

    static $index = 0;

    if ($index >= count($presets)) {
        throw new \Exception('No quedan patentes únicas disponibles en RamplaFactory. Agrega más presets.');
    }

    $choice = $presets[$index++];

    return [
        'patente'      => $choice['patente'],
        'tipo'         => $choice['tipo'],
        'marca'        => $choice['marca'],
        'modelo'       => $choice['modelo'],
        'capacidad'    => $choice['capacidad'],
        'longitud'     => $choice['longitud'],
        'kilometraje'  => $this->faker->numberBetween(0, 200000),
        'estado'       => $this->faker->randomElement(['Activo', 'Inactivo']),
    ];
}

}
