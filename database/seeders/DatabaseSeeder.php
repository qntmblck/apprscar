<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear el rol superadmin si no existe
        $superadminRole = Role::firstOrCreate(['name' => 'superadmin']);

        // Crear el usuario superadmin si no existe
        $superadmin = User::firstOrCreate(
            ['email' => 'jcomeaux@ug.uchile.cl'],
            [
                'name' => 'Super Administrador',
                'password' => Hash::make('superadmin1234'), // Cambia esta contraseña en producción
            ]
        );

        // Asignar el rol superadmin al usuario
        if (!$superadmin->hasRole('superadmin')) {
            $superadmin->assignRole($superadminRole);
        }

        // Si quieres eliminar la creación de usuarios de prueba, puedes borrar o comentar esto:
        /*
        User::factory(10)->create();
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        */
    }
}
