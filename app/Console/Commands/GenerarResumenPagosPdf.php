<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Flete;
use Barryvdh\Snappy\Facades\SnappyPdf as PDF;

class GenerarResumenPagosPdf extends Command
{
    protected $signature = 'pdf:resumen-pagos {conductor_id} {periodo}';
    protected $description = 'Genera un PDF de resumen de pagos para un conductor en un periodo específico';

    public function handle()
    {
        $conductorId = $this->argument('conductor_id');
        $periodo = $this->argument('periodo');

        $conductor = User::findOrFail($conductorId);
        $fletes = Flete::with('cliente', 'destino', 'rendicion')
            ->where('conductor_id', $conductorId)
            ->whereHas('rendicion', fn($q) => $q->where('periodo', $periodo)->where('pagado', true))
            ->get();

        if ($fletes->isEmpty()) {
            $this->error('No hay fletes pagados en ese periodo.');
            return 1;
        }

        $totales = [
            'diesel' => 0,
            'gastos' => 0,
            'viatico' => 0,
            'saldo' => 0,
            'comision' => 0,
            'comision_total' => 0,
        ];

        foreach ($fletes as $flete) {
            $r = $flete->rendicion;
            $totales['diesel'] += $r->total_diesel ?? 0;
            $totales['gastos'] += $r->total_gastos ?? 0;
            $totales['viatico'] += $r->viatico ?? 0;
            $totales['saldo'] += $r->saldo ?? 0;
            $totales['comision'] += $r->comision ?? 0;
            $totales['comision_total'] += ($r->comision ?? 0) + ($r->saldo ?? 0);
        }

        $pdf = PDF::loadView('pdf.resumen_pagos', [
            'fletes' => $fletes,
            'conductor' => $conductor,
            'periodo' => $periodo,
            'totales' => $totales,
            'anticipo' => 0,
            'saldo_anterior' => 0,
        ])->setPaper('a4');

        $filename = "resumen_pagos_{$conductor->id}_{$periodo}.pdf";
        $pdf->save(storage_path("app/public/{$filename}"));

        $this->info("✅ PDF generado exitosamente: storage/app/public/{$filename}");
        return 0;
    }
}
