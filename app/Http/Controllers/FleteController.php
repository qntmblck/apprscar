<?php
// app/Http/Controllers/FleteController.php
public function index(Request $request)
{
    $user = auth()->user();

    $query = Flete::query()->with(['cliente', 'conductor', 'tracto', 'rampla']);

    // Filtrar según rol
    if ($user->hasRole('conductor')) {
        $query->where('conductor_id', $user->id);
    } elseif ($user->hasRole('cliente')) {
        $query->where('cliente_principal_id', $user->cliente_id);
    }

    // Aplicar filtros (desde formulario frontend)
    if ($request->filled('conductor')) {
        $query->whereHas('conductor', fn($q) => $q->where('name', 'like', "%{$request->conductor}%"));
    }

    if ($request->filled('cliente')) {
        $query->whereHas('cliente', fn($q) => $q->where('nombre', 'like', "%{$request->cliente}%"));
    }

    if ($request->filled('patente')) {
        $query->whereHas('tracto', fn($q) => $q->where('patente', 'like', "%{$request->patente}%"));
    }

    return inertia('Fletes/Index', [
        'fletes' => $query->latest()->get(),
        'role' => $user->getRoleNames()->first(),
        'filters' => $request->only('conductor', 'cliente', 'patente'),
    ]);
}
