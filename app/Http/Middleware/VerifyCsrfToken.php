<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as BaseVerifier;

class VerifyCsrfToken extends BaseVerifier
{
    /**
     * Las URIs que quedan exentas de la verificación CSRF.
     *
     * @var array<int,string>
     */
    protected $except = [
        'fletes/batch/notificar',
        'fletes/batch/notificar/*',
        'fletes/batch/*',
    ];
}
