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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/contacto', fn () => Inertia::render('Contact'))->name('contact');
Route::post('/contacto/cliente', [ContactoController::class, 'cliente'])->name('contacto.cliente');
Route::post('/contacto/transportista', [ContactoController::class, 'transportista'])->name('contacto.transportista');

Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

Route::get('/redirect-by-role', RoleRedirectController::class)->middleware('auth');

Route::middleware(['auth', 'role:superadmin'])->get('/super/dashboard', [SuperDashboardController::class, 'index']);
Route::middleware(['auth', 'role:admin'])->get('/admin/dashboard', [AdminDashboardController::class, 'index']);
Route::middleware(['auth', 'role:cliente'])->get('/cliente/dashboard', [ClienteDashboardController::class, 'index']);
Route::middleware(['auth', 'role:conductor'])->get('/conductor/dashboard', [ConductorDashboardController::class, 'index']);
Route::middleware(['auth', 'role:colaborador'])->get('/colaborador/dashboard', [ColaboradorDashboardController::class, 'index']);

Route::middleware(['auth', 'role:superadmin'])->group(function () {
    Route::get('/usuarios', [UserController::class, 'index'])->name('usuarios.index');
    Route::post('/usuarios/{user}/role', [UserController::class, 'updateRole'])->name('usuarios.updateRole');
    Route::delete('/usuarios/{user}/role', [UserController::class, 'removeRole'])->name('usuarios.removeRole');
});

Route::middleware(['auth', 'role:superadmin|admin|conductor|colaborador|cliente'])->get('/fletes', [FleteController::class, 'index'])->name('fletes.index');

Route::middleware(['auth'])->group(function () {
    Route::post('/diesel', [DieselController::class, 'store'])->name('diesel.store');
    Route::post('/gasto', [GastoController::class, 'store'])->name('gasto.store');
    Route::post('/fletes/finalizar', [FleteController::class, 'finalizar'])->name('fletes.finalizar');
});

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

// Registrar Diesel
Route::middleware('auth')->post('/diesel', [App\Http\Controllers\DieselController::class, 'store'])->name('diesel.store');

// Registrar Diesel
Route::middleware('auth')->post('/diesel', [App\Http\Controllers\DieselController::class, 'store'])->name('diesel.store');
