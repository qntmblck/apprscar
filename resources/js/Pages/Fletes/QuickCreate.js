// resources/js/Pages/Fletes/QuickCreate.js

import axios from 'axios'
import { router } from '@inertiajs/react'

/**
 * Crea un flete “borrador” al vuelo y devuelve el objeto flete creado.
 * Lanza router.reload() si prefieres recargar Inertia, o retorna el flete
 * para insertarlo directamente en el estado de la lista.
 */
export async function quickCreateFlete(
  data,
  destinos,
  tractos,
  setSuccessMensaje,
  setErrorMensaje
) {
  // 1) Extraemos el cliente y el destino (exactamente uno de cada uno)
  const cliente_principal_id = Array.isArray(data.cliente_ids)
    ? data.cliente_ids[0]
    : data.cliente_ids

  const destino_id = Array.isArray(data.destino_ids)
    ? data.destino_ids[0]
    : data.destino_ids

  // 2) Validamos que ambos existan
  if (!destino_id) {
    setErrorMensaje('Destino no válido. Selecciona uno de la lista.')
    setSuccessMensaje(null)
    return
  }
  if (!cliente_principal_id) {
    setErrorMensaje('Cliente no válido. Selecciona uno de la lista.')
    setSuccessMensaje(null)
    return
  }

  // 3) Fecha de hoy
  const today = new Date().toISOString().split('T')[0]

  // 4) Seleccionar un tracto aleatorio
  const tractoObj = tractos[Math.floor(Math.random() * tractos.length)]
  const tracto_id = tractoObj.id

  // 5) Seleccionar una rampla del tracto (si existe)
  const rampla_id = tractoObj.ramplas?.[0]?.id || null

  try {
    // 6) POST al backend con todos los campos necesarios
    const res = await axios.post(route('fletes.store'), {
      destino_id,
      tracto_id,
      rampla_id,
      cliente_principal_id,
      fecha_salida: today,
      estado:       'Activo',
      notificar:    false,
    })

    setSuccessMensaje('Flete creado correctamente.')
    setErrorMensaje(null)

    // Si prefieres recargar Inertia (Opción A), descomenta:
    // router.reload({ only: ['fletes'] })

    // Opción B: devolver el flete para insertarlo en el estado
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
  }
}
