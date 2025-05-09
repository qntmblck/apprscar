<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 2rem;
      color: #333;
    }
    .container {
      background-color: #fff;
      border-radius: 8px;
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    }
    h2 {
      color: #0c1e3a;
      font-size: 1.5rem;
      margin-bottom: 1.2rem;
    }
    .label {
      color: #6366f1;
      font-weight: 600;
      margin-top: 1rem;
    }
    .value {
      margin-bottom: 0.75rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>📝 Nueva solicitud de cotización</h2>

    <div class="label">Nombre:</div>
    <div class="value">{{ $data['first_name'] }} {{ $data['last_name'] }}</div>

    <div class="label">Correo electrónico:</div>
    <div class="value">{{ $data['email'] }}</div>

    <div class="label">Teléfono:</div>
    <div class="value">{{ $data['phone'] ?? 'No especificado' }}</div>

    <div class="label">Mensaje:</div>
    <div class="value">{{ $data['message'] }}</div>
  </div>
</body>
</html>
