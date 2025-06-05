<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DestinoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->city,
            'region' => $this->faker->state,
            'km' => $this->faker->numberBetween(50, 2000), // ✅ km requerido
        ];
    }
}
