// resources/js/Components/FleteCard/Header.jsx
import React from 'react'
import classNames from 'classnames'
import {
  EyeIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  LockOpenIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
} from '@heroicons/react/20/solid'

export default function Header({
  flete,
  flipped,
  isSubmitting,
  onFlip,
  submitForm,
  actualizarFleteEnLista,
}) {
  // Construye y envía el payload para cerrar o reabrir la rendición
  const toggleEstado = async () => {
    const payload = {
      flete_id:     flete.id,
      rendicion_id: flete.rendicion.id,
      // Al cerrar (cuando está Activo) enviamos fecha_termino
      ...(flete.rendicion.estado === 'Activo' && {
        fecha_termino: new Date().toISOString().slice(0, 10),
      }),
    }
    await submitForm(
      `/fletes/${flete.id}/finalizar`,
      payload,
      actualizarFleteEnLista
    )
  }

  // Envía notificación vía FleteBatchController
  const handleNotify = async () => {
    await submitForm(
      route('fletes.batch.notificar'),
      { flete_ids: [flete.id] },
      () => actualizarFleteEnLista({ ...flete, estado_notificado: true })
    )
  }

  return (
    <div className="w-full overflow-hidden mb-4">
      <div className="w-full flex justify-between items-center">
        {/* Destino | Cliente | Comisión */}
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
            <CurrencyDollarIcon className="h-4 w-4 flex-shrink-0" />
            <span>
              {flete.rendicion?.comision != null
                ? `$${flete.rendicion.comision.toLocaleString('es-CL')}`
                : '—'}
            </span>
          </div>
        </div>

        {/* Acciones: íconos más juntos */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {/* Notificar */}
          {!flete.estado_notificado ? (
            <button
              onClick={handleNotify}
              disabled={isSubmitting}
              className={classNames(
                'p-1 rounded-full transition-colors',
                isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-50'
              )}
              aria-label="Notificar"
            >
              <EnvelopeIcon className="h-4 w-4 text-black" />
            </button>
          ) : (
            <span className="p-1 rounded-full">
              <EnvelopeOpenIcon className="h-4 w-4 text-green-600" />
            </span>
          )}

          {/* Cerrar/Reabrir (iconos e estilos actualizados) */}
          {flete.rendicion?.estado === 'Activo' ? (
            <button
              onClick={toggleEstado}
              disabled={isSubmitting}
              className={classNames(
                'p-1 rounded-full transition-colors',
                isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-black/10'
              )}
              aria-label="Cerrar rendición"
            >
              {/* Activo: candado abierto en verde */}
              <LockOpenIcon className="h-4 w-4 text-green-600" />
            </button>
          ) : (
            <button
              onClick={toggleEstado}
              disabled={isSubmitting}
              className={classNames(
                'p-1 rounded-full transition-colors font-bold',
                isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-50'
              )}
              aria-label="Reabrir rendición"
            >
              {/* Cerrado: candado cerrado en negro y negrita */}
              <LockClosedIcon className="h-4 w-4 text-black" />
            </button>
          )}

          {/* Flip */}
          <button
            onClick={onFlip}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Ver detalle"
          >
            <EyeIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
