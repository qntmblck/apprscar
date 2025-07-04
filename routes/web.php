<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as BaseVerify;
use App\Http\Middleware\VerifyCsrfToken;

// ——————————————
// Controladores
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
use App\Http\Controllers\PagoController;
use App\Http\Controllers\DieselController;
use App\Http\Controllers\GastoController;
use App\Http\Controllers\AbonoController;
use App\Http\Controllers\RetornoController;
use App\Http\Controllers\ComisionController;
use App\Http\Controllers\AdicionalController;

// ——————————————
// RUTAS PÚBLICAS
// ——————————————
Route::get('/login-success', function () {
    $user = auth()->user();
    if (! $user) {
        return redirect()->route('login');
    }
    if ($user->hasRole('superadmin') || $user->hasRole('admin')) {
        return redirect()->route('fletes.index');
    }
    if ($user->hasRole('cliente')) {
        return redirect()->route('cliente.dashboard');
    } elseif ($user->hasRole('conductor')) {
        return redirect()->route('conductor.dashboard');
    } elseif ($user->hasRole('colaborador')) {
        return redirect()->route('colaborador.dashboard');
    }
    return redirect()->route('dashboard');
})->middleware(['auth']);

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::get('/dashboard', fn() => Inertia::render('Dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/contacto', fn() => Inertia::render('Contact'))->name('contact');
Route::post('/contacto/cliente',       [ContactoController::class, 'cliente'])->name('contacto.cliente');
Route::post('/contacto/transportista', [ContactoController::class, 'transportista'])->name('contacto.transportista');

Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

Route::get('/redirect-by-role', RoleRedirectController::class)
    ->middleware('auth');

// ——————————————
// DASHBOARDS por rol
// ——————————————
Route::middleware(['auth'])->group(function () {
    Route::get('/super/dashboard',       [SuperDashboardController::class, 'index'])
        ->middleware('role:superadmin')
        ->name('super.dashboard');

    Route::get('/admin/dashboard',       [AdminDashboardController::class, 'index'])
        ->middleware('role:admin')
        ->name('admin.dashboard');

    Route::get('/cliente/dashboard',     [ClienteDashboardController::class, 'index'])
        ->middleware('role:cliente')
        ->name('cliente.dashboard');

    Route::get('/conductor/dashboard',   [ConductorDashboardController::class, 'index'])
        ->middleware('role:conductor')
        ->name('conductor.dashboard');

    Route::get('/colaborador/dashboard', [ColaboradorDashboardController::class, 'index'])
        ->middleware('role:colaborador')
        ->name('colaborador.dashboard');
});

// ——————————————
// Gestión de usuarios (solo superadmin)
// ——————————————
Route::middleware(['auth', 'role:superadmin'])->group(function () {
    Route::get('/usuarios',                [UserController::class, 'index'])->name('usuarios.index');
    Route::post('/usuarios/{user}/role',   [UserController::class, 'updateRole'])->name('usuarios.updateRole');
    Route::delete('/usuarios/{user}/role', [UserController::class, 'removeRole'])->name('usuarios.removeRole');
});

// ——————————————
// RUTAS PROTEGIDAS (requieren “auth”)
// ——————————————
Route::middleware('auth')->group(function () {
    // Listar y ver fletes
    Route::middleware('role:superadmin|admin|colaborador|cliente')
        ->get('/fletes',         [FleteController::class, 'index'])->name('fletes.index');
    Route::middleware('role:superadmin|admin|colaborador|cliente')
        ->get('/fletes/{flete}', [FleteController::class, 'show'])->name('fletes.show');

    // Crear y cerrar (superadmin y admin)
    Route::middleware('role:superadmin|admin')->group(function () {
        Route::post('/fletes',                [FleteController::class, 'store'])->name('fletes.store');
        Route::post('/fletes/{flete}/cerrar', [FleteController::class, 'cerrarRendicion'])
            ->name('fletes.cerrarRendicion');
    });

    // AJAX DetailsGrid
    Route::post('/fletes/{flete}/titular',       [FleteController::class, 'updateTitular'])
        ->middleware('role:superadmin|admin|colaborador|cliente')
        ->name('fletes.titular');
    Route::post('/fletes/{flete}/tracto',        [FleteController::class, 'updateTracto'])
        ->middleware('role:superadmin|admin|colaborador|cliente')
        ->name('fletes.tracto');
    Route::post('/fletes/{flete}/rampla',        [FleteController::class, 'updateRampla'])
        ->middleware('role:superadmin|admin|colaborador|cliente')
        ->name('fletes.rampla');
    Route::post('/fletes/{flete}/guiaruta',      [FleteController::class, 'updateGuiaRuta'])
        ->middleware('role:superadmin|admin|colaborador|cliente')
        ->name('fletes.guiaruta');
    // AJAX DetailsGrid — fechas
    Route::post('/fletes/{flete}/fecha-salida',  [FleteController::class, 'updateFechaSalida'])
        ->middleware('role:superadmin|admin|colaborador|cliente')
        ->name('fletes.fecha-salida');
    Route::post('/fletes/{flete}/fecha-llegada', [FleteController::class, 'updateFechaLlegada'])
        ->middleware('role:superadmin|admin|colaborador|cliente')
        ->name('fletes.fecha-llegada');
    Route::post('/fletes/{flete}/kilometraje', [FleteController::class, 'updateKilometraje']);


    Route::get('/fletes/suggest-titulares',      [FleteController::class, 'suggestTitulares'])
        ->middleware('auth')
        ->name('fletes.suggestTitulares');

    // Otras acciones
    Route::post('/fletes/{flete}/finalizar', [FleteController::class, 'finalizar'])->name('fletes.finalizar');
    Route::post('/rendicion/{id}/viatico',   [FleteController::class, 'registrarViatico'])->name('rendicion.viatico');

    // Conductor específico
    Route::middleware('role:conductor')->prefix('conductor')->group(function () {
        Route::get('/fletes', [FleteConductorController::class, 'index'])
            ->name('conductor.fletes.index');
    });

    // Formularios frontal y trasera...
    Route::post('/adicionales',       [AdicionalController::class, 'store'])->name('adicionales.store');
    Route::delete('/adicionales/{id}',[AdicionalController::class, 'destroy'])->name('adicionales.destroy');

    Route::post('/diesel',            [DieselController::class, 'store'])->name('diesel.store');
    Route::delete('/diesels/{id}',    [DieselController::class, 'destroy'])->name('diesel.destroy');

    Route::post('/gastos',            [GastoController::class, 'store'])->name('gastos.store');
    Route::delete('/gastos/{gasto}',  [GastoController::class, 'destroy'])->name('gastos.destroy');

    // Abonos: ahora implicit binding con {abono}
    Route::post('/abonos',            [AbonoController::class, 'store'])->name('abonos.store');
    Route::delete('/abonos/{abono}',  [AbonoController::class, 'destroy'])->name('abonos.destroy');

    Route::post('/retornos',          [RetornoController::class, 'store'])->name('retornos.store');
    Route::delete('/retornos/{id}',   [RetornoController::class, 'destroy'])->name('retornos.destroy');
    Route::post('/comisiones',        [ComisionController::class, 'store'])->name('comisiones.store');
    Route::delete('/comisiones/{id}', [ComisionController::class, 'destroy'])->name('comisiones.destroy');

    // ——— Nuevas rutas batch ———
    Route::post('/fletes/batch/export',     [FleteBatchController::class, 'exportExcel'])
        ->name('fletes.batch.export');
    Route::post('/fletes/batch/notificar', [FleteBatchController::class, 'notificarMasivo'])
        ->withoutMiddleware('auth')
        ->withoutMiddleware(BaseVerify::class)
        ->name('fletes.batch.notificar');

    // ——— Rutas para pagos/resumen y pagos/liquidar ———
    Route::post('/pagos/resumen',  [PagoController::class, 'resumen'])->name('pagos.resumen');
    Route::post('/pagos/liquidar', [PagoController::class, 'liquidar'])->name('pagos.liquidar');
}); // Cierra el grupo 'auth'

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
// Auth base
// ——————————————
require __DIR__.'/auth.php';
