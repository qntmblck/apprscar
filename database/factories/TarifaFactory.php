<?php

namespace Database\Factories;

use App\Models\Tarifa;
use App\Models\Destino;
use App\Models\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;
use Exception;

class TarifaFactory extends Factory
{
    /**
     * El modelo asociado.
     *
     * @var string
     */
    protected $model = Tarifa::class;

    /**
     * Presets de tarifas: cliente, destino, tipo, valor_factura y valor_comision.
     *
     * Cada entrada aparece dos veces, una para 'Directo' y otra para 'Reparto'.
     *
     * @var array<int,array<string,mixed>>
     */
    protected static array $presets = [
        // ANTOFAGASTA
        ['cliente'=>'Adquim',    'destino'=>'ANTOFAGASTA','tipo'=>'Directo','valor_factura'=>1750000.0,'valor_comision'=>140000.0],
        ['cliente'=>'Adquim',    'destino'=>'ANTOFAGASTA','tipo'=>'Reparto','valor_factura'=>1750000.0,'valor_comision'=>140000.0],
        ['cliente'=>'Ashley',    'destino'=>'ANTOFAGASTA','tipo'=>'Directo','valor_factura'=>1600000.0,'valor_comision'=>128000.0],
        ['cliente'=>'Ashley',    'destino'=>'ANTOFAGASTA','tipo'=>'Reparto','valor_factura'=>1600000.0,'valor_comision'=>128000.0],
        ['cliente'=>'Canontex',  'destino'=>'ANTOFAGASTA','tipo'=>'Directo','valor_factura'=>1750000.0,'valor_comision'=>140000.0],
        ['cliente'=>'Canontex',  'destino'=>'ANTOFAGASTA','tipo'=>'Reparto','valor_factura'=>1750000.0,'valor_comision'=>140000.0],
        ['cliente'=>'Particular','destino'=>'ANTOFAGASTA','tipo'=>'Directo','valor_factura'=>1750000.0,'valor_comision'=>140000.0],
        ['cliente'=>'Particular','destino'=>'ANTOFAGASTA','tipo'=>'Reparto','valor_factura'=>1750000.0,'valor_comision'=>140000.0],
        ['cliente'=>'Prisa',     'destino'=>'ANTOFAGASTA','tipo'=>'Directo','valor_factura'=>2500000.0,'valor_comision'=>200000.0],
        ['cliente'=>'Prisa',     'destino'=>'ANTOFAGASTA','tipo'=>'Reparto','valor_factura'=>2500000.0,'valor_comision'=>200000.0],
        ['cliente'=>'Tecnopapel','destino'=>'ANTOFAGASTA','tipo'=>'Directo','valor_factura'=>1750000.0,'valor_comision'=>140000.0],
        ['cliente'=>'Tecnopapel','destino'=>'ANTOFAGASTA','tipo'=>'Reparto','valor_factura'=>1750000.0,'valor_comision'=>140000.0],
        ['cliente'=>'e-Log',     'destino'=>'ANTOFAGASTA','tipo'=>'Directo','valor_factura'=>1750000.0,'valor_comision'=>140000.0],
        ['cliente'=>'e-Log',     'destino'=>'ANTOFAGASTA','tipo'=>'Reparto','valor_factura'=>1750000.0,'valor_comision'=>140000.0],

        // ARICA
        ['cliente'=>'Fruna',     'destino'=>'ARICA','tipo'=>'Directo','valor_factura'=>3750000.0,'valor_comision'=>300000.0],
        ['cliente'=>'Fruna',     'destino'=>'ARICA','tipo'=>'Reparto','valor_factura'=>3750000.0,'valor_comision'=>300000.0],
        ['cliente'=>'Particular','destino'=>'ARICA','tipo'=>'Directo','valor_factura'=>2500000.0,'valor_comision'=>200000.0],
        ['cliente'=>'Particular','destino'=>'ARICA','tipo'=>'Reparto','valor_factura'=>2500000.0,'valor_comision'=>200000.0],
        ['cliente'=>'Tecnopapel','destino'=>'ARICA','tipo'=>'Directo','valor_factura'=>15000000.0,'valor_comision'=>1200000.0],
        ['cliente'=>'Tecnopapel','destino'=>'ARICA','tipo'=>'Reparto','valor_factura'=>15000000.0,'valor_comision'=>1200000.0],

        // CALAMA
        ['cliente'=>'Particular','destino'=>'CALAMA','tipo'=>'Directo','valor_factura'=>2000000.0,'valor_comision'=>160000.0],
        ['cliente'=>'Particular','destino'=>'CALAMA','tipo'=>'Reparto','valor_factura'=>2000000.0,'valor_comision'=>160000.0],
        ['cliente'=>'Tecnopapel','destino'=>'CALAMA','tipo'=>'Directo','valor_factura'=>1792570.5,'valor_comision'=>143405.64],
        ['cliente'=>'Tecnopapel','destino'=>'CALAMA','tipo'=>'Reparto','valor_factura'=>1792570.5,'valor_comision'=>143405.64],

        // CALERA DE TANGO
        ['cliente'=>'e-Log','destino'=>'CALERA DE TANGO','tipo'=>'Directo','valor_factura'=>250000.0,'valor_comision'=>20000.0],
        ['cliente'=>'e-Log','destino'=>'CALERA DE TANGO','tipo'=>'Reparto','valor_factura'=>250000.0,'valor_comision'=>20000.0],

        // CASTRO
        ['cliente'=>'Canontex','destino'=>'CASTRO','tipo'=>'Directo','valor_factura'=>1750000.0,'valor_comision'=>140000.0],
        ['cliente'=>'Canontex','destino'=>'CASTRO','tipo'=>'Reparto','valor_factura'=>1750000.0,'valor_comision'=>140000.0],

        // CHAÑARAL
        ['cliente'=>'Particular','destino'=>'CHAÑARAL','tipo'=>'Directo','valor_factura'=>1250000.0,'valor_comision'=>100000.0],
        ['cliente'=>'Particular','destino'=>'CHAÑARAL','tipo'=>'Reparto','valor_factura'=>1250000.0,'valor_comision'=>100000.0],

        // CHILLÁN
        ['cliente'=>'Canontex',              'destino'=>'CHILLÁN','tipo'=>'Directo','valor_factura'=>750000.0,'valor_comision'=>60000.0],
        ['cliente'=>'Canontex',              'destino'=>'CHILLÁN','tipo'=>'Reparto','valor_factura'=>750000.0,'valor_comision'=>60000.0],
        ['cliente'=>'Deco Mueble',           'destino'=>'CHILLÁN','tipo'=>'Directo','valor_factura'=>750000.0,'valor_comision'=>60000.0],
        ['cliente'=>'Deco Mueble',           'destino'=>'CHILLÁN','tipo'=>'Reparto','valor_factura'=>750000.0,'valor_comision'=>60000.0],
        ['cliente'=>'Muebles San Sebastian', 'destino'=>'CHILLÁN','tipo'=>'Directo','valor_factura'=>500000.0,'valor_comision'=>40000.0],
        ['cliente'=>'Muebles San Sebastian', 'destino'=>'CHILLÁN','tipo'=>'Reparto','valor_factura'=>500000.0,'valor_comision'=>40000.0],
        ['cliente'=>'Tecnopapel',            'destino'=>'CHILLÁN','tipo'=>'Directo','valor_factura'=>664429.5,'valor_comision'=>53154.36],
        ['cliente'=>'Tecnopapel',            'destino'=>'CHILLÁN','tipo'=>'Reparto','valor_factura'=>664429.5,'valor_comision'=>53154.36],

        // CONCEPCIÓN
        ['cliente'=>'Canontex','destino'=>'CONCEPCIÓN','tipo'=>'Directo','valor_factura'=>875000.0,'valor_comision'=>70000.0],
        ['cliente'=>'Canontex','destino'=>'CONCEPCIÓN','tipo'=>'Reparto','valor_factura'=>875000.0,'valor_comision'=>70000.0],
        ['cliente'=>'Prisa',   'destino'=>'CONCEPCIÓN','tipo'=>'Directo','valor_factura'=>875000.0,'valor_comision'=>70000.0],
        ['cliente'=>'Prisa',   'destino'=>'CONCEPCIÓN','tipo'=>'Reparto','valor_factura'=>875000.0,'valor_comision'=>70000.0],

        // COPIAPÓ
        ['cliente'=>'Tecnopapel','destino'=>'COPIAPÓ','tipo'=>'Directo','valor_factura'=>1171138.5,'valor_comision'=>93691.08],
        ['cliente'=>'Tecnopapel','destino'=>'COPIAPÓ','tipo'=>'Reparto','valor_factura'=>1171138.5,'valor_comision'=>93691.08],

        // COQUIMBO
        ['cliente'=>'Canontex','destino'=>'COQUIMBO','tipo'=>'Directo','valor_factura'=>750000.0,'valor_comision'=>60000.0],
        ['cliente'=>'Canontex','destino'=>'COQUIMBO','tipo'=>'Reparto','valor_factura'=>750000.0,'valor_comision'=>60000.0],
        ['cliente'=>'Particular','destino'=>'COQUIMBO','tipo'=>'Directo','valor_factura'=>750000.0,'valor_comision'=>60000.0],
        ['cliente'=>'Particular','destino'=>'COQUIMBO','tipo'=>'Reparto','valor_factura'=>750000.0,'valor_comision'=>60000.0],
        ['cliente'=>'Prisa','destino'=>'COQUIMBO','tipo'=>'Directo','valor_factura'=>750000.0,'valor_comision'=>60000.0],
        ['cliente'=>'Prisa','destino'=>'COQUIMBO','tipo'=>'Reparto','valor_factura'=>750000.0,'valor_comision'=>60000.0],
        ['cliente'=>'Tecnopapel','destino'=>'COQUIMBO','tipo'=>'Directo','valor_factura'=>750000.0,'valor_comision'=>60000.0],
        ['cliente'=>'Tecnopapel','destino'=>'COQUIMBO','tipo'=>'Reparto','valor_factura'=>750000.0,'valor_comision'=>60000.0],

        // COYHAIQUE
        ['cliente'=>'Carrasco Crédito','destino'=>'COYHAIQUE','tipo'=>'Directo','valor_factura'=>3000000.0,'valor_comision'=>240000.0],
        ['cliente'=>'Carrasco Crédito','destino'=>'COYHAIQUE','tipo'=>'Reparto','valor_factura'=>3000000.0,'valor_comision'=>240000.0],
        ['cliente'=>'Tecnopapel','destino'=>'COYHAIQUE','tipo'=>'Directo','valor_factura'=>3375000.0,'valor_comision'=>270000.0],
        ['cliente'=>'Tecnopapel','destino'=>'COYHAIQUE','tipo'=>'Reparto','valor_factura'=>3375000.0,'valor_comision'=>270000.0],

        // CURAUMA
        ['cliente'=>'Canontex','destino'=>'CURAUMA','tipo'=>'Directo','valor_factura'=>250000.0,'valor_comision'=>20000.0],
        ['cliente'=>'Canontex','destino'=>'CURAUMA','tipo'=>'Reparto','valor_factura'=>250000.0,'valor_comision'=>20000.0],

        // DIEGO DE ALMAGRO
        ['cliente'=>'Tecnopapel','destino'=>'DIEGO DE ALMAGRO','tipo'=>'Directo','valor_factura'=>1381968.0,'valor_comision'=>110557.44],
        ['cliente'=>'Tecnopapel','destino'=>'DIEGO DE ALMAGRO','tipo'=>'Reparto','valor_factura'=>1381968.0,'valor_comision'=>110557.44],

        // IQUIQUE
        ['cliente'=>'Comercial Felp','destino'=>'IQUIQUE','tipo'=>'Directo','valor_factura'=>3250000.0,'valor_comision'=>260000.0],
        ['cliente'=>'Comercial Felp','destino'=>'IQUIQUE','tipo'=>'Reparto','valor_factura'=>3250000.0,'valor_comision'=>260000.0],
        ['cliente'=>'Particular','destino'=>'IQUIQUE','tipo'=>'Directo','valor_factura'=>3375000.0,'valor_comision'=>270000.0],
        ['cliente'=>'Particular','destino'=>'IQUIQUE','tipo'=>'Reparto','valor_factura'=>3375000.0,'valor_comision'=>270000.0],
        ['cliente'=>'Ralo','destino'=>'IQUIQUE','tipo'=>'Directo','valor_factura'=>3250000.0,'valor_comision'=>260000.0],
        ['cliente'=>'Ralo','destino'=>'IQUIQUE','tipo'=>'Reparto','valor_factura'=>3250000.0,'valor_comision'=>260000.0],
        ['cliente'=>'Tecnopapel','destino'=>'IQUIQUE','tipo'=>'Directo','valor_factura'=>3675000.0,'valor_comision'=>294000.0],
        ['cliente'=>'Tecnopapel','destino'=>'IQUIQUE','tipo'=>'Reparto','valor_factura'=>3675000.0,'valor_comision'=>294000.0],

        // LA CALERA
        ['cliente'=>'Canontex','destino'=>'LA CALERA','tipo'=>'Directo','valor_factura'=>437500.0,'valor_comision'=>35000.0],
        ['cliente'=>'Canontex','destino'=>'LA CALERA','tipo'=>'Reparto','valor_factura'=>437500.0,'valor_comision'=>35000.0],

        // LA SERENA
        ['cliente'=>'Canontex','destino'=>'LA SERENA','tipo'=>'Directo','valor_factura'=>835191.0,'valor_comision'=>66815.28],
        ['cliente'=>'Canontex','destino'=>'LA SERENA','tipo'=>'Reparto','valor_factura'=>835191.0,'valor_comision'=>66815.28],
        ['cliente'=>'Particular','destino'=>'LA SERENA','tipo'=>'Directo','valor_factura'=>625000.0,'valor_comision'=>50000.0],
        ['cliente'=>'Particular','destino'=>'LA SERENA','tipo'=>'Reparto','valor_factura'=>625000.0,'valor_comision'=>50000.0],

        // LAS CABRAS
        ['cliente'=>'e-Log','destino'=>'LAS CABRAS','tipo'=>'Directo','valor_factura'=>400000.0,'valor_comision'=>32000.0],
        ['cliente'=>'e-Log','destino'=>'LAS CABRAS','tipo'=>'Reparto','valor_factura'=>400000.0,'valor_comision'=>32000.0],

        // LONGAVI
        ['cliente'=>'Canontex','destino'=>'LONGAVI','tipo'=>'Directo','valor_factura'=>577206.0,'valor_comision'=>46176.48],
        ['cliente'=>'Canontex','destino'=>'LONGAVI','tipo'=>'Reparto','valor_factura'=>577206.0,'valor_comision'=>46176.48],

        // LOS ANDES
        ['cliente'=>'Comercial Felp','destino'=>'LOS ANDES','tipo'=>'Directo','valor_factura'=>812500.0,'valor_comision'=>65000.0],
        ['cliente'=>'Comercial Felp','destino'=>'LOS ANDES','tipo'=>'Reparto','valor_factura'=>812500.0,'valor_comision'=>65000.0],

        // LOS VILOS
        ['cliente'=>'Muebles San Sebastian','destino'=>'LOS VILOS','tipo'=>'Directo','valor_factura'=>512095.5,'valor_comision'=>40967.64],
        ['cliente'=>'Muebles San Sebastian','destino'=>'LOS VILOS','tipo'=>'Reparto','valor_factura'=>512095.5,'valor_comision'=>40967.64],
        ['cliente'=>'Particular','destino'=>'LOS VILOS','tipo'=>'Directo','valor_factura'=>360000.0,'valor_comision'=>36000.0],
        ['cliente'=>'Particular','destino'=>'LOS VILOS','tipo'=>'Reparto','valor_factura'=>360000.0,'valor_comision'=>36000.0],

        // MELIPILLA
        ['cliente'=>'Canontex','destino'=>'MELIPILLA','tipo'=>'Directo','valor_factura'=>562500.0,'valor_comision'=>45000.0],
        ['cliente'=>'Canontex','destino'=>'MELIPILLA','tipo'=>'Reparto','valor_factura'=>562500.0,'valor_comision'=>45000.0],
        ['cliente'=>'e-Log','destino'=>'MELIPILLA','tipo'=>'Directo','valor_factura'=>400000.0,'valor_comision'=>32000.0],
        ['cliente'=>'e-Log','destino'=>'MELIPILLA','tipo'=>'Reparto','valor_factura'=>400000.0,'valor_comision'=>32000.0],


        // OSORNO
        ['cliente'=>'Carrasco Crédito','destino'=>'OSORNO','tipo'=>'Directo','valor_factura'=>1250000.0,'valor_comision'=>100000.0],
        ['cliente'=>'Carrasco Crédito','destino'=>'OSORNO','tipo'=>'Reparto','valor_factura'=>1250000.0,'valor_comision'=>100000.0],
        ['cliente'=>'Prisa','destino'=>'OSORNO','tipo'=>'Directo','valor_factura'=>1125000.0,'valor_comision'=>90000.0],
        ['cliente'=>'Prisa','destino'=>'OSORNO','tipo'=>'Reparto','valor_factura'=>1125000.0,'valor_comision'=>90000.0],
        ['cliente'=>'Trans. Ortega','destino'=>'OSORNO','tipo'=>'Directo','valor_factura'=>1250000.0,'valor_comision'=>100000.0],
        ['cliente'=>'Trans. Ortega','destino'=>'OSORNO','tipo'=>'Reparto','valor_factura'=>1250000.0,'valor_comision'=>100000.0],

        // OVALLE
        ['cliente'=>'Canontex','destino'=>'OVALLE','tipo'=>'Directo','valor_factura'=>695614.5,'valor_comision'=>55649.16],
        ['cliente'=>'Canontex','destino'=>'OVALLE','tipo'=>'Reparto','valor_factura'=>695614.5,'valor_comision'=>55649.16],

        // PICHILEMU
        ['cliente'=>'Canontex','destino'=>'PICHILEMU','tipo'=>'Directo','valor_factura'=>421186.5,'valor_comision'=>33694.92],
        ['cliente'=>'Canontex','destino'=>'PICHILEMU','tipo'=>'Reparto','valor_factura'=>421186.5,'valor_comision'=>33694.92],

        // POZO ALMONTE
        ['cliente'=>'Particular','destino'=>'POZO ALMONTE','tipo'=>'Directo','valor_factura'=>2000000.0,'valor_comision'=>160000.0],
        ['cliente'=>'Particular','destino'=>'POZO ALMONTE','tipo'=>'Reparto','valor_factura'=>2000000.0,'valor_comision'=>160000.0],


        // PUCON
        ['cliente'=>'Canontex','destino'=>'PUCON','tipo'=>'Directo','valor_factura'=>1086372.0,'valor_comision'=>86909.76],
        ['cliente'=>'Canontex','destino'=>'PUCON','tipo'=>'Reparto','valor_factura'=>1086372.0,'valor_comision'=>86909.76],

        // PUERTO MONTT
        ['cliente'=>'Canontex','destino'=>'PUERTO MONTT','tipo'=>'Directo','valor_factura'=>1250000.0,'valor_comision'=>100000.0],
        ['cliente'=>'Canontex','destino'=>'PUERTO MONTT','tipo'=>'Reparto','valor_factura'=>1250000.0,'valor_comision'=>100000.0],
        ['cliente'=>'Particular','destino'=>'PUERTO MONTT','tipo'=>'Directo','valor_factura'=>1812500.0,'valor_comision'=>145000.0],
        ['cliente'=>'Particular','destino'=>'PUERTO MONTT','tipo'=>'Reparto','valor_factura'=>1812500.0,'valor_comision'=>145000.0],


        // QUELLON
        ['cliente'=>'Deco Mueble','destino'=>'QUELLON','tipo'=>'Directo','valor_factura'=>1198528.0,'valor_comision'=>95882.24],
        ['cliente'=>'Deco Mueble','destino'=>'QUELLON','tipo'=>'Reparto','valor_factura'=>1198528.0,'valor_comision'=>95882.24],


        // RENGO
        ['cliente'=>'Muebles San Sebastian','destino'=>'RENGO','tipo'=>'Directo','valor_factura'=>300000.0,'valor_comision'=>24000.0],
        ['cliente'=>'Muebles San Sebastian','destino'=>'RENGO','tipo'=>'Reparto','valor_factura'=>300000.0,'valor_comision'=>24000.0],


        // SAN FERNANDO
        ['cliente'=>'Particular','destino'=>'SAN FERNANDO','tipo'=>'Directo','valor_factura'=>300000.0,'valor_comision'=>24000.0],
        ['cliente'=>'Particular','destino'=>'SAN FERNANDO','tipo'=>'Reparto','valor_factura'=>300000.0,'valor_comision'=>24000.0],


        // SAN PEDRO DE LA PAZ
        ['cliente'=>'Canontex','destino'=>'SAN PEDRO DE LA PAZ','tipo'=>'Directo','valor_factura'=>875000.0,'valor_comision'=>70000.0],
        ['cliente'=>'Canontex','destino'=>'SAN PEDRO DE LA PAZ','tipo'=>'Reparto','valor_factura'=>875000.0,'valor_comision'=>70000.0],


        // SANTA CRUZ
        ['cliente'=>'Particular','destino'=>'SANTA CRUZ','tipo'=>'Directo','valor_factura'=>375000.0,'valor_comision'=>30000.0],
        ['cliente'=>'Particular','destino'=>'SANTA CRUZ','tipo'=>'Reparto','valor_factura'=>375000.0,'valor_comision'=>30000.0],


        // SANTIAGO
        ['cliente'=>'Canontex','destino'=>'SANTIAGO','tipo'=>'Directo','valor_factura'=>375000.0,'valor_comision'=>30000.0],
        ['cliente'=>'Canontex','destino'=>'SANTIAGO','tipo'=>'Reparto','valor_factura'=>375000.0,'valor_comision'=>30000.0],
        ['cliente'=>'Particular','destino'=>'SANTIAGO','tipo'=>'Directo','valor_factura'=>250000.0,'valor_comision'=>20000.0],
        ['cliente'=>'Particular','destino'=>'SANTIAGO','tipo'=>'Reparto','valor_factura'=>250000.0,'valor_comision'=>20000.0],


        // TALCA
        ['cliente'=>'Muebles San Sebastian','destino'=>'TALCA','tipo'=>'Directo','valor_factura'=>350000.0,'valor_comision'=>28000.0],
        ['cliente'=>'Muebles San Sebastian','destino'=>'TALCA','tipo'=>'Reparto','valor_factura'=>350000.0,'valor_comision'=>28000.0],


        // TALCAHUANO
        ['cliente'=>'Particular','destino'=>'TALCAHUANO','tipo'=>'Directo','valor_factura'=>875000.0,'valor_comision'=>70000.0],
        ['cliente'=>'Particular','destino'=>'TALCAHUANO','tipo'=>'Reparto','valor_factura'=>875000.0,'valor_comision'=>70000.0],
        ['cliente'=>'Tottus','destino'=>'TALCAHUANO','tipo'=>'Directo','valor_factura'=>875000.0,'valor_comision'=>70000.0],
        ['cliente'=>'Tottus','destino'=>'TALCAHUANO','tipo'=>'Reparto','valor_factura'=>875000.0,'valor_comision'=>70000.0],


        // TEMUCO
        ['cliente'=>'Canontex','destino'=>'TEMUCO','tipo'=>'Directo','valor_factura'=>1000000.0,'valor_comision'=>80000.0],
        ['cliente'=>'Canontex','destino'=>'TEMUCO','tipo'=>'Reparto','valor_factura'=>1000000.0,'valor_comision'=>80000.0],
        ['cliente'=>'Prisa','destino'=>'TEMUCO','tipo'=>'Directo','valor_factura'=>1000000.0,'valor_comision'=>80000.0],
        ['cliente'=>'Prisa','destino'=>'TEMUCO','tipo'=>'Reparto','valor_factura'=>1000000.0,'valor_comision'=>80000.0],
        ['cliente'=>'Tecnopapel','destino'=>'TEMUCO','tipo'=>'Directo','valor_factura'=>1000000.0,'valor_comision'=>80000.0],
        ['cliente'=>'Tecnopapel','destino'=>'TEMUCO','tipo'=>'Reparto','valor_factura'=>1000000.0,'valor_comision'=>80000.0],
        ['cliente'=>'Trans. Ortega','destino'=>'TEMUCO','tipo'=>'Directo','valor_factura'=>1000000.0,'valor_comision'=>80000.0],
        ['cliente'=>'Trans. Ortega','destino'=>'TEMUCO','tipo'=>'Reparto','valor_factura'=>1000000.0,'valor_comision'=>80000.0],


        // VALLENAR
        ['cliente'=>'Comercial Felp','destino'=>'VALLENAR','tipo'=>'Directo','valor_factura'=>1000755.0,'valor_comision'=>80060.4],
        ['cliente'=>'Comercial Felp','destino'=>'VALLENAR','tipo'=>'Reparto','valor_factura'=>1000755.0,'valor_comision'=>80060.4],
        ['cliente'=>'Particular','destino'=>'VALLENAR','tipo'=>'Directo','valor_factura'=>1000755.0,'valor_comision'=>80060.4],
        ['cliente'=>'Particular','destino'=>'VALLENAR','tipo'=>'Reparto','valor_factura'=>1000755.0,'valor_comision'=>80060.4],


        // VALPARAISO
        ['cliente'=>'Canontex','destino'=>'VALPARAISO','tipo'=>'Directo','valor_factura'=>250000.0,'valor_comision'=>20000.0],
        ['cliente'=>'Canontex','destino'=>'VALPARAISO','tipo'=>'Reparto','valor_factura'=>250000.0,'valor_comision'=>20000.0],
    ];

    /**
     * Índice interno para recorrer presets.
     *
     * @var int
     */
    protected static int $index = 0;

    /**
     * Reinicia el índice a cero.
     */
    public static function resetIndex(): void
    {
        static::$index = 0;
    }

    /**
     * Devuelve la cantidad de presets disponibles.
     */
    public static function presetCount(): int
    {
        return count(self::$presets);
    }

    /**
     * Define el estado por defecto del factory.
     *
     * @return array<string,mixed>
     * @throws Exception si ya no quedan presets
     */
    public function definition(): array
    {
        if (static::$index >= self::presetCount()) {
            throw new Exception('No quedan presets de tarifas disponibles.');
        }

        $choice = self::$presets[static::$index++];

        // Si no existe, lo creamos para que no quede null
        $destino = Destino::firstOrCreate(
            ['nombre' => $choice['destino']],
            ['region' => 'Desconocida', 'km' => 0]
        );
        $cliente = Cliente::firstOrCreate(
            ['razon_social' => $choice['cliente']],
            ['rut' => '', 'giro' => '', 'direccion' => '', 'telefono' => '']
        );

        return [
            'destino_id'           => $destino->id,
            'cliente_principal_id' => $cliente->id,
            'tipo'                 => $choice['tipo'],
            'valor_factura'        => (int) round($choice['valor_factura']),
            'valor_comision'       => (int) round($choice['valor_comision']),
        ];
    }
}
