// resources/js/Components/FleteCard/RecordRow.jsx
import React, { useMemo } from 'react'
import classNames from 'classnames'
import { CalendarDaysIcon, BanknotesIcon } from '@heroicons/react/20/solid'

export default function RecordRow({
  registros = [],
  viatico = 0,
  saldo = 0,
  onEliminar,
  isSubmitting,
}) {
  const ultimos = useMemo(() => {
    return registros
      .filter(r => r.id)
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 2)
  }, [registros])

  // Nuevo: color dinámico para saldo
  const saldoColor = saldo > 0 ? 'text-red-600' : 'text-green-600'

  return (
    <div className="flex items-start">
      {/* Viático & Saldo */}
      <div className="flex-none bg-white border border-gray-200 rounded p-1 inline-flex flex-col items-center justify-center space-y-1 shadow-sm">
        <div className="flex items-center space-x-1 text-yellow-600">
          <CalendarDaysIcon className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium">
            ${viatico.toLocaleString('es-CL')}
          </span>
        </div>
        <div className={classNames('flex items-center space-x-1', saldoColor)}>
          <BanknotesIcon className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium">
            ${saldo.toLocaleString('es-CL')}
          </span>
        </div>
      </div>

      {/* Separador */}
      <div className="border-l border-gray-300 mx-2 self-stretch" />

      {/* Contenedor de registros */}
      <div className="flex-1 flex flex-col space-y-1 overflow-hidden">
        {ultimos.map(registro => {
          // ... lógica de tipo, detalle y color para cada registro (sin cambios)
          const esDiesel    = 'litros' in registro && 'metodo_pago' in registro
          const esAbono     = 'metodo' in registro && !esDiesel
          const esRetorno   = esAbono && registro.metodo === 'Retorno'
          const esAdicional = registro.tipo === 'Adicional'
          const esComision  = registro.tipo === 'Comisión'
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
            ? registro.metodo_pago
            : esAbono
            ? registro.metodo
            : esAdicional
            ? registro.descripcion
            : esComision
            ? ''
            : registro.tipo === 'Otro'
            ? `Otros: ${registro.descripcion}`
            : registro.tipo
          const textColor = esDiesel
            ? 'text-blue-700'
            : esRetorno
            ? 'text-yellow-700'
            : esAbono
            ? 'text-green-700'
            : esAdicional
            ? 'text-blue-700'
            : esComision
            ? 'text-purple-700'
            : 'text-red-700'
          const monto = registro.monto ?? registro.total ?? 0

          return (
            <div
              key={registro.id}
              className="flex items-center bg-white border border-gray-200 rounded px-2 py-1 shadow-sm max-w-full"
            >
              {/* 1) Zona colapsable (tipo + detalle) */}
              <div className="flex-1 min-w-0 overflow-x-auto">
                <div className="inline-flex items-center space-x-2">
                  <span className={classNames(textColor, 'text-sm font-medium whitespace-nowrap')}>
                    {tipo}
                  </span>
                  <span className={classNames(textColor, 'text-sm truncate')}>
                    {detalle}
                  </span>
                </div>
              </div>
              {/* 2) Zona fija (monto + botón) */}
              <div className="flex-none ml-4 inline-flex items-center space-x-1">
                <span className={classNames(textColor, 'text-sm')}>
                  ${monto.toLocaleString('es-CL')}
                </span>
                <button
                  onClick={() => onEliminar(registro)}
                  disabled={isSubmitting}
                  className={classNames(
                    'text-sm',
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
