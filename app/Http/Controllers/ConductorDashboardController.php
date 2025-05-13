<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ConductorDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboards/ConductorDashboard');
    }
}
