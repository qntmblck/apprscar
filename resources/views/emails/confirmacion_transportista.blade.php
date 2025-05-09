<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f9f9f9;
      padding: 2rem;
      color: #333;
    }
    .container {
      background: #fff;
      border-radius: 8px;
      padding: 2rem;
      max-width: 600px;
      margin: auto;
      box-shadow: 0 5px 20px rgba(0,0,0,0.05);
    }
    .title {
      color: #0c1e3a;
      font-size: 1.4rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
    }
    .message {
      margin-bottom: 1.5rem;
    }
    .footer {
      font-size: 0.9rem;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">Gracias por tu solicitud, {{ $data['nombre'] }}.</div>

    <div class="message">
      Hemos recibido tu propuesta como transportista y te contactaremos si tu perfil es compatible con nuestras necesidades actuales.
    </div>

    <div>
      <strong>Resumen:</strong>
      <ul>
        <li><strong>Email:</strong> {{ $data['email'] }}</li>
        <li><strong>Teléfono:</strong> {{ $data['telefono'] ?? 'No especificado' }}</li>
        <li><strong>Mensaje:</strong> {{ $data['mensaje'] }}</li>
      </ul>
    </div>

    <div class="footer mt-6">
      Transportes SCAR · contacto@scartransportes.cl
    </div>
  </div>
</body>
</html>
