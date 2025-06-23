<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Pagos – {{ $periodo }}</title>
  <style>
    body {
      font-family: 'DejaVu Sans', sans-serif;
      font-size: 11px;
      margin: 30px 40px;
      color: #111827;
    }

    /* Encabezado como tabla para compatibilidad con PDF */
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      border: none;
    }
    .header-table td {
      vertical-align: top;
      padding: 0;
      border: none;
    }

    /* Tabla resumen compacta en encabezado */
    .header-summary {
      border-collapse: collapse;
      font-size: 11px;
      white-space: nowrap;
    }
    .header-summary th,
    .header-summary td {
      border: 1px solid #d1d5db;
      padding: 4px 6px;
      text-align: center;
    }
    .header-summary th {
      background-color: #e5e7eb;
      font-weight: 600;
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

    table.stripe {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    table.stripe tbody tr:nth-child(even) {
      background-color: #f9fafb;
    }
    table.stripe th,
    table.stripe td {
      border: 1px solid #d1d5db;
      padding: 8px 10px;
      text-align: left;
      font-size: 10.5px;
    }
    table.stripe th {
      background-color: #e5e7eb;
      font-weight: 600;
      font-size: 11px;
    }
    .text-right {
      text-align: right;
    }
    table.stripe tfoot td {
      background-color: #f3f4f6;
      font-weight: 600;
      font-size: 11px;
      padding: 8px 10px;
    }
  </style>
</head>
<body>

  <!-- ENCABEZADO: logo y resumen -->
  <table class="header-table">
    <tr>
      <td style="text-align:left;">
        <img src="data:image/png;base64,{{ $logoBase64 }}" alt="Scar Logo" style="height:45px;">
      </td>
      <td style="text-align:right;">
        <!-- Se añade margen superior para bajar la tabla -->
        <table class="header-summary" style="margin-top:12px; margin-left:auto; margin-right:0;">
          <thead>
            <tr>
              <th>Fletes Totales</th>
              <th>Saldo Total</th>
              <th>Comisión Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ count($fletes) }}</td>
              <td>${{ number_format($fletes->sum(fn($f) => optional($f->rendicion)->saldo ?? 0), 0, ',', '.') }}</td>
              <td>${{ number_format($fletes->sum(fn($f) => optional($f->rendicion)->comision ?? 0), 0, ',', '.') }}</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td><strong>Resultado</strong></td>
              <td><strong>${{ number_format(
                $fletes->sum(fn($f) => optional($f->rendicion)->comision ?? 0)
                - $fletes->sum(fn($f) => optional($f->rendicion)->saldo ?? 0),
              0, ',', '.') }}</strong></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </table>

  <div class="status-pill">Periodo: {{ $periodo }}</div>

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
