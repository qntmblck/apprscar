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

    .status-pill {
      display: inline-block;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 8px;
      background-color: #ecfdf5;
      color: #047857;
      border: 1px solid #6ee7b7;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .summary-grid {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    .summary-card {
      flex: 1;
      background-color: #f3f4f6;
      padding: 12px 16px;
      border-radius: 8px;
      text-align: center;
    }
    .summary-card .title {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .summary-card .value {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    table.stripe tbody tr:nth-child(even) {
      background-color: #f9fafb;
    }
    th, td {
      border: 1px solid #d1d5db;
      padding: 8px 10px;
      text-align: left;
      font-size: 10.5px;
    }
    th {
      background-color: #e5e7eb;
      font-weight: 600;
      font-size: 11px;
    }
    .text-right {
      text-align: right;
    }
    tfoot td {
      background-color: #f3f4f6;
      font-weight: 600;
      font-size: 11px;
      padding: 8px 10px;
    }
  </style>
</head>
<body>

  <div class="header">
    <img src="data:image/png;base64,{{ $logoBase64 }}" alt="Scar Logo">
    <h1>📋 Resumen de Pagos</h1>
  </div>

  <div class="status-pill">Periodo: {{ $periodo }}</div>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="title">Fletes Totales</div>
      <div class="value">{{ count($fletes) }}</div>
    </div>
    <div class="summary-card">
      <div class="title">Saldo Total</div>
      <div class="value">
        ${{ number_format($fletes->sum(fn($f) => optional($f->rendicion)->saldo ?? 0), 0, ',', '.') }}
      </div>
    </div>
    <div class="summary-card">
      <div class="title">Comisión Total</div>
      <div class="value">
        ${{ number_format($fletes->sum(fn($f) => optional($f->rendicion)->comision ?? 0), 0, ',', '.') }}
      </div>
    </div>
  </div>

  <table class="stripe">
    <thead>
      <tr>
        <th>#</th>
        <th>Conductor</th>
        <th>Destino</th>
        <th>Cliente</th>
        <th>Salida</th>
        <th class="text-right">Saldo</th>
        <th class="text-right">Comisión</th>
      </tr>
    </thead>
    <tbody>
      @foreach($fletes as $i => $f)
        <tr>
          <td>{{ $i + 1 }}</td>
          <td>{{ optional($f->conductor)->name ?? '—' }}</td>
          <td>{{ optional($f->destino)->nombre ?? '—' }}</td>
          <td>{{ optional($f->clientePrincipal)->nombre ?? '—' }}</td>
          <td>{{ $f->fecha_salida
              ? \Carbon\Carbon::parse($f->fecha_salida)->format('d-m-Y')
              : '—' }}
          </td>
          <td class="text-right">
            ${{ number_format(optional($f->rendicion)->saldo ?? 0, 0, ',', '.') }}
          </td>
          <td class="text-right">
            ${{ number_format(optional($f->rendicion)->comision ?? 0, 0, ',', '.') }}
          </td>
        </tr>
      @endforeach
    </tbody>
    <tfoot>
      <tr>
        <td colspan="5" class="text-right">Totales:</td>
        <td class="text-right">
          ${{ number_format($fletes->sum(fn($f) => optional($f->rendicion)->saldo ?? 0), 0, ',', '.') }}
        </td>
        <td class="text-right">
          ${{ number_format($fletes->sum(fn($f) => optional($f->rendicion)->comision ?? 0), 0, ',', '.') }}
        </td>
      </tr>
    </tfoot>
  </table>

</body>
</html>
