// resources/js/Components/FleteCard/BackDetails.jsx
import React, { useState, useRef } from 'react'
import classNames from 'classnames'
import { ClipboardDocumentListIcon, TruckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import PortalDropdown from './PortalDropdown'

export default function BackDetails({
  flete = {},
  registros = [],
  viaticoEfec = 0,
  saldo = 0,
  retornoValor = 0,
  comisionManual = 0,
  comisionTarifa = 0,
  viajeNumero = '',
  onEliminarRegistro = () => {},
  onUpdateKilometraje = () => {},
  isSubmitting = false,
}) {
  // estado para menú Kilometraje
  const [activeMenu, setActiveMenu] = useState(null)
  const [kmText, setKmText] = useState(flete.kilometraje?.toString() || '')
  const kmInputRef = useRef()

  const openKm = () => setActiveMenu('Km')
  const closeKm = () => setActiveMenu(null)

  // separar adicionales
  const adicionales = registros
    .filter(r => r.tipo === 'Adicional')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  // resto para detalle saldo
  const detallesSaldo = registros
    .filter(r => r.tipo !== 'Comisión' && r.metodo !== 'Retorno' && r.tipo !== 'Adicional')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  // pseudo-registros
  const comisionRegistro = comisionManual > 0
    ? { id: flete.id, tipo: 'Comisión', monto: comisionManual }
    : null
  const retornoRegistro = retornoValor > 0
    ? { id: flete.id, metodo: 'Retorno', monto: retornoValor }
    : null

  // clases para Valor Retorno
  const retornoClasses = classNames(
    'grid grid-cols-[1fr_minmax(70px,max-content)] items-center px-2 py-1 rounded-md',
    retornoValor > 0
      ? 'bg-yellow-50 text-yellow-700'
      : 'bg-gray-50 text-gray-700'
  )

  // render de filas
  const renderRow = (r, key) => {
    const esDiesel    = 'litros' in r && 'metodo_pago' in r
    const esAbono     = 'metodo' in r && !('litros' in r)
    const esRetorno   = r.metodo === 'Retorno'
    const esAdicional = r.tipo === 'Adicional'
    const esComision  = r.tipo === 'Comisión'

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
        <div className="font-medium text-xs">{tipo}</div>
        <div className="text-xs truncate">{detalle}</div>
        <div className="flex items-center justify-end space-x-1">
          <span className="text-xs">${monto}</span>
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

  const saldoFinalColor = saldo > 0
    ? 'text-red-700'
    : 'text-green-700'

  return (
    <div>
      {/* Título con Flete + Tracto + Kilometraje en una fila */}
      <div className="mb-4">
        <div className="flex items-center justify-between space-x-4 mt-2 overflow-hidden">
          {/* Izquierda: número y tracto */}
          <div className="flex-1 min-w-0 flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              Detalle Flete {viajeNumero || flete.id}
            </h2>
            <span className="text-sm text-gray-600 truncate">
              {flete.tracto?.patente || ''}
            </span>
          </div>
          {/* Derecha: Kilometraje fijo */}
          <div className="flex-shrink-0">
            <button
              onClick={openKm}
              className={classNames(
                'flex items-center gap-x-1 p-1 border-b-2 rounded',
                activeMenu === 'Km'
                  ? 'border-violet-600 text-violet-600'
                  : 'border-transparent text-gray-700 hover:border-gray-300'
              )}
            >
              <TruckIcon className="h-5 w-5 flex-shrink-0" />
              <span
                className={classNames(
                  'ml-1 truncate whitespace-nowrap',
                  !(parseInt(kmText, 10) > 0) && 'text-red-600'
                )}
              >
                {parseInt(kmText, 10) > 0 ? `${kmText} km` : 'Kilometraje'}
              </span>
              <ChevronDownIcon
                className={classNames(
                  'h-4 w-4 flex-shrink-0 ml-1',
                  activeMenu === 'Km' ? 'text-violet-600' : 'text-gray-500'
                )}
              />
            </button>
            <PortalDropdown isOpen={activeMenu === 'Km'} type="Km">
              <div className="w-48 bg-white rounded-lg shadow-md p-4 space-y-2">
                <div className="font-bold text-sm">Ingresar Kilometraje</div>
                <input
                  ref={kmInputRef}
                  type="text"
                  value={kmText}
                  onChange={e => setKmText(e.target.value)}
                  placeholder="Kilometraje"
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none"
                />
                <div className="mt-2 flex items-center justify-between">
                  <button
                    onClick={() => { onUpdateKilometraje(flete.id, kmText); closeKm() }}
                    className="px-3 py-1 bg-violet-600 text-white rounded hover:bg-violet-500"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={closeKm}
                    className="px-3 py-1 text-gray-500 hover:underline"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </PortalDropdown>
          </div>
        </div>
      </div>




      {/* Sección superior: comisiones y retorno */}
      <div className="mb-4 space-y-1 text-xs">
        {/* Comisión Tarifa */}
        <div className="grid grid-cols-[1fr_minmax(70px,max-content)] items-center px-2 py-1 rounded-md bg-green-50 text-green-700">
          <span className="font-medium">Comisión Tarifa</span>
          <span>${comisionTarifa.toLocaleString('es-CL')}</span>
        </div>

        {/* Comisión Manual */}
        {comisionRegistro && (
          <div className="grid grid-cols-[1fr_minmax(70px,max-content)] items-center px-2 py-1 rounded-md bg-purple-50 text-purple-700">
            <span className="font-medium">Comisión Retorno</span>
            <div className="flex items-center space-x-1 justify-end">
              <span>${comisionManual.toLocaleString('es-CL')}</span>
              <button
                onClick={() => onEliminarRegistro(comisionRegistro)}
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
        )}

        {/* Valor Retorno */}
        <div className={retornoClasses}>
          <span className="font-medium">Valor Retorno</span>
          <div className="flex items-center space-x-1 justify-end">
            <span>
              {retornoValor > 0
                ? `$${retornoValor.toLocaleString('es-CL')}`
                : 'Sin Retorno'}
            </span>
            {retornoRegistro && (
              <button
                onClick={() => onEliminarRegistro(retornoRegistro)}
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
            )}
          </div>
        </div>

        {/* Adicionales */}
        {adicionales.length > 0 && (
          <>
            <h3 className="text-sm font-semibold text-gray-800 mt-4 mb-2">
              Adicionales
            </h3>
            <div className="space-y-1 text-xs">
              {adicionales.map((r, i) => renderRow(r, `ad-${i}`))}
            </div>
          </>
        )}
      </div>

      {/* Detalle Saldo */}
      <h3 className="text-sm font-semibold text-gray-800 mb-2 mt-4">
        Detalle Saldo
      </h3>
      <div className="space-y-1 text-xs">
        {detallesSaldo.map((r, i) => renderRow(r, i))}
      </div>

      {/* Valores al pie */}
<div className="mt-4 pt-4 border-t space-y-2">
  <div className="flex justify-between text-xs">
    <span className="font-medium">Viático</span>
    <span>${viaticoEfec.toLocaleString('es-CL')}</span>
  </div>
  <div
    className={classNames(
      'flex justify-between text-sm font-semibold',
      saldoFinalColor
    )}
  >
    <span>Saldo final</span>
    <span>${saldo.toLocaleString('es-CL')}</span>
  </div>
</div>

    </div>
  )
}
