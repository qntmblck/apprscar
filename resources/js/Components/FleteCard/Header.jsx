// resources/js/Components/FleteCard/Header.jsx
import React from 'react'
import classNames from 'classnames'
import { EyeIcon, CurrencyDollarIcon, LockClosedIcon, LockOpenIcon, EnvelopeIcon, EnvelopeOpenIcon } from '@heroicons/react/20/solid'

export default function Header({
  flete,
  flipped,
  isSubmitting,
  onFlip,
  submitForm,
  actualizarFleteEnLista,
  onCerrar,
}) {
  return (
    <div className="w-full overflow-hidden mb-4">
      <div className="w-full flex justify-between items-center">
        {/* Destino | Cliente | Comisión: no se desborda, scroll interno */}
        <div className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-thin flex-shrink">
          <div className="text-sm font-semibold text-gray-900 inline-block px-1">
            {flete.destino?.nombre || 'Sin destino'}
          </div>
          <span className="text-gray-400 select-none inline-block">|</span>
          <div className="text-sm font-semibold text-gray-900 inline-block px-1">
            {flete.cliente_principal?.razon_social || 'Sin cliente'}
          </div>
          <span className="text-gray-400 select-none inline-block">|</span>
          <div className="flex items-center gap-x-1 text-green-600 inline-block px-1">
            <CurrencyDollarIcon className="h-5 w-5 flex-shrink-0" />
            <span>
              {flete.rendicion?.comision != null
                ? `$${flete.rendicion.comision.toLocaleString('es-CL')}`
                : '—'}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex space-x-2 items-center flex-shrink-0">
          {/* Notificar */}
{flete.estado === 'Sin Notificar' ? (
  <span className="p-2 rounded-full">
    <EnvelopeIcon className="h-6 w-6 text-black" />
  </span>
) : (
  <button
    onClick={async () => {
      await submitForm(
        `/fletes/${flete.id}/notificar`,
        { flete_id: flete.id },
        actualizarFleteEnLista
      )
    }}
    disabled={isSubmitting}
    className={classNames(
      'p-2 rounded-full transition-colors',
      isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-50'
    )}
    aria-label="Notificado"
  >
    <EnvelopeOpenIcon className="h-6 w-6 text-green-600" />
  </button>
)}


          {/* Cerrar/Reabrir */}
{flete.rendicion?.estado === 'Activo' ? (
  <button
    onClick={() => onCerrar(flete.id)}
    disabled={isSubmitting}
    className={classNames(
      'p-2 rounded-full transition-colors',
      isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-black/10'
    )}
    aria-label="Cerrar rendición"
  >
    <LockClosedIcon className="h-6 w-6 text-black" />
  </button>
) : (
  <button
    onClick={() => onCerrar(flete.id)}
    disabled={isSubmitting}
    className={classNames(
      'p-2 rounded-full transition-colors',
      isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-50'
    )}
    aria-label="Reabrir rendición"
  >
    <LockOpenIcon className="h-6 w-6 text-green-600" />
  </button>
)}

          {/* Flip */}
          <button onClick={onFlip} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <EyeIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
