<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Resumen de Pagos – {{ $periodo }}</title>
  <style>
    body {
      font-family: 'DejaVu Sans', sans-serif;
      font-size: 11px;
      margin: 30px 40px;
      color: #111827;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header img {
      height: 45px;
    }

    h1 {
      font-size: 20px;
      margin: 0;
    }

    h2 {
      font-size: 15px;
      margin-top: 40px;
      color: #111827;
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 5px;
    }

    .summary-box {
      margin-top: 10px;
      margin-bottom: 30px;
    }

    .summary-title {
      font-size: 13px;
      font-weight: 600;
      color: #1f2937;
    }

    .summary-value {
      font-size: 17px;
      font-weight: 700;
      color: #111827;
    }

    .status-pill {
      display: inline-block;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 8px;
      background-color: #ecfdf5;
      color: #047857;
      border: 1px solid #6ee7b7;
      font-weight: 600;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      margin-bottom: 20px;
    }

    th, td {
      border: 1px solid #d1d5db;
      padding: 6px 8px;
      text-align: left;
    }

    th {
      background-color: #f3f4f6;
      font-weight: 600;
      font-size: 11px;
    }

    td {
      font-size: 10.5px;
    }

    .text-right {
      text-align: right;
    }

    .footer-table {
      margin-top: 8px;
      border: 1px solid #d1d5db;
      width: 100%;
    }

    .footer-table td {
      font-weight: 600;
      font-size: 11.5px;
      padding: 6px 10px;
      background-color: #f9fafb;
    }

    .footer-table td.value {
      text-align: right;
      font-weight: 700;
      color: #111827;
    }
  </style>
</head>
<body>

  <div class="header">
    <img src="data:image/png;base64,{{ $logoBase64 }}" alt="Scar Logo">
    <h1>📋 Resumen de Pagos – {{ $periodo }}</h1>
  </div>

  @foreach($agrupados as $nombre => $grupo)
    <h2>👷 Conductor: {{ $nombre }}</h2>

    <div class="summary-box">
      <div class="summary-title">Total de Fletes: {{ count($grupo['fletes']) }}</div>
      <div class="status-pill">Periodo: {{ $periodo }}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Destino</th>
          <th>Cliente</th>
          <th>Salida</th>
          <th class="text-right">Diesel</th>
          <th class="text-right">Gastos</th>
          <th class="text-right">Viático</th>
          <th class="text-right">Saldo</th>
          <th class="text-right">Comisión</th>
          <th class="text-right">Comisión Total</th>
        </tr>
      </thead>
      <tbody>
        @foreach($grupo['fletes'] as $i => $f)
          <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $f['destino'] }}</td>
            <td>{{ $f['cliente'] }}</td>
            <td>{{ \Carbon\Carbon::parse($f['salida'])->format('d-m-Y') }}</td>
            <td class="text-right">${{ number_format($f['diesel'], 0, ',', '.') }}</td>
            <td class="text-right">${{ number_format($f['gastos'], 0, ',', '.') }}</td>
            <td class="text-right">${{ number_format($f['viatico'], 0, ',', '.') }}</td>
            <td class="text-right">${{ number_format($f['saldo'], 0, ',', '.') }}</td>
            <td class="text-right">${{ number_format($f['comision'], 0, ',', '.') }}</td>
            <td class="text-right">${{ number_format($f['comision_total'], 0, ',', '.') }}</td>
          </tr>
        @endforeach
      </tbody>
    </table>

    <table class="footer-table">
      <tr>
        <td>Total Comisión</td>
        <td class="value">${{ number_format($grupo['resumen']['total_comision'], 0, ',', '.') }}</td>
      </tr>
      <tr>
        <td>Total Saldo</td>
        <td class="value">${{ number_format($grupo['resumen']['total_saldo'], 0, ',', '.') }}</td>
      </tr>
      <tr>
        <td>Total Anticipo Sueldo</td>
        <td class="value">${{ number_format($grupo['resumen']['total_anticipo'], 0, ',', '.') }}</td>
      </tr>
    </table>
  @endforeach

</body>
</html>
