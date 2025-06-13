// resources/js/Components/FleteCard/BackDetails.jsx
import React from 'react'

// Helper para concatenar clases
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function BackDetails({
  detallesBack,
  viaticoEfec,
  saldoTemporal,
  onDelete,
  isSubmitting,
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Detalle completo</h3>
      <div className="space-y-1 text-xs">
        {detallesBack.map((r, i) => {
          const esDiesel = 'metodo_pago' in r && 'litros' in r
          const esGasto  = 'tipo' in r && !('litros' in r)
          const esAbono  = !esDiesel && !esGasto && 'metodo' in r
          const tipo = esDiesel
            ? 'Diesel'
            : esGasto
            ? 'Gasto'
            : esAbono && r.metodo === 'Retorno'
            ? 'Retorno'
            : esAbono
            ? 'Abono'
            : 'Comisión'
          let detalle = esDiesel
            ? r.metodo_pago
            : esGasto
            ? r.tipo === 'Otro'
              ? `Otros: ${r.descripcion}`
              : r.tipo
            : esAbono
            ? r.metodo
            : r.tipo
          const bgColor =
            esDiesel
              ? 'bg-blue-50 text-blue-700'
              : esGasto
              ? 'bg-red-50 text-red-700'
              : tipo === 'Retorno'
              ? 'bg-yellow-50 text-yellow-700'
              : tipo === 'Abono'
              ? 'bg-green-50 text-green-700'
              : 'bg-purple-50 text-purple-700'

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
              <div className="flex items-center space-x-2">
                <span>${(r.monto ?? r.total).toLocaleString('es-CL')}</span>
                <button
                  onClick={() => onDelete(r)}
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
        <div className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] items-center text-xs py-1 border-b gap-x-2">
          <div className="font-medium">Viático</div>
          <div />
          <div className="text-gray-700 font-medium text-right">
            ${viaticoEfec.toLocaleString('es-CL')}
          </div>
        </div>

        {/* Saldo final */}
        <div className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] text-sm font-semibold pt-1 border-t mt-2">
          <div className="col-span-2 text-green-700">Saldo final</div>
          <div className="text-right text-green-700">
            ${saldoTemporal.toLocaleString('es-CL')}
          </div>
        </div>
      </div>
    </div>
  )
}
