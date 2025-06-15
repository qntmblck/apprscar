// resources/js/Components/FleteCard/RecordRow.jsx
import React, { useMemo } from 'react'
import classNames from 'classnames'
import { CalendarDaysIcon, BanknotesIcon } from '@heroicons/react/20/solid'

export default function RecordRow({
  registros = [],   // Array completo de registros (gastos, diesels, abonos, adicionales, comisiones, retornos…)
  viatico = 0,      // viático efectivo
  saldo = 0,        // saldo temporal
  onEliminar,       // función eliminar registro (recibe el objeto registro)
  isSubmitting,     // estado de envío
}) {
  // Ordenamos descendente y tomamos los dos primeros
  const ultimos = useMemo(() => {
    return registros
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 2)
  }, [registros])

  return (
    <div className="flex items-center">
      {/* Viático & Saldo */}
      <div className="flex-none bg-white border border-gray-200 rounded p-1 inline-flex flex-col items-center justify-center space-y-1 shadow-sm">
        <div className="flex items-center space-x-1 text-yellow-600">
          <CalendarDaysIcon className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium">
            ${viatico.toLocaleString('es-CL')}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-green-600">
          <BanknotesIcon className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium">
            ${saldo.toLocaleString('es-CL')}
          </span>
        </div>
      </div>

      {/* Separador */}
      <div className="border-l border-gray-300 mx-2 self-stretch" />

      {/* Últimos dos registros */}
      <div className="flex-1 space-y-1">
        {ultimos.map(registro => {
          const esDiesel    = 'litros' in registro && 'metodo_pago' in registro
          const esAbono     = 'metodo' in registro && !esDiesel
          const esRetorno   = esAbono && registro.metodo === 'Retorno'
          const esAdicional = registro.tipo === 'Adicional'
          const esComision  = registro.tipo === 'Comisión'
          const esGasto     = 'tipo' in registro && !esAdicional && !esComision && !esDiesel

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
              className="grid grid-cols-[minmax(40px,max-content)_1fr_minmax(60px,max-content)] items-center gap-x-2 px-2 py-1 border-b last:border-b-0"
            >
              <div className={classNames(textColor, 'text-sm font-medium')}>
                {tipo}
              </div>
              <div className={classNames(textColor, 'text-sm truncate')}>
                {detalle}
              </div>
              <div className="flex items-center space-x-1">
                <span className={classNames(textColor, 'text-sm')}>
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
