// resources/js/Components/FleteCard/Header.jsx
import React from 'react'
import classNames from 'classnames'
import { EyeIcon, CurrencyDollarIcon } from '@heroicons/react/20/solid'

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
              {/* icono de sin notificar */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 text-black"
              >
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
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
                'p-2 rounded-full',
                isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-50'
              )}
            >
              {/* icono de notificado */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 text-green-600"
              >
                <path d="M19.5 22.5a3 3 0 0 0 3-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 1 1-.712 1.321l-5.683-3.06a1.5 1.5 0 0 0-1.422 0l-5.683 3.06a.75.75 0 0 1-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 0 0 3 3h15Z" />
                <path d="M1.5 9.589v-.745a3 3 0 0 1 1.578-2.642l7.5-4.038a3 3 0 0 1 2.844 0l7.5 4.038A3 3 0 0 1 22.5 8.844v.745l-8.426 4.926-.652-.351a3 3 0 0 0-2.844 0l-.652.351L1.5 9.589Z" />
              </svg>
            </button>
          )}

          {/* Cerrar/Reabrir */}
          {flete.rendicion?.estado === 'Activo' ? (
            <button
              onClick={() => onCerrar(flete.id)}
              disabled={isSubmitting}
              className={classNames(
                'p-2 rounded-full',
                isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-black/10'
              )}
            >
              {/* icono cerrar */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 text-black"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => onCerrar(flete.id)}
              disabled={isSubmitting}
              className={classNames(
                'p-2 rounded-full',
                isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-50'
              )}
            >
              {/* icono reabrir */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 text-green-600"
              >
                <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 0 1-1.5 0V6.75a3.75 3.75 0 1 0-7.5 0v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1 3 3H3.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3h9v-3c0-2.9 2.35-5.25 5.25-5.25Z" />
              </svg>
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
