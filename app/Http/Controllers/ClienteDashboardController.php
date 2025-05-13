<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ClienteDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboards/ClienteDashboard');
    }
}
