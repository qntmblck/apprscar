<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // PostgreSQL: soltar constraint CHECK existente, cambiar tipo a VARCHAR,
        // mapear valores viejos → nuevos, y agregar nuevo CHECK constraint.

        // 1. Quitar constraint CHECK anterior si existe
        DB::statement("ALTER TABLE fletes DROP CONSTRAINT IF EXISTS fletes_estado_check");

        // 2. Cambiar columna a VARCHAR para poder actualizar datos sin restricción
        DB::statement("ALTER TABLE fletes ALTER COLUMN estado TYPE VARCHAR(30)");
        DB::statement("ALTER TABLE fletes ALTER COLUMN estado SET DEFAULT 'En curso'");

        // 3. Mapear estados viejos → nuevos
        DB::statement("UPDATE fletes SET estado = 'En curso' WHERE estado IN ('Sin Notificar','Notificado','Activo')");
        DB::statement("UPDATE fletes SET estado = 'Rendido'  WHERE estado = 'Cerrado'");

        // 4. Agregar nuevo CHECK constraint con los 4 estados definitivos
        DB::statement("ALTER TABLE fletes ADD CONSTRAINT fletes_estado_check CHECK (estado IN ('En curso','Rendido','Aprobado','Pagado'))");

        // 5. Columna para registrar cuándo el superadmin solicitó la rendición al conductor
        Schema::table('fletes', function (Blueprint $table) {
            $table->timestamp('rendicion_solicitada_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('fletes', function (Blueprint $table) {
            $table->dropColumn('rendicion_solicitada_at');
        });

        DB::statement("ALTER TABLE fletes DROP CONSTRAINT IF EXISTS fletes_estado_check");
        DB::statement("ALTER TABLE fletes ALTER COLUMN estado TYPE VARCHAR(30)");
        DB::statement("ALTER TABLE fletes ALTER COLUMN estado SET DEFAULT 'Sin Notificar'");
        DB::statement("UPDATE fletes SET estado = 'Sin Notificar' WHERE estado = 'En curso'");
        DB::statement("UPDATE fletes SET estado = 'Cerrado'       WHERE estado IN ('Rendido','Aprobado','Pagado')");
        DB::statement("ALTER TABLE fletes ADD CONSTRAINT fletes_estado_check CHECK (estado IN ('Sin Notificar','Notificado','Activo','Cerrado'))");
    }
};
