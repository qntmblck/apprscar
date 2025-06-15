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
  // Ordenar registros por fecha de creación descendente
  const lista = [...registros].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Detalle completo</h3>
      <div className="space-y-1 text-xs">
        {lista.map((r, i) => {
          const esDiesel    = 'metodo_pago' in r && 'litros' in r
          const esAbono     = 'metodo' in r && !esDiesel
          const esAdicional = r.tipo === 'Adicional'
          const esComision  = r.tipo === 'Comisión'
          // Ahora excluimos explícitamente Adicional y Comisión de Gasto
          const esGasto     = 'tipo' in r && !esAdicional && !esComision && !esDiesel

          const tipo = esDiesel
            ? 'Diésel'
            : esAbono
            ? (r.metodo === 'Retorno' ? 'Retorno' : 'Abono')
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
            : (r.tipo === 'Otro' ? `Otros: ${r.descripcion}` : r.tipo)

          const bgColor = esDiesel
            ? 'bg-blue-50 text-blue-700'
            : esAbono && r.metodo === 'Retorno'
            ? 'bg-yellow-50 text-yellow-700'
            : esAbono
            ? 'bg-green-50 text-green-700'
            : esAdicional
            ? 'bg-blue-50 text-blue-700'
            : esComision
            ? 'bg-purple-50 text-purple-700'
            : 'bg-red-50 text-red-700'

          return (
            <div
              key={i}
              className={classNames(
                'grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] items-start py-1 gap-x-2 border-b last:border-b-0 px-2 rounded-md',
                bgColor
              )}
            >
              <div className="font-medium">{tipo}</div>
              <div className="break-words">{detalle}</div>
              <div className="flex items-center justify-end space-x-2">
                <span>
                  ${(r.monto ?? r.total ?? 0).toLocaleString('es-CL')}
                </span>
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
        })}

        {/* Viático */}
        <div className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] items-center text-xs py-1 border-b gap-x-2 px-2">
          <div className="font-medium">Viático</div>
          <div />
          <div className="text-gray-700 font-medium text-right">
            ${viaticoEfec.toLocaleString('es-CL')}
          </div>
        </div>

        {/* Saldo final */}
        <div className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] text-sm font-semibold pt-1 border-t mt-2 px-2">
          <div className="col-span-2 text-green-700">Saldo final</div>
          <div className="text-right text-green-700">
            ${saldoTemporal.toLocaleString('es-CL')}
          </div>
        </div>
      </div>
    </div>
  )
}
