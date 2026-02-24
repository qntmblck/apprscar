<?php

namespace App\Http\Controllers;

use App\Models\SolicitudColaborador;
use Illuminate\Http\Request;

class SolicitudColaboradorController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:150',
            'contact_name' => 'required|string|max:120',
            'email' => 'required|email|max:120',
            'phone' => 'required|string|max:20',
            'fleet_size' => 'nullable|string|max:50',
            'fleet_types' => 'nullable|string|max:200',
            'coverage' => 'nullable|string|max:200',
            'message' => 'required|string|max:1500',
        ]);

        SolicitudColaborador::create([
            'user_id' => auth()->id(),
            'company_name' => $validated['company_name'],
            'contact_name' => $validated['contact_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'fleet_size' => $validated['fleet_size'] ?? null,
            'fleet_types' => $validated['fleet_types'] ?? null,
            'coverage' => $validated['coverage'] ?? null,
            'message' => $validated['message'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Solicitud enviada correctamente.');
    }
}
