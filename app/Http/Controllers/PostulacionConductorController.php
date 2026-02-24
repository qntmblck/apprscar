<?php

namespace App\Http\Controllers;

use App\Models\PostulacionConductor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostulacionConductorController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'phone' => 'required|string|max:20',
            'city' => 'required|string|max:100',
            'license_type' => 'required|string|max:20',
            'experience_years' => 'required|integer|min:0',
            'cv_file' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'notes' => 'nullable|string|max:1000',
        ]);

        $cvPath = null;

        if ($request->hasFile('cv_file')) {
            $cvPath = $request->file('cv_file')->store('postulaciones_conductor/cv', 'public');
        }

        PostulacionConductor::create([
            'user_id' => auth()->id(),
            'phone' => $validated['phone'],
            'city' => $validated['city'],
            'license_type' => $validated['license_type'],
            'experience_years' => $validated['experience_years'],
            'cv_path' => $cvPath,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Postulación enviada correctamente.');
    }
}
