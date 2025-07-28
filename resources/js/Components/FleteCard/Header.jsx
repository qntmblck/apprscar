// resources/js/Components/FleteCard/Header.jsx
import React, { useState, useCallback } from 'react'
import classNames from 'classnames'
import axios from 'axios'
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
  actualizarFleteEnLista,
}) {
  const [alert, setAlert] = useState({ type: '', message: '' })

  // Detectamos estado exacto
  const isSinNotificar = flete.estado?.trim() === 'Sin Notificar'

  // Calculamos aquí la comisión total
  const tarifa = flete.tarifa?.valor_comision ?? 0
  const manual = flete.rendicion?.comision ?? 0
  const total = tarifa + manual

  const toggleEstado = useCallback(async () => {
    try {
      setAlert({ type: '', message: '' })
      const payload = {
        flete_id: flete.id,
        rendicion_id: flete.rendicion.id,
        ...(flete.rendicion.estado === 'Activo' && {
          fecha_termino: new Date().toISOString().slice(0, 10),
        }),
      }
      await axios.post(`/fletes/${flete.id}/finalizar`, payload)
      actualizarFleteEnLista({
        ...flete,
        rendicion: {
          ...flete.rendicion,
          estado:
            flete.rendicion.estado === 'Activo' ? 'Cerrado' : 'Activo',
        },
      })
      setAlert({
        type: 'success',
        message: 'Estado actualizado correctamente.',
      })
    } catch (e) {
      console.error('toggleEstado error:', e)
      setAlert({ type: 'error', message: 'Error al actualizar el estado.' })
    }
  }, [flete, actualizarFleteEnLista])

  const handleNotify = useCallback(async () => {
    try {
      setAlert({ type: '', message: '' })
      await axios.post('/fletes/batch/notificar', {
        flete_ids: [flete.id],
      })
      actualizarFleteEnLista({
        ...flete,
        estado: 'Notificado',
      })
      setAlert({ type: 'success', message: 'Correo enviado correctamente.' })
    } catch (e) {
      console.error('handleNotify error:', e)
      const serverMsg =
        e.response?.data?.message ||
        (typeof e.response?.data === 'string' ? e.response.data : null)
      const clientMsg = serverMsg || e.message || 'Error al enviar el correo.'
      setAlert({ type: 'error', message: clientMsg })
    }
  }, [flete, actualizarFleteEnLista])

  return (
    <div className="w-full overflow-hidden mb-4">
      {/* Alert */}
      {alert.message && (
        <div
          className={classNames(
            'mb-2 px-3 py-2 rounded text-sm',
            alert.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          )}
        >
          {alert.message}
        </div>
      )}

      <div className="w-full flex justify-between items-center">
        {/* Destino | Cliente | Comisión */}
        <div className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-thin">
          <div className="text-sm font-semibold text-gray-900 px-1">
            {flete.destino?.nombre || 'Sin destino'}
          </div>
          <span className="text-gray-400 select-none">|</span>
          <div className="text-sm font-semibold text-gray-900 px-1">
            {flete.cliente_principal?.razon_social || 'Sin cliente'}
          </div>
          <span className="text-gray-400 select-none">|</span>
          <div className="flex items-center gap-x-1 text-green-600 px-1">
            <CurrencyDollarIcon className="h-4 w-4" />
            <span>{`$${total.toLocaleString('es-CL')}`}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center space-x-1">
          {/* Notificar */}
          {isSinNotificar ? (
            <button
              onClick={handleNotify}
              disabled={isSubmitting}
              className={classNames(
                'p-1 rounded-full transition-colors',
                isSubmitting
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-green-50'
              )}
              aria-label="Notificar"
            >
              <EnvelopeOpenIcon className="h-4 w-4 text-green-600" />
            </button>
          ) : (
            <span className="p-1 rounded-full">
              <EnvelopeIcon className="h-4 w-4 text-black" />
            </span>
          )}

          {/* Cerrar/Reabrir rendición */}
          {flete.rendicion?.estado === 'Activo' ? (
            <button
              onClick={toggleEstado}
              disabled={isSubmitting}
              className={classNames(
                'p-1 rounded-full transition-colors',
                isSubmitting
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-black/10'
              )}
              aria-label="Cerrar rendición"
            >
              <LockOpenIcon className="h-4 w-4 text-green-600" />
            </button>
          ) : (
            <button
              onClick={toggleEstado}
              disabled={isSubmitting}
              className={classNames(
                'p-1 rounded-full transition-colors font-bold',
                isSubmitting
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-green-50'
              )}
              aria-label="Reabrir rendición"
            >
              <LockClosedIcon className="h-4 w-4 text-black" />
            </button>
          )}

          {/* Ver detalle */}
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
