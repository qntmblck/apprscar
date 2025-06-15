// resources/js/Components/FleteCard/BackDetails.jsx
import React from 'react'
import classNames from 'classnames'

export default function BackDetails({
  registros = [],
  viaticoEfec = 0,
  saldoTemporal = 0,
  onEliminarRegistro = () => {},
  isSubmitting = false,
}) {
  // 1) Extraemos Comisión y Retornos
  const comision = registros.find(r => r.tipo === 'Comisión')
  const retornos = registros.filter(
    r => r.tipo === 'Retorno' || r.metodo === 'Retorno'
  )

  // 2) El resto, ordenado descendente
  const otros = registros
    .filter(
      r =>
        r.tipo !== 'Comisión' &&
        !(r.tipo === 'Retorno' || r.metodo === 'Retorno')
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const renderRow = (r, key) => {
    const esDiesel = 'litros' in r && 'metodo_pago' in r
    const esAbono = 'metodo' in r && !esDiesel
    const esRetorno = esAbono && r.metodo === 'Retorno'
    const esAdicional = r.tipo === 'Adicional'
    const esComision = r.tipo === 'Comisión'

    const tipo = esDiesel
      ? 'Diésel'
      : esRetorno
      ? 'Retorno'
      : esAbono
      ? 'Abono'
      : esAdicional
      ? 'Adicional'
      : esComision
      ? 'Comisión'
      : 'Gasto'

    const detalle = esDiesel
      ? r.metodo_pago
      : esAbono
      ? r.metodo
      : esAdicional
      ? r.descripcion
      : esComision
      ? ''
      : r.tipo === 'Otro'
      ? `Otros: ${r.descripcion}`
      : r.tipo

    const bgColor = esDiesel
      ? 'bg-blue-50 text-blue-700'
      : esRetorno
      ? 'bg-yellow-50 text-yellow-700'
      : esAbono
      ? 'bg-green-50 text-green-700'
      : esAdicional
      ? 'bg-blue-50 text-blue-700'
      : esComision
      ? 'bg-purple-50 text-purple-700'
      : 'bg-red-50 text-red-700'

    const monto = (r.monto ?? r.total ?? 0).toLocaleString('es-CL')

    return (
      <div
        key={key}
        className={classNames(
          'grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] items-start py-1 gap-x-2 border-b last:border-b-0 px-2 rounded-md',
          bgColor
        )}
      >
        <div className="font-medium">{tipo}</div>
        <div className="break-words">{detalle}</div>
        <div className="flex items-center justify-end space-x-2">
          <span>${monto}</span>
          <button
            onClick={() => onEliminarRegistro(r)}
            disabled={isSubmitting}
            className={classNames(
              'ml-2',
              isSubmitting
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-red-500 hover:text-red-700'
            )}
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Título */}
      <h3 className="text-sm font-semibold text-gray-800 mb-2">
        Detalle completo
      </h3>

      {/* Filas de Comisión y Retorno con mismo estilo de filas adicionales */}
      <div className="space-y-1 text-xs">
        {comision && renderRow(comision, 'com')}
        {retornos.map((r, i) => renderRow(r, `ret-${i}`))}
      </div>

      {/* Título */}
      <h3 className="text-sm font-semibold text-gray-800 mb-2 mt-4">
        Detalle Saldo
      </h3>

      {/* Resto de registros */}
      <div className="space-y-1 text-xs">
        {otros.map((r, i) => renderRow(r, i))}
      </div>

      {/* Valores al pie */}
      <div className="mt-4 pt-4 border-t space-y-2">
        <div className="flex justify-between text-xs">
          <span className="font-medium">Viático</span>
          <span>${viaticoEfec.toLocaleString('es-CL')}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-green-700">
          <span>Saldo final</span>
          <span>${saldoTemporal.toLocaleString('es-CL')}</span>
        </div>
      </div>
    </div>
  )
}
