<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class RamplaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'patente' => strtoupper($this->faker->bothify('??##??')),
            'tipo' => $this->faker->randomElement(['Plana', 'Baranda', 'Cerrada']),
            'marca' => $this->faker->company,
            'capacidad' => $this->faker->randomFloat(2, 10, 30), // toneladas
            'longitud' => $this->faker->randomFloat(2, 10, 20), // metros
        ];
    }
}
