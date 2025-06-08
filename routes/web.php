<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

// ——————————————
// Declaraciones “use” de todos los controladores que vas a usar
// ——————————————
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

// Controladores de formularios “frontal”
use App\Http\Controllers\DieselController;
use App\Http\Controllers\GastoController;

// Controladores de formularios “trasera”
use App\Http\Controllers\AbonoController;
use App\Http\Controllers\RetornoController;
use App\Http\Controllers\ComisionController;

// ——————————————
// RUTAS PÚBLICAS
// ——————————————

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile',   [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile',[ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/contacto', fn () => Inertia::render('Contact'))->name('contact');
Route::post('/contacto/cliente',       [ContactoController::class, 'cliente'])->name('contacto.cliente');
Route::post('/contacto/transportista', [ContactoController::class, 'transportista'])->name('contacto.transportista');

Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

Route::get('/redirect-by-role', RoleRedirectController::class)->middleware('auth');

Route::middleware(['auth'])->group(function () {
    Route::get('/super/dashboard',       [SuperDashboardController::class, 'index'])->middleware('role:superadmin');
    Route::get('/admin/dashboard',       [AdminDashboardController::class,   'index'])->middleware('role:admin');
    Route::get('/cliente/dashboard',     [ClienteDashboardController::class, 'index'])->middleware('role:cliente');
    Route::get('/conductor/dashboard',   [ConductorDashboardController::class,'index'])->middleware('role:conductor');
    Route::get('/colaborador/dashboard', [ColaboradorDashboardController::class,'index'])->middleware('role:colaborador');
});

// ——————————————
// Gestión de usuarios (solo superadmin)
// ——————————————
Route::middleware(['auth', 'role:superadmin'])->group(function () {
    Route::post('/fletes/batch/asignar-periodo', [FleteBatchController::class, 'asignarPeriodo'])
         ->name('fletes.batch.asignar-periodo');

    Route::get('/usuarios',                [UserController::class, 'index'])->name('usuarios.index');
    Route::post('/usuarios/{user}/role',   [UserController::class, 'updateRole'])->name('usuarios.updateRole');
    Route::delete('/usuarios/{user}/role', [UserController::class, 'removeRole'])->name('usuarios.removeRole');
});

// ——————————————
// RUTAS PROTEGIDAS (requieren “auth”)
// ——————————————
Route::middleware(['auth'])->group(function () {

    // Vista de fletes (roles: superadmin|admin|colaborador|cliente)
    Route::middleware(['role:superadmin|admin|colaborador|cliente'])
         ->get('/fletes', [FleteController::class, 'index'])->name('fletes.index');

    // Mostrar un solo flete (para recarga tras DELETE)
    Route::middleware(['role:superadmin|admin|colaborador|cliente'])
         ->get('/fletes/{flete}', [FleteController::class, 'show'])->name('fletes.show');

    // Crear flete (superadmin|admin)
    Route::middleware(['role:superadmin|admin'])
         ->post('/fletes', [FleteController::class, 'store'])->name('fletes.store');

    // Cierre de rendición (solo superadmin|admin)
    Route::middleware(['role:superadmin|admin'])
         ->post('/fletes/{flete}/cerrar', [FleteController::class, 'cerrarRendicion'])
         ->name('fletes.cerrarRendicion');

    // Finalización del flete con viático
    Route::post('/fletes/finalizar',   [FleteController::class, 'finalizar'])->name('fletes.finalizar');

    // Viático directo a una rendición
    Route::post('/rendicion/{id}/viatico',[FleteController::class, 'registrarViatico'])
         ->name('rendicion.viatico');

    // Asignar periodo en lote
    Route::post('/fletes/asignar-periodo',[FleteBatchController::class,'asignarPeriodo'])
         ->name('fletes.asignarPeriodo');

    // Vista de fletes solo para conductor
    Route::middleware(['role:conductor'])
         ->prefix('conductor')
         ->group(function () {
             Route::get('/fletes', [FleteConductorController::class, 'index'])
                  ->name('conductor.fletes.index');
         });

    // ——————————————
    // Formularios “frontal” (Diesel y Gasto)
    // ——————————————

    // Diesel
    Route::post('/diesel',         [DieselController::class, 'store'])->name('diesel.store');
    Route::delete('/diesels/{id}', [DieselController::class, 'destroy'])->name('diesel.destroy');

    // Gasto
    Route::post('/gasto',          [GastoController::class,  'store'])->name('gasto.store');
    Route::delete('/gastos/{id}',  [GastoController::class,  'destroy'])->name('gasto.destroy');

    // ——————————————
    // Formularios “trasera” (Abono, Retorno, Comisión)
    // ——————————————

    // Abono
    Route::post('/abonos',         [AbonoController::class,   'store'])->name('abonos.store');
    Route::delete('/abonos/{id}',  [AbonoController::class,   'destroy'])->name('abonos.destroy');

    // Retorno
    Route::post('/retornos',       [RetornoController::class, 'store'])->name('retornos.store');
    Route::delete('/retornos/{id}',[RetornoController::class, 'destroy'])->name('retornos.destroy');

    // Comisión
    Route::post('/comisiones',         [ComisionController::class,'store'])->name('comisiones.store');
    Route::delete('/comisiones/{id}',  [ComisionController::class,'destroy'])->name('comisiones.destroy');
});

// ——————————————
// Activar superadmin manualmente
// ——————————————
Route::middleware(['auth', 'verified'])->post('/make-superadmin', function () {
    $user = auth()->user();

    if ($user->hasRole('superadmin')) {
        return back()->with('info', '¡Ya eres superadmin!');
    }

    $role = Role::firstOrCreate(['name' => 'superadmin']);
    $user->assignRole($role);

    return back()->with('success', '¡Ahora eres superadmin!');
})->name('make-superadmin');

// ——————————————
// Rutas de autenticación base (login, register, etc.)
// ——————————————
require __DIR__.'/auth.php';
