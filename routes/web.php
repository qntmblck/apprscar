<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\ProfileController;
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
use App\Http\Controllers\FleteBatchController;
use App\Http\Controllers\RegistroController;

// Página principal
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

// Dashboard general
Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Perfil de usuario
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Contacto
Route::get('/contacto', fn () => Inertia::render('Contact'))->name('contact');
Route::post('/contacto/cliente', [ContactoController::class, 'cliente'])->name('contacto.cliente');
Route::post('/contacto/transportista', [ContactoController::class, 'transportista'])->name('contacto.transportista');

// Autenticación con Google
Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

// Redirección por rol
Route::get('/redirect-by-role', RoleRedirectController::class)->middleware('auth');

// Dashboards por rol
Route::middleware(['auth'])->group(function () {
    Route::get('/super/dashboard',       [SuperDashboardController::class, 'index'])->middleware('role:superadmin');
    Route::get('/admin/dashboard',       [AdminDashboardController::class, 'index'])->middleware('role:admin');
    Route::get('/cliente/dashboard',     [ClienteDashboardController::class, 'index'])->middleware('role:cliente');
    Route::get('/conductor/dashboard',   [ConductorDashboardController::class, 'index'])->middleware('role:conductor');
    Route::get('/colaborador/dashboard', [ColaboradorDashboardController::class, 'index'])->middleware('role:colaborador');
});

// Gestión de usuarios (solo superadmin)
Route::middleware(['auth', 'role:superadmin'])->group(function () {
    Route::post('/fletes/batch/asignar-periodo', [FleteBatchController::class, 'asignarPeriodo'])
    ->name('fletes.batch.asignar-periodo');
    Route::get('/usuarios', [UserController::class, 'index'])->name('usuarios.index');
    Route::post('/usuarios/{user}/role', [UserController::class, 'updateRole'])->name('usuarios.updateRole');
    Route::delete('/usuarios/{user}/role', [UserController::class, 'removeRole'])->name('usuarios.removeRole');

    // Eliminar registros (diesel, gasto, abono) desde cualquier rendición
    Route::delete('/registro/{id}', [RegistroController::class, 'destroy'])->name('registro.destroy');
});

// Fletes y rendiciones
Route::middleware(['auth'])->group(function () {

    // Vista de fletes para varios roles
    Route::middleware(['role:superadmin|admin|colaborador|cliente'])
        ->get('/fletes', [FleteController::class, 'index'])->name('fletes.index');

    // NUEVA RUTA: Cierre de rendición (solo admin o superadmin)
    Route::middleware(['role:superadmin|admin'])
        ->post('/fletes/{flete}/cerrar', [FleteController::class, 'cerrarRendicion'])->name('fletes.cerrarRendicion');

    // Vista de fletes solo para conductor
    Route::middleware(['role:conductor'])
        ->prefix('conductor')
        ->group(function () {
            Route::get('/fletes', [FleteConductorController::class, 'index'])->name('conductor.fletes.index');
        });

    // Crear flete (superadmin/admin)
    Route::middleware(['role:superadmin|admin'])
        ->post('/fletes', [FleteController::class, 'store'])->name('fletes.store');

    // Registro de formularios
    Route::post('/diesel', [DieselController::class, 'store'])->name('diesel.store');
    Route::post('/gasto', [GastoController::class, 'store'])->name('gasto.store');
    Route::post('/registro', [RegistroController::class, 'store'])->name('registro.store'); // Abonos

    // Finalización del flete con viático
    Route::post('/fletes/finalizar', [FleteController::class, 'finalizar'])->name('fletes.finalizar');

    // Viático directo a una rendición
    Route::post('/rendicion/{id}/viatico', [FleteController::class, 'registrarViatico'])->name('rendicion.viatico');

    // Asignar periodo en lote
    Route::post('/fletes/asignar-periodo', [FleteBatchController::class, 'asignarPeriodo'])->name('fletes.asignarPeriodo');
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

// Autenticación basex
require __DIR__.'/auth.php';
