<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as BaseVerify;

/*
|--------------------------------------------------------------------------
| Controladores
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\ProfileController;
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

use App\Http\Controllers\PostulacionConductorController;
use App\Http\Controllers\SolicitudTransporteController;
use App\Http\Controllers\SolicitudColaboradorController;

/*
|--------------------------------------------------------------------------
| Rutas Públicas
|--------------------------------------------------------------------------
*/

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
    }
    if ($user->hasRole('conductor')) {
        return redirect()->route('conductor.dashboard');
    }
    if ($user->hasRole('colaborador')) {
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

Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');
Route::get('/contacto', fn () => Inertia::render('Contact'))->name('contact');


Route::get('/redirect-by-role', RoleRedirectController::class)->middleware('auth');


/*
|--------------------------------------------------------------------------
| Perfil
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Dashboards por Rol
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Gestión de Usuarios
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:superadmin'])->group(function () {
    Route::get('/usuarios',                [UserController::class, 'index'])->name('usuarios.index');
    Route::post('/usuarios/{user}/role',   [UserController::class, 'updateRole'])->name('usuarios.updateRole');
    Route::delete('/usuarios/{user}/role', [UserController::class, 'removeRole'])->name('usuarios.removeRole');
});

/*
|--------------------------------------------------------------------------
| Solicitudes (Dashboard sin Rol)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/postulaciones/conductor', [PostulacionConductorController::class, 'store'])
        ->name('postulaciones.conductor.store');

    Route::post('/solicitudes/transporte',  [SolicitudTransporteController::class, 'store'])
        ->name('solicitudes.transporte.store');

    Route::post('/solicitudes/colaborador', [SolicitudColaboradorController::class, 'store'])
        ->name('solicitudes.colaborador.store');
});

/*
|--------------------------------------------------------------------------
| Admin - Solicitudes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:superadmin|admin'])->prefix('admin')->group(function () {
    Route::get('/solicitudes', function () {
        return Inertia::render('Admin/Solicitudes/Index');
    })->name('admin.solicitudes.index');

    Route::patch('/postulaciones-conductor/{id}/status', function () {
        abort(501);
    })->name('admin.postulaciones_conductor.status');

    Route::patch('/solicitudes-transporte/{id}/status', function () {
        abort(501);
    })->name('admin.solicitudes_transporte.status');

    Route::patch('/solicitudes-colaborador/{id}/status', function () {
        abort(501);
    })->name('admin.solicitudes_colaborador.status');
});

/*
|--------------------------------------------------------------------------
| Fletes y Operación
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::middleware('role:superadmin|admin|colaborador|cliente')
        ->get('/fletes', [FleteController::class, 'index'])->name('fletes.index');

    Route::middleware('role:superadmin|admin|colaborador|cliente')
        ->get('/fletes/{flete}', [FleteController::class, 'show'])->name('fletes.show');

    Route::middleware('role:superadmin|admin')->group(function () {
        Route::post('/fletes', [FleteController::class, 'store'])->name('fletes.store');
        Route::post('/fletes/{flete}/cerrar', [FleteController::class, 'cerrarRendicion'])
            ->name('fletes.cerrarRendicion');
    });

    Route::post('/fletes/{flete}/titular', [FleteController::class, 'updateTitular'])
        ->middleware('role:superadmin|admin|colaborador|cliente')
        ->name('fletes.titular');

    Route::post('/fletes/{flete}/tracto', [FleteController::class, 'updateTracto'])
        ->middleware('role:superadmin|admin|colaborador|cliente')
        ->name('fletes.tracto');

    Route::post('/fletes/{flete}/rampla', [FleteController::class, 'updateRampla'])
        ->middleware('role:superadmin|admin|colaborador|cliente')
        ->name('fletes.rampla');

    Route::post('/fletes/{flete}/guiaruta', [FleteController::class, 'updateGuiaRuta'])
        ->middleware('role:superadmin|admin|colaborador|cliente')
        ->name('fletes.guiaruta');

    Route::post('/fletes/{flete}/fecha-salida', [FleteController::class, 'updateFechaSalida'])
        ->middleware('role:superadmin|admin|colaborador|cliente')
        ->name('fletes.fecha-salida');

    Route::post('/fletes/{flete}/fecha-llegada', [FleteController::class, 'updateFechaLlegada'])
        ->middleware('role:superadmin|admin|colaborador|cliente')
        ->name('fletes.fecha-llegada');

    Route::post('/fletes/{flete}/kilometraje', [FleteController::class, 'updateKilometraje']);

    Route::get('/fletes/suggest-titulares', [FleteController::class, 'suggestTitulares'])
        ->name('fletes.suggestTitulares');

    Route::post('/fletes/{flete}/finalizar', [FleteController::class, 'finalizar'])
        ->name('fletes.finalizar');

    Route::post('/rendicion/{id}/viatico', [FleteController::class, 'registrarViatico'])
        ->name('rendicion.viatico');

    Route::middleware('role:conductor')->prefix('conductor')->group(function () {
        Route::get('/fletes', [FleteConductorController::class, 'index'])
            ->name('conductor.fletes.index');
    });

    Route::post('/adicionales', [AdicionalController::class, 'store'])->name('adicionales.store');
    Route::delete('/adicionales/{id}', [AdicionalController::class, 'destroy'])->name('adicionales.destroy');

    Route::post('/diesel', [DieselController::class, 'store'])->name('diesel.store');
    Route::delete('/diesels/{id}', [DieselController::class, 'destroy'])->name('diesel.destroy');

    Route::post('/gastos', [GastoController::class, 'store'])->name('gastos.store');
    Route::delete('/gastos/{gasto}', [GastoController::class, 'destroy'])->name('gastos.destroy');

    Route::post('/abonos', [AbonoController::class, 'store'])->name('abonos.store');
    Route::delete('/abonos/{abono}', [AbonoController::class, 'destroy'])->name('abonos.destroy');

    Route::post('/retornos', [RetornoController::class, 'store'])->name('retornos.store');
    Route::delete('/retornos/{id}', [RetornoController::class, 'destroy'])->name('retornos.destroy');

    Route::post('/comisiones', [ComisionController::class, 'store'])->name('comisiones.store');
    Route::delete('/comisiones/{id}', [ComisionController::class, 'destroy'])->name('comisiones.destroy');

    Route::post('/fletes/batch/export', [FleteBatchController::class, 'exportExcel'])
        ->name('fletes.batch.export');

    Route::post('/fletes/batch/notificar', [FleteBatchController::class, 'notificarMasivo'])
        ->withoutMiddleware('auth')
        ->withoutMiddleware(BaseVerify::class)
        ->name('fletes.batch.notificar');

    Route::post('/pagos/resumen', [PagoController::class, 'resumen'])->name('pagos.resumen');
    Route::post('/pagos/liquidar', [PagoController::class, 'liquidar'])->name('pagos.liquidar');
});

/*
|--------------------------------------------------------------------------
| Activar Superadmin
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->post('/make-superadmin', function () {
    $user = auth()->user();
    if ($user->hasRole('superadmin')) {
        return back()->with('info', 'Ya eres superadmin');
    }
    $role = Role::firstOrCreate(['name' => 'superadmin']);
    $user->assignRole($role);
    return back()->with('success', 'Ahora eres superadmin');
})->name('make-superadmin');

/*
|--------------------------------------------------------------------------
| Auth
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';
