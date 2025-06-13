// resources/js/Components/FleteCard/RecordRow.jsx
import React from 'react'
import classNames from 'classnames'

export default function RecordRow({ registro = {}, onEliminar, isSubmitting }) {
  // Determina tipo de registro
  const esDiesel = 'metodo_pago' in registro && 'litros' in registro
  const esGasto = 'tipo' in registro && !('litros' in registro)
  const tipo = esDiesel
    ? 'Diesel'
    : esGasto
    ? 'Gasto'
    : 'Abono'

  // Texto del detalle
  const detalle = esDiesel
    ? registro.metodo_pago
    : esGasto
    ? registro.tipo === 'Otro'
      ? `Otros: ${registro.descripcion}`
      : registro.tipo
    : registro.metodo

  // Color según tipo
  const textColor = esDiesel
    ? 'text-blue-700'
    : esGasto
    ? 'text-red-700'
    : 'text-green-700'

  // Monto
  const monto = registro.monto ?? registro.total ?? 0

  return (
    <div className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] items-center py-1 gap-x-2 border-b last:border-b-0 px-2">
      <div className={`${textColor} font-medium`}>{tipo}</div>
      <div className={`${textColor} truncate`}>{detalle}</div>
      <div className="flex items-center space-x-2">
        <span className={textColor}>${monto.toLocaleString('es-CL')}</span>
        <button
          onClick={onEliminar}
          disabled={isSubmitting}
          className={classNames(
            'ml-2',
            isSubmitting ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'
          )}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
