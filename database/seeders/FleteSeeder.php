<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Faker\Factory as Faker;
use Spatie\Permission\Models\Role;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Destino;
use App\Models\Tracto;
use App\Models\Rampla;
use App\Models\Tarifa;
use App\Models\Flete;
use App\Models\Rendicion;
use App\Models\Diesel;
use App\Models\Gasto;
use App\Models\AbonoCaja;
use App\Models\Adicional;
use App\Models\Mantencion;
use Database\Factories\ClienteFactory;
use Database\Factories\DestinoFactory;
use Database\Factories\TractoFactory;
use Database\Factories\RamplaFactory;

class FleteSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_CL');

        // 1) Roles + superadmin
        foreach (['superadmin','conductor','colaborador','cliente','admin'] as $r) {
            Role::firstOrCreate(['name' => $r, 'guard_name' => 'web']);
        }
        User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name'              => 'Super Admin',
                'password'          => bcrypt('password'),
                'estado'            => 'Activo',
                'email_verified_at' => now(),
            ]
        )->syncRoles(['superadmin']);

        // 2) Crear conductores y colaboradores
        $conductores    = User::factory()->count(5)->state(fn() => ['email_verified_at'=>now(),'estado'=>'Activo'])->create()->each(fn(User $u)=>$u->assignRole('conductor'));
        $colaboradores = User::factory()->count(5)->state(fn() => ['email_verified_at'=>now(),'estado'=>'Activo'])->create()->each(fn(User $u)=>$u->assignRole('colaborador'));

        // 3) Presets
        $clientes = Cliente::factory(ClienteFactory::PRESET_COUNT)->create();
        $destinos = Destino::factory(DestinoFactory::PRESET_COUNT)->create();
        $tractos  = Tracto::factory(TractoFactory::PRESET_COUNT)->create();
        $ramplas  = Rampla::factory(RamplaFactory::PRESET_COUNT)->create();

        // 4) Tarifas
        $tipos = ['Directo','Reparto'];
        foreach ($clientes as $cli) {
            foreach ($destinos as $des) {
                foreach ($tipos as $tp) {
                    Tarifa::firstOrCreate(
                        ['cliente_principal_id'=>$cli->id,'destino_id'=>$des->id,'tipo'=>$tp],
                        ['valor_factura'=>$faker->numberBetween(80000,300000),'valor_comision'=>$faker->numberBetween(10000,50000)]
                    );
                }
            }
        }

        // 5) Generar 1000 fletes
        $inicio    = Carbon::create(2025,7,1);
        $fin       = Carbon::create(2025,12,30);
        $totalDias = $fin->diffInDays($inicio);

        for ($i = 0; $i < 1000; $i++) {
            // Elegir actor
            if (rand(1,100) <= 20) {
                $actorKey   = 'colaborador_id';
                $actor      = $colaboradores->random();
                $isColab    = true;
            } else {
                $actorKey   = 'conductor_id';
                $actor      = $conductores->random();
                $isColab    = false;
            }

            // Datos base
            $cli    = $clientes->random();
            $des    = $destinos->random();
            $tra    = $tractos->random();
            $ram    = $ramplas->random();
            $tp     = $faker->randomElement($tipos);
            $tarifa = Tarifa::where([
                ['cliente_principal_id',$cli->id],
                ['destino_id',$des->id],
                ['tipo',$tp],
            ])->first();

            // Fechas y km
            $fechaSalida  = (clone $inicio)->addDays(rand(0,$totalDias));
            $fechaLlegada = (clone $fechaSalida)->addDays(rand(0,5));
            if ($fechaLlegada->gt($fin)) {
                $fechaLlegada = $fin->copy();
            }
            $km = ($des->km_destino ?? 0) * 2;

            // Crear flete
            $flete = Flete::create([
                'cliente_principal_id'=>$cli->id,
                'destino_id'         =>$des->id,
                'tarifa_id'          =>$tarifa->id,
                'tipo'               =>$tp,
                'estado'             =>'Sin Notificar',
                'fecha_salida'       =>$fechaSalida,
                'fecha_llegada'      =>$fechaLlegada,
                'kilometraje'        =>$km,
                'rendimiento'        =>$faker->randomFloat(2,3,7),
                'comision'           =>$tarifa->valor_comision + $faker->numberBetween(5000,20000),
                'retorno'            =>rand(0,1)?$faker->numberBetween(10000,50000):0,
                'pagado'             =>$fechaLlegada->lt(Carbon::now()->subMonths(2)),
                'guiaruta'           =>$faker->bothify('GR-??-####'),
                'conductor_id'       =>$actorKey==='conductor_id' ? $actor->id : null,
                'colaborador_id'     =>$actorKey==='colaborador_id' ? $actor->id : null,
                'tracto_id'          =>$tra->id,
                'rampla_id'          =>$ram->id,
            ]);

            // Mantenciones (siempre)
            $prevTra=$tra->kilometraje; $prevRam=$ram->kilometraje;
            $tra->increment('kilometraje',$km); $ram->increment('kilometraje',$km);
            $nTra=intdiv($prevTra+$km,5000)-intdiv($prevTra,5000);
            $nRam=intdiv($prevRam+$km,5000)-intdiv($prevRam,5000);
            for($j=0;$j<$nTra;$j++){
                Mantencion::create([
                    'user_id'=>$actor->id,'flete_id'=>$flete->id,
                    'tracto_id'=>$tra->id,'rampla_id'=>null,
                    'fecha'=>$faker->dateTimeBetween($fechaSalida,$fechaLlegada),
                    'tipo'=>'Mantención','detalle'=>$faker->sentence(),
                    'costo'=>$faker->numberBetween(50000,150000),
                    'estado'=>'pendiente',
                ]);
            }
            for($j=0;$j<$nRam;$j++){
                Mantencion::create([
                    'user_id'=>$actor->id,'flete_id'=>$flete->id,
                    'tracto_id'=>null,'rampla_id'=>$ram->id,
                    'fecha'=>$faker->dateTimeBetween($fechaSalida,$fechaLlegada),
                    'tipo'=>'Mantención','detalle'=>$faker->sentence(),
                    'costo'=>$faker->numberBetween(50000,150000),
                    'estado'=>'pendiente',
                ]);
            }

            // Crear rendición
            $diasViaje   = max(1,$fechaSalida->diffInDays($fechaLlegada)+1);
            $viatico     = $isColab ? 0 : (15000*$diasViaje);
            $rend        = Rendicion::create([
                'flete_id'         =>$flete->id,
                'user_id'          =>$actor->id,
                'estado'           =>'Activo',
                'caja_flete'       =>0,
                'viatico_efectivo' =>$viatico,
                'viatico_calculado'=>0,
                'saldo'            =>0,
                'comision'         =>$faker->numberBetween(5000,20000),
            ]);
            $rend->recalcularTotales();

            // Si no es colaborador, crear diesel, gastos y abonos
            if (! $isColab) {
                // Calcular totales ficticios
                $dieselTotal   = $faker->numberBetween(50000,150000);
                $gastosTotal   = $faker->numberBetween(20000,80000);
                $saldoTarget   = $faker->numberBetween(-40000,40000);
                $abonosTotal   = $saldoTarget + $gastosTotal + $dieselTotal + $viatico;

                // Diesel
                $partes = rand(1,2); $resto = $dieselTotal;
                for ($j=1; $j<=$partes; $j++){
                    $m = $j===$partes ? $resto : $faker->numberBetween((int)($dieselTotal*0.3),(int)($dieselTotal*0.7));
                    $resto -= $m;
                    Diesel::create([
                        'flete_id'=>$flete->id,'rendicion_id'=>$rend->id,'user_id'=>$actor->id,
                        'litros'=>$faker->numberBetween(40,120),'monto'=>$m,
                        'metodo_pago'=>$faker->randomElement(['Efectivo','Transferencia','Crédito']),
                    ]);
                }

                // Gastos
                $partes = rand(1,3); $resto = $gastosTotal;
                for ($j=1; $j<=$partes; $j++){
                    $m = $j===$partes ? $resto : $faker->numberBetween((int)($gastosTotal*0.3),(int)($gastosTotal*0.7));
                    $resto -= $m;
                    Gasto::create([
                        'flete_id'=>$flete->id,'rendicion_id'=>$rend->id,'user_id'=>$actor->id,
                        'tipo'=>$faker->randomElement(['Peaje','Estacionamiento','Carga']),
                        'descripcion'=>$faker->words(3,true),'monto'=>$m,
                    ]);
                }

                // Abonos
                $partes = rand(1,2); $resto = $abonosTotal;
                for ($j=1; $j<=$partes; $j++){
                    $m = $j===$partes ? $resto : $faker->numberBetween((int)($abonosTotal*0.3),(int)($abonosTotal*0.7));
                    $resto -= $m;
                    AbonoCaja::create([
                        'rendicion_id'=>$rend->id,'monto'=>$m,
                        'metodo'=>$faker->randomElement(['Efectivo','Transferencia']),
                    ]);
                }

                // Ajustar saldo final
                $rend->recalcularTotales();
                $rend->update(['saldo'=>$saldoTarget]);
            }

            // Adicionales (siempre)
            foreach (range(1, rand(0,2)) as $_) {
                Adicional::create([
                    'flete_id'=>$flete->id,'rendicion_id'=>$rend->id,
                    'tipo'=>'Adicional','descripcion'=>$faker->randomElement(['Camioneta','Peoneta','Extra']),
                    'monto'=>$faker->numberBetween(5000,20000),
                ]);
            }
        }

        $this->command->info('✅ Seed completo con 1000 fletes y lógica de roles aplicada.');

    }
}
