<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Snappy PDF / Image Configuration
    |--------------------------------------------------------------------------
    |
    | This option contains settings for PDF and image generation.
    |
    */

    'pdf' => [
        'enabled' => true,
        // ahora lee SNAPPY_PDF_BINARY de tu .env y cae a este valor por defecto
        'binary'  => env('SNAPPY_PDF_BINARY', '/usr/local/bin/wkhtmltopdf'),
        'timeout' => false,
        'options' => [],
        'env'     => [],
    ],

    'image' => [
        'enabled' => true,
        // ahora lee SNAPPY_IMG_BINARY de tu .env y cae a este valor por defecto
        'binary'  => env('SNAPPY_IMG_BINARY', '/usr/local/bin/wkhtmltoimage'),
        'timeout' => false,
        'options' => [],
        'env'     => [],
    ],

];
