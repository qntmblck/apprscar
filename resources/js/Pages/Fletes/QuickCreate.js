// resources/js/Pages/Fletes/QuickCreate.js

import axios from 'axios'
import { router } from '@inertiajs/react'

/**
 * Crea un flete “borrador” al vuelo y devuelve el objeto flete creado.
 * Recibe un payload con:
 *   destino_id,
 *   cliente_principal_id,
 *   conductor_id? (nullable),
 *   colaborador_id? (nullable),
 *   tracto_id? (nullable),
 *   rampla_id? (nullable),
 *   fecha_salida?,
 *   estado?,
 *   notificar?
 */
export async function quickCreateFlete(
  payload,
  setSuccessMensaje,
  setErrorMensaje
) {
  // 1) Validar destino y cliente
  if (!payload.destino_id || !payload.cliente_principal_id) {
    setErrorMensaje('Debes seleccionar cliente y destino.')
    setSuccessMensaje(null)
    return
  }

  // 2) Fecha por defecto si no viene
  if (!payload.fecha_salida) {
    payload.fecha_salida = new Date().toISOString().split('T')[0]
  }

  // 3) Estado y notificar por defecto
  payload.estado    = payload.estado    ?? 'Sin Notificar'
  payload.notificar = payload.notificar ?? false

  try {
    // 4) POST al backend con TODO el payload
    const res = await axios.post(route('fletes.store'), payload)

    setSuccessMensaje('Flete creado correctamente.')
    setErrorMensaje(null)

    // Opción A: recarga Inertia para mostrar la lista
    // router.reload({ only: ['fletes'] })

    // Opción B: devolver el flete nuevo para insertarlo manualmente
    return res.data.flete
  } catch (err) {
    const detalle =
      err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : err.response?.data?.message ||
          err.response?.data?.error ||
          'Error al crear el flete.'
    setErrorMensaje(detalle)
    setSuccessMensaje(null)
    throw err
  }
}
