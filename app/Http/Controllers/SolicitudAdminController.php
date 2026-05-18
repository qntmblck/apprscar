<?php

namespace App\Http\Controllers;

use App\Models\PostulacionConductor;
use App\Models\SolicitudColaborador;
use App\Models\SolicitudTransporte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SolicitudAdminController extends Controller
{
    public function updateTransporte(Request $request, int $id)
    {
        $request->validate(['status' => 'required|in:approved,rejected', 'admin_notes' => 'nullable|string|max:500']);

        $solicitud = SolicitudTransporte::with('user')->findOrFail($id);
        $solicitud->update([
            'status'      => $request->status,
            'admin_notes' => $request->admin_notes,
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        $this->sendNotification($solicitud->user, $solicitud, 'transporte');

        return back()->with('success', 'Solicitud de transporte ' . ($request->status === 'approved' ? 'aprobada' : 'rechazada') . '.');
    }

    public function updateConductor(Request $request, int $id)
    {
        $request->validate(['status' => 'required|in:approved,rejected', 'admin_notes' => 'nullable|string|max:500']);

        $solicitud = PostulacionConductor::with('user')->findOrFail($id);
        $solicitud->update([
            'status'      => $request->status,
            'admin_notes' => $request->admin_notes,
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        $this->sendNotification($solicitud->user, $solicitud, 'conductor');

        return back()->with('success', 'Postulación ' . ($request->status === 'approved' ? 'aprobada' : 'rechazada') . '.');
    }

    public function updateColaborador(Request $request, int $id)
    {
        $request->validate(['status' => 'required|in:approved,rejected', 'admin_notes' => 'nullable|string|max:500']);

        $solicitud = SolicitudColaborador::with('user')->findOrFail($id);
        $solicitud->update([
            'status'      => $request->status,
            'admin_notes' => $request->admin_notes,
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        $this->sendNotification($solicitud->user, $solicitud, 'colaborador');

        return back()->with('success', 'Solicitud de colaborador ' . ($request->status === 'approved' ? 'aprobada' : 'rechazada') . '.');
    }

    private function sendNotification($user, $solicitud, string $tipo): void
    {
        if (! $user) return;

        $email     = $user->email;
        $nombre    = $user->name;
        $aprobado  = $solicitud->status === 'approved';
        $nota      = $solicitud->admin_notes ?? '';

        $labels = [
            'transporte'  => 'solicitud de transporte',
            'conductor'   => 'postulación como conductor',
            'colaborador' => 'solicitud de integración de flota',
        ];

        $tipoLabel = $labels[$tipo] ?? 'solicitud';
        $asunto    = $aprobado
            ? "✅ Tu {$tipoLabel} fue aprobada — Transportes SCAR"
            : "❌ Tu {$tipoLabel} fue revisada — Transportes SCAR";

        $cuerpo = $aprobado
            ? "Hola {$nombre},\n\nNos complace informarte que tu {$tipoLabel} ha sido aprobada por nuestro equipo.\n\n"
            . ($nota ? "Nota del equipo: {$nota}\n\n" : '')
            . "Pronto nos pondremos en contacto contigo para coordinar los próximos pasos.\n\nSaludos,\nEquipo Transportes SCAR"
            : "Hola {$nombre},\n\nHemos revisado tu {$tipoLabel} y lamentablemente no podemos continuar en esta oportunidad.\n\n"
            . ($nota ? "Comentario: {$nota}\n\n" : '')
            . "Puedes volver a postular en el futuro o contactarnos en contacto@scartransportes.cl\n\nSaludos,\nEquipo Transportes SCAR";

        try {
            Mail::raw($cuerpo, function ($message) use ($email, $asunto) {
                $message->to($email)
                        ->subject($asunto)
                        ->from(config('mail.from.address'), 'Transportes SCAR');
            });
        } catch (\Throwable $e) {
            Log::error('Error enviando notificación de solicitud', ['error' => $e->getMessage(), 'email' => $email]);
        }
    }
}
