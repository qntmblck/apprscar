<?php

namespace Database\Factories;

use App\Models\Destino;
use Illuminate\Database\Eloquent\Factories\Factory;
use Exception;

class DestinoFactory extends Factory
{
    /**
     * El modelo asociado
     *
     * @var string
     */
    protected $model = Destino::class;

    /**
     * Presets para destinos
     *
     * @var array<int, array<string, mixed>>
     */
    protected static array $presets = [
            ['nombre' => 'ANCUD',                   'region' => 'Los Lagos',              'km' => 1105],
            ['nombre' => 'ANDACOLLO',               'region' => 'Coquimbo',              'km' => 511],
            ['nombre' => 'ANGOL',                   'region' => 'La Araucanía',          'km' => 550],
            ['nombre' => 'ANTOFAGASTA',             'region' => 'Antofagasta',           'km' => 1367],
            ['nombre' => 'ARAUCO',                  'region' => 'Biobío',                'km' => 553],
            ['nombre' => 'ARICA',                   'region' => 'Arica y Parinacota',    'km' => 2066],
            ['nombre' => 'AYSÉN',                   'region' => 'Aysén',                 'km' => 1646],
            ['nombre' => 'BAQUEDANO',               'region' => 'Antofagasta',           'km' => 76],
            ['nombre' => 'BUIN',                    'region' => 'Metropolitana',         'km' => 22],
            ['nombre' => 'POZO ALMONTE',            'region' => 'Tarapacá',              'km' => 1720],
            ['nombre' => 'CABILDO',                 'region' => 'Valparaíso',            'km' => 203],
            ['nombre' => 'CABRERO',                 'region' => 'Biobío',                'km' => 446],
            ['nombre' => 'CALAMA',                  'region' => 'Antofagasta',           'km' => 1567],
            ['nombre' => 'CALBUCO',                 'region' => 'Los Lagos',             'km' => 1064],
            ['nombre' => 'CALDERA',                 'region' => 'Atacama',               'km' => 904],
            ['nombre' => 'CAÑETE',                  'region' => 'Biobío',                'km' => 618],
            ['nombre' => 'CARAHUE',                 'region' => 'La Araucanía',          'km' => 725],
            ['nombre' => 'CASA BLANCA',             'region' => 'Valparaíso',            'km' => 101],
            ['nombre' => 'CASTRO',                  'region' => 'Los Lagos',             'km' => 1181],
            ['nombre' => 'CHILOÉ',                  'region' => 'Los Lagos',             'km' => 1235],
            ['nombre' => 'CAUQUENES',               'region' => 'Maule',                 'km' => 339],
            ['nombre' => 'CHANCO',                  'region' => 'Maule',                 'km' => 408],
            ['nombre' => 'CHAÑARAL',                'region' => 'Atacama',               'km' => 995],
            ['nombre' => 'CHEPICA',                 'region' => 'O’Higgins',             'km' => 160],
            ['nombre' => 'CHIGUAYANTE',             'region' => 'Biobío',                'km' => 503],
            ['nombre' => 'CHILLÁN',                 'region' => 'Ñuble',                 'km' => 388],
            ['nombre' => 'CHIMBARONGO',             'region' => 'O’Higgins',             'km' => 138],
            ['nombre' => 'CHOLCHOL',                'region' => 'La Araucanía',          'km' => 686],
            ['nombre' => 'CHUQUICAMATA',            'region' => 'Antofagasta',           'km' => 1587],
            ['nombre' => 'COELEMU',                 'region' => 'Ñuble',                 'km' => 454],
            ['nombre' => 'COIHUECO',                'region' => 'Ñuble',                 'km' => 409],
            ['nombre' => 'COLLIPULLI',              'region' => 'La Araucanía',          'km' => 563],
            ['nombre' => 'COLTAUCO',                'region' => 'O’Higgins',             'km' => 103],
            ['nombre' => 'COMBARBALA',              'region' => 'Coquimbo',              'km' => 383],
            ['nombre' => 'CON CON',                 'region' => 'Valparaíso',            'km' => 159],
            ['nombre' => 'CONCEPCIÓN',              'region' => 'Biobío',                'km' => 482],
            ['nombre' => 'CONSTITUCIÓN',            'region' => 'Maule',                 'km' => 347],
            ['nombre' => 'COPIAPÓ',                 'region' => 'Atacama',               'km' => 837],
            ['nombre' => 'COQUIMBO',                'region' => 'Coquimbo',              'km' => 492],
            ['nombre' => 'CORONEL',                 'region' => 'Biobío',                'km' => 515],
            ['nombre' => 'COYHAIQUE',               'region' => 'Aysén',                 'km' => 1675],
            ['nombre' => 'CUNCO',                   'region' => 'La Araucanía',          'km' => 719],
            ['nombre' => 'CURACAUTIN',              'region' => 'La Araucanía',          'km' => 655],
            ['nombre' => 'CURANILAHUE',             'region' => 'Biobío',                'km' => 576],
            ['nombre' => 'CUREPTO',                 'region' => 'Maule',                 'km' => 278],
            ['nombre' => 'CURICÓ',                  'region' => 'Maule',                 'km' => 178],
            ['nombre' => 'DIEGO DE ALMAGRO',        'region' => 'Atacama',               'km' => 981],
            ['nombre' => 'DOÑIHUE',                 'region' => 'O’Higgins',             'km' => 91],
            ['nombre' => 'EL SALVADOR',             'region' => 'Atacama',               'km' => 1034],
            ['nombre' => 'FRUTILLAR',               'region' => 'Los Lagos',             'km' => 973],
            ['nombre' => 'FUTRONO',                 'region' => 'Los Ríos',              'km' => 876],
            ['nombre' => 'GALVARINO',               'region' => 'La Araucanía',          'km' => 664],
            ['nombre' => 'GRANEROS',                'region' => 'O’Higgins',             'km' => 58],
            ['nombre' => 'HUALAÑE',                 'region' => 'Maule',                 'km' => 240],
            ['nombre' => 'HUALPÉN',                 'region' => 'Biobío',                'km' => 489],
            ['nombre' => 'HUALQUI',                 'region' => 'Biobío',                'km' => 511],
            ['nombre' => 'ILLAPEL',                 'region' => 'Coquimbo',              'km' => 313],
            ['nombre' => 'IQUIQUE',                 'region' => 'Tarapacá',              'km' => 1789],
            ['nombre' => 'LA CALERA',               'region' => 'Valparaíso',            'km' => 146],
            ['nombre' => 'LA LIGUA',                'region' => 'Valparaíso',            'km' => 182],
            ['nombre' => 'LA SERENA',               'region' => 'Coquimbo',              'km' => 503],
            ['nombre' => 'LA UNIÓN',                'region' => 'Los Ríos',              'km' => 886],
            ['nombre' => 'LAJA',                    'region' => 'Biobío',                'km' => 496],
            ['nombre' => 'LANCO',                   'region' => 'Los Ríos',              'km' => 760],
            ['nombre' => 'LAS CABRAS',              'region' => 'O’Higgins',             'km' => 171],
            ['nombre' => 'LEBU',                    'region' => 'Biobío',                'km' => 624],
            ['nombre' => 'LICANTÉN',                'region' => 'Maule',                 'km' => 259],
            ['nombre' => 'LIMACHE',                 'region' => 'Valparaíso',            'km' => 150],
            ['nombre' => 'LINARES',                 'region' => 'Maule',                 'km' => 289],
            ['nombre' => 'LLANQUIHUE',              'region' => 'Los Lagos',             'km' => 990],
            ['nombre' => 'LLAY-LLAY',               'region' => 'Valparaíso',            'km' => 119],
            ['nombre' => 'LONCOCHE',                'region' => 'La Araucanía',          'km' => 744],
            ['nombre' => 'LONGAVÍ',                 'region' => 'Maule',                 'km' => 301],
            ['nombre' => 'LONQUIMAY',               'region' => 'La Araucanía',          'km' => 720],
            ['nombre' => 'LOS ANDES',               'region' => 'Valparaíso',            'km' => 110],
            ['nombre' => 'LOS ÁNGELES',             'region' => 'Biobío',                'km' => 495],
            ['nombre' => 'LOS LAGOS',               'region' => 'Los Ríos',              'km' => 498],
            ['nombre' => 'LOS MUERMOS',             'region' => 'Los Lagos',             'km' => 1046],
            ['nombre' => 'LOS VILOS',               'region' => 'Coquimbo',              'km' => 256],
            ['nombre' => 'LOTA',                    'region' => 'Biobío',                'km' => 521],
            ['nombre' => 'MALLOA',                  'region' => 'O’Higgins',             'km' => 107],
            ['nombre' => 'MARÍA ELENA',             'region' => 'Antofagasta',           'km' => 1574],
            ['nombre' => 'MEJILLONES',              'region' => 'Antofagasta',           'km' => 1438],
            ['nombre' => 'MELIPEUCO',               'region' => 'La Araucanía',          'km' => 740],
            ['nombre' => 'MELIPILLA',               'region' => 'Metropolitana',         'km' => 90],
            ['nombre' => 'MOLINA',                  'region' => 'Maule',                 'km' => 194],
            ['nombre' => 'MONTE PATRIA',            'region' => 'Coquimbo',              'km' => 467],
            ['nombre' => 'MULCHÉN',                 'region' => 'Biobío',                'km' => 530],
            ['nombre' => 'NACIMIENTO',              'region' => 'Biobío',                'km' => 526],
            ['nombre' => 'NUEVA IMPERIAL',          'region' => 'La Araucanía',          'km' => 703],
            ['nombre' => 'OSORNO',                  'region' => 'Los Lagos',             'km' => 911],
            ['nombre' => 'OVALLE',                  'region' => 'Coquimbo',              'km' => 435],
            ['nombre' => 'PAILLACO',                'region' => 'Los Ríos',              'km' => 849],
            ['nombre' => 'PANGUIPULLI',             'region' => 'Los Ríos',              'km' => 808],
            ['nombre' => 'PARRAL',                  'region' => 'Maule',                 'km' => 325],
            ['nombre' => 'PENCAHUE',                'region' => 'Maule',                 'km' => 253],
            ['nombre' => 'PENCO',                   'region' => 'Biobío',                'km' => 475],
            ['nombre' => 'PERALILLO',               'region' => 'O’Higgins',             'km' => 190],
            ['nombre' => 'PETORCA',                 'region' => 'Valparaíso',            'km' => 236],
            ['nombre' => 'PICHIDANGUI',             'region' => 'Coquimbo',              'km' => 227],
            ['nombre' => 'PICHILEMU',               'region' => 'O’Higgins',             'km' => 251],
            ['nombre' => 'PIRQUE',                  'region' => 'Metropolitana',         'km' => 27],
            ['nombre' => 'PITRUFQUÉN',              'region' => 'La Araucanía',          'km' => 700],
            ['nombre' => 'PUCÓN',                   'region' => 'La Araucanía',          'km' => 766],
            ['nombre' => 'PUERTO MONTT',            'region' => 'Los Lagos',             'km' => 1015],
            ['nombre' => 'PUERTO NATALES',          'region' => 'Magallanes',            'km' => 2818],
            ['nombre' => 'PUERTO OCTAY',            'region' => 'Los Lagos',             'km' => 961],
            ['nombre' => 'PUERTO SAAVEDRA',         'region' => 'La Araucanía',          'km' => 755],
            ['nombre' => 'PUERTO VARAS',            'region' => 'Los Lagos',             'km' => 997],
            ['nombre' => 'PUNTA ARENAS',            'region' => 'Magallanes',            'km' => 2972],
            ['nombre' => 'PURRANQUE',               'region' => 'Los Lagos',             'km' => 948],
            ['nombre' => 'PUYEHUE',                 'region' => 'Los Lagos',             'km' => 814],
            ['nombre' => 'QUELLÓN',                 'region' => 'Los Lagos',             'km' => 1266],
            ['nombre' => 'QUILLÓN',                 'region' => 'Ñuble',                 'km' => 427],
            ['nombre' => 'QUILLOTA',                'region' => 'Valparaíso',            'km' => 156],
            ['nombre' => 'QUILPUÉ',                 'region' => 'Valparaíso',            'km' => 150],
            ['nombre' => 'QUINTA TILCOCO',          'region' => 'O’Higgins',             'km' => 105],
            ['nombre' => 'QUIRIHUE',                'region' => 'Ñuble',                 'km' => 387],
            ['nombre' => 'RANCAGUA',                'region' => 'O’Higgins',             'km' => 69],
            ['nombre' => 'RENGO',                   'region' => 'O’Higgins',             'km' => 112],
            ['nombre' => 'REÑACA',                  'region' => 'Valparaíso',            'km' => 155],
            ['nombre' => 'REQUINOA',                'region' => 'O’Higgins',             'km' => 85],
            ['nombre' => 'SAGRADA FAMILIA',         'region' => 'Maule',                 'km' => 199],
            ['nombre' => 'SALAMANCA',               'region' => 'Coquimbo',              'km' => 332],
            ['nombre' => 'SAN ANTONIO',             'region' => 'Valparaíso',            'km' => 133],
            ['nombre' => 'SAN CARLOS',              'region' => 'Ñuble',                 'km' => 365],
            ['nombre' => 'SAN CLEMENTE',            'region' => 'Maule',                 'km' => 257],
            ['nombre' => 'SAN FELIPE',              'region' => 'Valparaíso',            'km' => 125],
            ['nombre' => 'SAN FERNANDO',            'region' => 'O’Higgins',             'km' => 122],
            ['nombre' => 'SAN JAVIER',              'region' => 'Maule',                 'km' => 258],
            ['nombre' => 'SAN JOSÉ DE LA MARIQUINA','region' => 'Los Ríos',              'km' => 783],
            ['nombre' => 'SAN PEDRO DE LA PAZ',     'region' => 'Biobío',                'km' => 489],
            ['nombre' => 'SAN VICENTE T.T.',        'region' => 'O’Higgins',             'km' => 124],
            ['nombre' => 'SANTA BÁRBARA',           'region' => 'Biobío',                'km' => 532],
            ['nombre' => 'SANTA CRUZ',              'region' => 'O’Higgins',             'km' => 163],
            ['nombre' => 'SANTA JUANA',             'region' => 'Biobío',                'km' => 537],
            ['nombre' => 'SANTIAGO',                'region' => 'Metropolitana',         'km' => 34],
            ['nombre' => 'TAL TAL',                 'region' => 'Antofagasta',           'km' => 1180],
            ['nombre' => 'TALCA',                   'region' => 'Maule',                 'km' => 238],
            ['nombre' => 'TALCAHUANO',              'region' => 'Biobío',                'km' => 485],
            ['nombre' => 'TEMUCO',                  'region' => 'La Araucanía',          'km' => 660],
            ['nombre' => 'TENO',                    'region' => 'Maule',                 'km' => 162],
            ['nombre' => 'TIRÚA',                   'region' => 'Biobío',                'km' => 685],
            ['nombre' => 'TOCOPILLA',               'region' => 'Antofagasta',           'km' => 1560],
            ['nombre' => 'TOLTÉN',                  'region' => 'La Araucanía',          'km' => 758],
            ['nombre' => 'TOMÉ',                    'region' => 'Biobío',                'km' => 490],
            ['nombre' => 'TRAIGUÉN',                'region' => 'La Araucanía',          'km' => 629],
            ['nombre' => 'TUCAPEL-HUEPIL',          'region' => 'Biobío',                'km' => 490],
            ['nombre' => 'CURAUMA',                 'region' => 'Valparaíso',            'km' => 132],
            ['nombre' => 'VALDIVIA',                'region' => 'Los Ríos',              'km' => 833],
            ['nombre' => 'VALLENAR',                'region' => 'Atacama',               'km' => 695],
            ['nombre' => 'VALPARAÍSO',              'region' => 'Valparaíso',            'km' => 140],
            ['nombre' => 'VICTORIA',                'region' => 'La Araucanía',          'km' => 598],
            ['nombre' => 'VICUÑA',                  'region' => 'Coquimbo',              'km' => 565],
            ['nombre' => 'VILCÚN',                  'region' => 'La Araucanía',          'km' => 679],
            ['nombre' => 'VILLA ALEMANA',           'region' => 'Valparaíso',            'km' => 140],
            ['nombre' => 'PICA',                    'region' => 'Tarapacá',              'km' => 1790],
            ['nombre' => 'VILLARRICA',              'region' => 'La Araucanía',          'km' => 743],
            ['nombre' => 'VIÑA DEL MAR',            'region' => 'Valparaíso',            'km' => 146],
            ['nombre' => 'YUMBEL',                  'region' => 'Biobío',                'km' => 465],
            ['nombre' => 'YUNGAY',                  'region' => 'Ñuble',                 'km' => 478],
            ['nombre' => 'CALERA DE TANGO',         'region' => 'Metropolitana',         'km' => 34],
        ];

    /**
     * Número exacto de presets disponibles
     */
    public const PRESET_COUNT = 100; // Ajusta este número al total de entradas en $presets

    /**
     * Índice interno para recorrer presets
     *
     * @var int
     */
    protected static int $index = 0;

    /**
     * Define el estado por defecto del factory
     *
     * @return array<string, mixed>
     * @throws Exception si ya no quedan presets
     */
    public function definition(): array
    {
        if (static::$index >= self::PRESET_COUNT) {
            throw new Exception('No quedan destinos únicos disponibles en DestinoFactory. Agrega más presets.');
        }

        $choice = self::$presets[static::$index++];

        return [
            'nombre' => $choice['nombre'],
            'region' => $choice['region'],
            'km'     => $choice['km'],
        ];
    }
}


