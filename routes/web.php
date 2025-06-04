<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\ContactoController;
use App\Http\Controllers\RoleRedirectController;
use App\Http\Controllers\SuperDashboardController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ClienteDashboardController;
use App\Http\Controllers\ConductorDashboardController;
use App\Http\Controllers\ColaboradorDashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FleteController;
use App\Http\Controllers\FleteConductorController;
use App\Http\Controllers\DieselController;
use App\Http\Controllers\GastoController;
use Spatie\Permission\Models\Role;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->middleware(['auth', 'verified'])->name('dashboard');

// Perfil
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Contacto
Route::get('/contacto', fn () => Inertia::render('Contact'))->name('contact');
Route::post('/contacto/cliente', [ContactoController::class, 'cliente'])->name('contacto.cliente');
Route::post('/contacto/transportista', [ContactoController::class, 'transportista'])->name('contacto.transportista');

// Google Auth
Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

// Redirección por rol
Route::get('/redirect-by-role', RoleRedirectController::class)->middleware('auth');

// Dashboards por rol
Route::middleware(['auth', 'role:superadmin'])->get('/super/dashboard', [SuperDashboardController::class, 'index']);
Route::middleware(['auth', 'role:admin'])->get('/admin/dashboard', [AdminDashboardController::class, 'index']);
Route::middleware(['auth', 'role:cliente'])->get('/cliente/dashboard', [ClienteDashboardController::class, 'index']);
Route::middleware(['auth', 'role:conductor'])->get('/conductor/dashboard', [ConductorDashboardController::class, 'index']);
Route::middleware(['auth', 'role:colaborador'])->get('/colaborador/dashboard', [ColaboradorDashboardController::class, 'index']);

// Usuarios (solo superadmin)
Route::middleware(['auth', 'role:superadmin'])->group(function () {
    Route::get('/usuarios', [UserController::class, 'index'])->name('usuarios.index');
    Route::post('/usuarios/{user}/role', [UserController::class, 'updateRole'])->name('usuarios.updateRole');
    Route::delete('/usuarios/{user}/role', [UserController::class, 'removeRole'])->name('usuarios.removeRole');
});

// Fletes (todos los roles según permisos)
Route::middleware(['auth'])->group(function () {
    // Vista principal de fletes (superadmin, admin, colaborador, cliente)
    Route::middleware(['role:superadmin|admin|colaborador|cliente'])->get('/fletes', [FleteController::class, 'index'])->name('fletes.index');

    // Vista personalizada para conductor
    Route::middleware(['role:conductor'])->prefix('conductor')->group(function () {
        Route::get('/fletes', [FleteConductorController::class, 'index'])->name('conductor.fletes.index');
    });

    // Crear flete (superadmin y admin)
    Route::middleware(['role:superadmin|admin'])->post('/fletes', [FleteController::class, 'store'])->name('fletes.store');

    // Formularios: diesel, gasto, finalizar, viático
    Route::post('/diesel', [DieselController::class, 'store'])->name('diesel.store');
    Route::post('/gasto', [GastoController::class, 'store'])->name('gasto.store');
    Route::post('/fletes/finalizar', [FleteController::class, 'finalizar'])->name('fletes.finalizar');
    Route::post('/rendicion/{id}/viatico', [FleteController::class, 'registrarViatico'])->name('rendicion.viatico');
});

// Activar superadmin manualmente
Route::middleware(['auth', 'verified'])->post('/make-superadmin', function () {
    $user = auth()->user();

    if ($user->hasRole('superadmin')) {
        return back()->with('info', '¡Ya eres superadmin!');
    }

    $role = Role::firstOrCreate(['name' => 'superadmin']);
    $user->assignRole($role);

    return back()->with('success', '¡Ahora eres superadmin!');
})->name('make-superadmin');

require __DIR__.'/auth.php';
