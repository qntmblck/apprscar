<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Flete;
use App\Observers\FleteObserver;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Flete::observe(FleteObserver::class);
    }
}
