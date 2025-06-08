<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

// Controladores…
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
use App\Http\Controllers\FleteBatchController;

// Formularios “frontal”
use App\Http\Controllers\DieselController;
use App\Http\Controllers\GastoController;

// Formularios “trasera”
use App\Http\Controllers\AbonoController;
use App\Http\Controllers\RetornoController;
use App\Http\Controllers\ComisionController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::middleware(['auth','verified'])->group(function() {
    // Dashboard según rol
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    Route::get('/superadmin/dashboard', [SuperDashboardController::class, 'index'])
         ->middleware('role:superadmin')
         ->name('superadmin.dashboard');

    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
         ->middleware('role:admin')
         ->name('admin.dashboard');

    Route::get('/cliente/dashboard', [ClienteDashboardController::class, 'index'])
         ->middleware('role:cliente')
         ->name('cliente.dashboard');

    Route::get('/conductor/dashboard', [ConductorDashboardController::class, 'index'])
         ->middleware('role:conductor')
         ->name('conductor.dashboard');

    Route::get('/colaborador/dashboard', [ColaboradorDashboardController::class, 'index'])
         ->middleware('role:colaborador')
         ->name('colaborador.dashboard');

    // Profile
    Route::get('/profile',   [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile',[ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Contacto público
Route::get('/contacto', fn() => Inertia::render('Contact'))->name('contact');
Route::post('/contacto/cliente',       [ContactoController::class, 'cliente'])->name('contacto.cliente');
Route::post('/contacto/transportista', [ContactoController::class, 'transportista'])->name('contacto.transportista');

// OAuth Google
Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

// Redirección según rol (al ingresar)
Route::get('/redirect-by-role', RoleRedirectController::class)
     ->middleware('auth')
     ->name('redirect.by.role');

/**
 * RUTAS SUPERADMIN & ADMIN (idénticas en acceso)
 * Excepto sus dashboards, todo lo que hace admin lo puede hacer superadmin
 */
/**
 * RUTAS SUPERADMIN & ADMIN (idénticas en acceso, excepto gestión de usuarios solo superadmin)
 */
Route::middleware(['auth','role:superadmin|admin'])->group(function() {
    // Fletes y formularios (admin y superadmin)
    Route::get('/fletes',             [FleteController::class, 'index'])->name('fletes.index');
    Route::get('/fletes/{flete}',     [FleteController::class, 'show'])->name('fletes.show');
    Route::post('/fletes',            [FleteController::class, 'store'])->name('fletes.store');
    Route::post('/fletes/{flete}/cerrar',[FleteController::class, 'cerrarRendicion'])->name('fletes.cerrarRendicion');
    Route::post('/fletes/finalizar',   [FleteController::class, 'finalizar'])->name('fletes.finalizar');
    Route::post('/fletes/{flete}/notificar',[FleteController::class, 'notificar'])->name('fletes.notificar');
    Route::post('/rendicion/{id}/viatico',[FleteController::class,'registrarViatico'])->name('rendicion.viatico');
    Route::post('/fletes/asignar-periodo',[FleteBatchController::class,'asignarPeriodo'])->name('fletes.asignarPeriodo');

    // Formularios “frontal”
    Route::post('/diesel',          [DieselController::class, 'store'])->name('diesel.store');
    Route::delete('/diesels/{id}',  [DieselController::class, 'destroy'])->name('diesel.destroy');
    Route::post('/gasto',           [GastoController::class,  'store'])->name('gasto.store');
    Route::delete('/gastos/{id}',   [GastoController::class,  'destroy'])->name('gasto.destroy');

    // Formularios “trasera”
    Route::post('/abonos',          [AbonoController::class,   'store'])->name('abonos.store');
    Route::delete('/abonos/{id}',   [AbonoController::class,   'destroy'])->name('abonos.destroy');
    Route::post('/retornos',        [RetornoController::class, 'store'])->name('retornos.store');
    Route::delete('/retornos/{id}', [RetornoController::class, 'destroy'])->name('retornos.destroy');
    Route::post('/comisiones',      [ComisionController::class,'store'])->name('comisiones.store');
    Route::delete('/comisiones/{id}',[ComisionController::class,'destroy'])->name('comisiones.destroy');
});

/**
 * RUTAS CONDUCTOR (solo conductor)
 */
Route::middleware(['auth','role:conductor'])->prefix('conductor')->group(function () {
    Route::get('/fletes',[FleteConductorController::class,'index'])->name('conductor.fletes.index');
});

// Ruta para hacerse superadmin (testing)
Route::middleware(['auth','verified'])->post('/make-superadmin', function () {
    $user = auth()->user();
    $role = Role::firstOrCreate(['name'=>'superadmin']);
    $user->assignRole($role);
    return back();
})->name('make-superadmin');

// Auth base
require __DIR__.'/auth.php';
