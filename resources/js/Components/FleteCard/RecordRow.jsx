// resources/js/Components/FleteCard/RecordRow.jsx
import React from 'react'
import classNames from 'classnames'
import { CalendarDaysIcon, BanknotesIcon } from '@heroicons/react/20/solid'

export default function RecordRow({
  ultimosRegistros = [],   // Array con los dos últimos registros
  viatico = 0,             // viático efectivo
  saldo = 0,               // saldo temporal
  onEliminar,              // función eliminar registro (recibe el objeto registro)
  isSubmitting,            // estado de envío
}) {
  return (
    <div className="flex items-center">
      {/* ← Cuadro con Viático & Saldo (izquierda), más compacto */}
      <div className="flex-none bg-white border border-gray-200 rounded p-1 inline-flex flex-col items-center justify-center space-y-1 shadow-sm">
        <div className="flex items-center space-x-1 text-yellow-600">
          <CalendarDaysIcon className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium">${viatico.toLocaleString('es-CL')}</span>
        </div>
        <div className="flex items-center space-x-1 text-green-600">
          <BanknotesIcon className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium">${saldo.toLocaleString('es-CL')}</span>
        </div>
      </div>

      {/* Línea vertical separadora, se ajusta a la altura de los registros */}
      <div className="border-l border-gray-300 mx-2 self-stretch" />

      {/* → Dos filas de registro (derecha) */}
      <div className="flex-1 space-y-1">
        {ultimosRegistros.map(registro => {
          const esDiesel = 'metodo_pago' in registro && 'litros' in registro
          const esGasto = 'tipo' in registro && !('litros' in registro)
          const tipo = esDiesel
            ? 'Diesel'
            : esGasto
            ? 'Gasto'
            : 'Abono'

          const detalle = esDiesel
            ? registro.metodo_pago
            : esGasto
            ? registro.tipo === 'Otro'
              ? `Otros: ${registro.descripcion}`
              : registro.tipo
            : registro.metodo

          const textColor = esDiesel
            ? 'text-blue-700'
            : esGasto
            ? 'text-red-700'
            : 'text-green-700'

          const monto = registro.monto ?? registro.total ?? 0

          return (
            <div
              key={registro.id}
              className="grid grid-cols-[minmax(40px,max-content)_1fr_minmax(60px,max-content)] items-center gap-x-2 px-2 py-1 border-b last:border-b-0"
            >
              <div className={`${textColor} text-sm font-medium`}>{tipo}</div>
              <div className={`${textColor} text-sm truncate`}>{detalle}</div>
              <div className="flex items-center space-x-1">
                <span className={`${textColor} text-sm`}>
                  ${monto.toLocaleString('es-CL')}
                </span>
                <button
                  onClick={() => onEliminar(registro)}
                  disabled={isSubmitting}
                  className={classNames(
                    'ml-1 text-sm',
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
        })}
      </div>
    </div>
  )
}
