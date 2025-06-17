@component('mail::message')
# ¡Tu flete está en camino!

**Flete #{{ $flete->id }}**
Destino: {{ $flete->destino->nombre }}
Fecha salida: {{ $flete->fecha_salida->format('d-m-Y') }}

@isset($adicionales)
## Adicionales
@foreach($adicionales as $ad)
- {{ $ad->descripcion }}: ${{ number_format($ad->monto,0,',','.') }}
@endforeach
@endisset

Gracias por confiar en nosotros.
Saludos,<br>
Transportes SCAR
@endcomponent
