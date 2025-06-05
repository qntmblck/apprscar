<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TractoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'patente' => $this->faker->unique()->bothify('??##??'),
            'marca' => $this->faker->randomElement(['Scania', 'Volvo', 'Mercedes-Benz']),
            'modelo' => $this->faker->word,
            'anio' => $this->faker->year,
            'kilometraje' => $this->faker->numberBetween(50000, 700000), // Agregado
        ];
    }
}
