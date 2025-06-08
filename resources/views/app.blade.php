<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    {{-- 1. Meta CSRF obligatorio para Laravel --}}
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- 2. Título dinámico con Inertia --}}
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    {{-- 3. Ziggy (inserta tus rutas de Laravel en JS) --}}
    @routes

    {{-- 4. Fuentes --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    {{-- 5. Inertia + Vite (React) --}}
    @viteReactRefresh
    @vite([
        'resources/js/app.jsx',
        "resources/js/Pages/{$page['component']}.jsx",
    ])

    {{-- 6. Tags dinámicos de Inertia (meta, title, etc.) --}}
    @inertiaHead
</head>
<body class="font-sans antialiased bg-gray-50">
    {{-- 7. Punto de unión para Inertia --}}
    @inertia

    {{--
        8. Exponer Ziggy en window.route.
        Cuando hagas npm run build, Vite dejará en public/vendor/ziggy/js
        la versión optimizada.
    --}}
    <script type="module">
        import route from '/vendor/ziggy/js';
        window.route = route;
    </script>
</body>
</html>
