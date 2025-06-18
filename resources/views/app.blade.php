<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">

    {{-- 1. Meta CSRF obligatorio para Laravel --}}
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- 2. Evita el zoom en móviles al enfocar inputs de 16px --}}
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    {{-- 3. Título dinámico con Inertia --}}
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    {{-- 4. Ziggy (inserta tus rutas de Laravel en JS) --}}
    @routes

    {{-- 5. Fuentes --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    {{-- 6. Inertia + Vite (React) --}}
    @viteReactRefresh
    @vite([
        'resources/js/app.jsx',
        "resources/js/Pages/{$page['component']}.jsx",
    ])

    {{-- 7. Tags dinámicos de Inertia (meta, title, etc.) --}}
    @inertiaHead
</head>
<body class="font-sans antialiased bg-gray-50">
    {{-- 8. Punto de unión para Inertia --}}
    @inertia

    {{--
        9. Exponer Ziggy en window.route.
    --}}
    <script type="module">
        import route from '/vendor/ziggy/js';
        window.route = route;
    </script>
</body>
</html>
