<!-- resources/views/emails/fletes/notificado_plain.blade.php -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Tu flete está en camino</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin:0; padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: #0c1e3a; padding: 20px; text-align: center;">
              <img src="{{ asset('img/logo-scar.png') }}" alt="Transportes SCAR" style="height: 50px;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px;">
              <h1 style="color: #0c1e3a; margin-top: 0;">¡Tu flete está en camino!</h1>

              <p><strong>Flete #{{ $flete->id }}</strong></p>
              <p><strong>Destino:</strong> {{ $flete->destino->nombre }}</p>
              <p><strong>Fecha de salida:</strong> {{ $flete->fecha_salida->format('d-m-Y') }}</p>

              @isset($adicionales)
                <h2 style="margin-bottom: 8px; color: #0c1e3a;">Adicionales</h2>
                <ul style="padding-left: 20px; margin-top: 0;">
                  @foreach($adicionales as $ad)
                    <li style="margin-bottom: 4px;">
                      {{ $ad->descripcion }}: ${{ number_format($ad->monto,0,',','.') }}
                    </li>
                  @endforeach
                </ul>
              @endisset

              <!-- Botón manual -->
              <p style="text-align: center; margin: 30px 0;">
                <a href="{{ route('fletes.show', $flete->id) }}"
                   style="background-color: #0c1e3a; color: #ffffff; padding: 12px 24px; border-radius: 4px; text-decoration: none; display: inline-block;">
                  Ver detalles del flete
                </a>
              </p>

              <p>Gracias por confiar en Transportes SCAR.</p>
              <p>Saludos,<br>El equipo de SCAR</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f0f0f0; padding: 12px; text-align: center; font-size: 12px; color: #666;">
              © {{ date('Y') }} Transportes SCAR. Todos los derechos reservados.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
