<!-- resources/views/emails/fletes/notificado.blade.php -->
@php
    // 1) Colección de todos los adicionales
    $items = collect($adicionales ?? []);

    // 2) Aquellos con monto = 0 o null (zeros)
    $zeros = $items->filter(fn($ad) => $ad->monto == 0 || is_null($ad->monto));

    // 3) Aquellos con monto > 0 (detalle)
    $detalle = $items->filter(fn($ad) => $ad->monto > 0);

    // 4) Construimos el mismo subjectList que en tu controlador
    $subjectList = collect()
        ->push($flete->guiaruta)                       // "124768 - 124765"
        ->push(optional($flete->destino)->nombre ?? '') // "Coquimbo"
        ->merge($zeros->pluck('descripcion'))           // ["La Cantera","Peñuelas"]
        ->filter()                                      // elimina cadenas vacías
        ->implode(', ');                                // => "124768 - 124765, Coquimbo, La Cantera, Peñuelas"
@endphp

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Rendición {{ $subjectList }}</title>
  <style>
    body { margin:0; padding:0; background:#edf2f7; font-family:Arial,sans-serif; color:#333 }
    .container { max-width:600px; margin:40px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1) }
    .header { background:#0c1e3a; padding:20px; text-align:center }
    .header img { height:50px }
    .content { padding:30px; line-height:1.6 }
    .content p { margin-bottom:16px }
    .content h3 { margin:24px 0 12px; color:#0c1e3a; font-size:16px; border-bottom:1px solid #e2e8f0; padding-bottom:4px }
    .content ul { padding-left:20px; margin:0 0 20px }
    .content li { margin-bottom:8px }
    .footer { background:#f7fafc; text-align:center; padding:16px; font-size:12px; color:#777 }
  </style>
</head>
<body>
  <div class="container">

    <!-- Header con logo -->
    <div class="header">
      <img src="{{ asset('img/scar3.png') }}" alt="Transportes SCAR">
    </div>

    <!-- Cuerpo -->
    <div class="content">
      <p>Estimada Srta. Tabita,</p>

      <p>
        Por la presente, notificamos la realización de la ruta
        <strong>{{ $subjectList }}</strong>
        con fecha <strong>{{ $flete->fecha_salida->format('d-m-Y') }}</strong>.
      </p>

      @if($detalle->isNotEmpty())
        <h3>Detalle de adicionales</h3>
        <ul>
          @foreach($detalle as $ad)
            <li>
              {{ $ad->descripcion }}:
              <strong>${{ number_format($ad->monto, 0, ',', '.') }}</strong>
            </li>
          @endforeach
        </ul>
      @else
        <p>Quedamos atentos a cualquier requerimiento adicional.</p>
      @endif

      <p>Gracias por confiar en Transportes SCAR.</p>
      <p>Saludos cordiales,<br>El equipo de SCAR</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      © {{ date('Y') }} Transportes SCAR. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>
