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
        return [
            'user_id' => User::factory(), // se crea un usuario asociado
            'razon_social' => $this->faker->company,
            'rut' => $this->faker->unique()->bothify('##.###.###-#'),
            'giro' => 'Transporte',
            'direccion' => $this->faker->address,
            'telefono' => $this->faker->phoneNumber,
        ];
    }
}
