<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controladores generales
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\ContactoController;
use App\Http\Controllers\RoleRedirectController;

// Dashboards por rol
use App\Http\Controllers\SuperDashboardController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ClienteDashboardController;
use App\Http\Controllers\ConductorDashboardController;
use App\Http\Controllers\ColaboradorDashboardController;

// Usuarios (gestión de roles)
use App\Http\Controllers\UserController;

// Página de inicio
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard general (por si es necesario)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Perfil de usuario autenticado
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Contacto
Route::get('/contacto', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::post('/contacto/cliente', [ContactoController::class, 'cliente'])->name('contacto.cliente');
Route::post('/contacto/transportista', [ContactoController::class, 'transportista'])->name('contacto.transportista');

// Google OAuth
Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

// Redirección por rol
Route::get('/redirect-by-role', RoleRedirectController::class)->middleware('auth');

// Dashboard por rol
Route::middleware(['auth', 'role:superadmin'])->get('/super/dashboard', [SuperDashboardController::class, 'index']);
Route::middleware(['auth', 'role:admin'])->get('/admin/dashboard', [AdminDashboardController::class, 'index']);
Route::middleware(['auth', 'role:cliente'])->get('/cliente/dashboard', [ClienteDashboardController::class, 'index']);
Route::middleware(['auth', 'role:conductor'])->get('/conductor/dashboard', [ConductorDashboardController::class, 'index']);
Route::middleware(['auth', 'role:colaborador'])->get('/colaborador/dashboard', [ColaboradorDashboardController::class, 'index']);

// Rutas de gestión de usuarios y roles (solo superadmin)
Route::middleware(['auth', 'role:superadmin'])->group(function () {
    Route::get('/usuarios', [UserController::class, 'index'])->name('usuarios.index');
    Route::post('/usuarios/{user}/role', [UserController::class, 'updateRole'])->name('usuarios.updateRole');
    Route::delete('/usuarios/{user}/role', [UserController::class, 'removeRole'])->name('usuarios.removeRole');
});

// Rutas de autenticación estándar (login, register, etc.)
require __DIR__.'/auth.php';
