<?php

namespace App\Observers;

use App\Models\Flete;
use App\Models\Rendicion;

class FleteObserver
{
    public function updated(Flete $flete)
    {
        // Crear rendición si no existe y tiene conductor asignado
        if ($flete->isDirty('conductor_id') && $flete->conductor_id && !$flete->rendicion) {
            Rendicion::create([
                'flete_id' => $flete->id,
                'user_id' => $flete->conductor_id,
                'caja_flete' => 0,
                'viatico_efectivo' => 0,
                'estado' => 'pendiente',
            ]);
        }
    }
}
