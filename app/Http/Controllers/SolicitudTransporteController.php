<?php

namespace App\Http\Controllers;

use App\Models\SolicitudTransporte;
use Illuminate\Http\Request;

class SolicitudTransporteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'origin' => 'required|string|max:150',
            'destination' => 'required|string|max:150',
            'cargo_type' => 'required|string|max:100',
            'cargo_weight_kg' => 'nullable|integer|min:0',
            'pickup_date' => 'nullable|date',
            'description' => 'nullable|string|max:1500',
            'contact_phone' => 'required|string|max:20',
            'contact_email' => 'required|email|max:120',
        ]);

        SolicitudTransporte::create([
            'user_id' => auth()->id(),
            'origin' => $validated['origin'],
            'destination' => $validated['destination'],
            'cargo_type' => $validated['cargo_type'],
            'cargo_weight_kg' => $validated['cargo_weight_kg'] ?? null,
            'pickup_date' => $validated['pickup_date'] ?? null,
            'description' => $validated['description'] ?? null,
            'contact_phone' => $validated['contact_phone'],
            'contact_email' => $validated['contact_email'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Solicitud enviada correctamente.');
    }
}

