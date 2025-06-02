#!/bin/bash

BACKUP_PATH="../appscar-backup"

echo "📦 Copiando migraciones..."
cp -R $BACKUP_PATH/database/migrations/* database/migrations/

echo "📦 Copiando modelos..."
cp -R $BACKUP_PATH/app/Models/* app/Models/

echo "📦 Copiando controladores..."
cp -R $BACKUP_PATH/app/Http/Controllers/* app/Http/Controllers/

echo "📦 Copiando rutas..."
cp $BACKUP_PATH/routes/web.php routes/web.php
cp $BACKUP_PATH/routes/api.php routes/api.php

echo "📦 Copiando vista Fletes/Index..."
mkdir -p resources/js/Pages/Fletes
cp $BACKUP_PATH/resources/js/Pages/Fletes/Index.jsx resources/js/Pages/Fletes/Index.jsx

echo "📦 Copiando formularios de Fletes..."
mkdir -p resources/js/Pages/Fletes/Forms
cp $BACKUP_PATH/resources/js/Pages/Fletes/Forms/DieselForm.jsx resources/js/Pages/Fletes/Forms/DieselForm.jsx
cp $BACKUP_PATH/resources/js/Pages/Fletes/Forms/GastoForm.jsx resources/js/Pages/Fletes/Forms/GastoForm.jsx
cp $BACKUP_PATH/resources/js/Pages/Fletes/Forms/FinalizarForm.jsx resources/js/Pages/Fletes/Forms/FinalizarForm.jsx

echo "📦 Copiando FleteSeeder..."
cp $BACKUP_PATH/database/seeders/FleteSeeder.php database/seeders/FleteSeeder.php

echo "📦 Actualizando DatabaseSeeder para usar FleteSeeder..."
cat <<EOL > database/seeders/DatabaseSeeder.php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        \$this->call([
            FleteSeeder::class,
        ]);
    }
}
EOL

echo "🧹 Limpiando migraciones duplicadas..."

cd database/migrations || exit

# Lista de migraciones que se deben conservar (una por tabla)
keep=(
  create_users_table
  create_cache_table
  create_jobs_table
  create_permission_tables
  add_google_id_to_users_table
  create_tractos_table
  create_ramplas_table
  create_destinos_table
  create_tarifas_table
  create_clientes_table
  create_fletes_table
  create_rendiciones_table
  create_gastos_table
  create_diesels_table
  create_retornos_table
  create_mantenciones_table
  create_documentos_table
  create_agendas_table
)

for name in "${keep[@]}"; do
  matches=($(ls *"$name"*.php 2>/dev/null))
  if [ "${#matches[@]}" -gt 1 ]; then
    for ((i=1; i<${#matches[@]}; i++)); do
      echo "🗑 Eliminando duplicado: ${matches[i]}"
      rm "${matches[i]}"
    done
  fi
done

cd ../..

echo "🚀 Ejecutando migraciones y seeder..."
php artisan migrate:fresh --seed

echo "✅ Restauración completa. Proyecto operativo con datos y sin migraciones duplicadas."
