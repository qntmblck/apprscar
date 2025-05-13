<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class SuperDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboards/SuperDashboard');
    }
}
