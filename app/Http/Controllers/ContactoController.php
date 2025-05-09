<?php

namespace App\Http\Controllers;

use App\Mail\ContactoClienteMail;
use App\Mail\ContactoTransportistaMail;
use App\Mail\ConfirmacionClienteMail;
use App\Mail\ConfirmacionTransportistaMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactoController extends Controller
{
    public function cliente(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:60',
            'last_name' => 'required|string|max:60',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string|max:1000',
        ]);

        // Envío al equipo SCAR
        Mail::to('contacto@scartransportes.cl')->send(new ContactoClienteMail($validated));

        // Envío al cliente con mensaje personalizado
        Mail::to($validated['email'])->send(new ConfirmacionClienteMail($validated));

        return back()->with('success', 'Tu mensaje ha sido enviado correctamente.');
    }

    public function transportista(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:60',
            'apellido' => 'required|string|max:60',
            'email' => 'required|email',
            'telefono' => 'nullable|string|max:20',
            'mensaje' => 'required|string|max:1000',
        ]);

        // Envío al equipo SCAR
        Mail::to('contacto@scartransportes.cl')->send(new ContactoTransportistaMail($validated));

        // Envío al transportista con mensaje personalizado
        Mail::to($validated['email'])->send(new ConfirmacionTransportistaMail($validated));

        return back()->with('success', 'Solicitud enviada correctamente.');
    }
}
