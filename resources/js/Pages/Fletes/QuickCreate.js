// QuickCreate.js

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
  // 1) Obtener el cliente
  const clienteId = Array.isArray(data.cliente_ids)
    ? data.cliente_ids[0]
    : data.cliente_ids

  // 2) Buscar el destino
  const destinoObj = destinos.find(d => d.nombre === data.destino)
  if (!destinoObj) {
    setErrorMensaje('Destino no válido. Selecciona uno de la lista.')
    setSuccessMensaje(null)
    return
  }
  const destinoId = destinoObj.id

  // 3) Fecha de hoy
  const today = new Date().toISOString().split('T')[0]

  // 4) Seleccionar un tracto aleatorio
  const tractoObj = tractos[Math.floor(Math.random() * tractos.length)]
  const tractoId = tractoObj.id

  // 5) Seleccionar una rampla del tracto (si existe)
  const ramplaId = tractoObj.ramplas?.[0]?.id || null

  try {
    // 6) POST al backend con todos los campos necesarios
    const res = await axios.post(route('fletes.store'), {
      destino_id:           destinoId,
      tracto_id:            tractoId,
      rampla_id:            ramplaId,
      cliente_principal_id: clienteId,
      fecha_salida:         today,
      estado:               'Activo',
      notificar:            false,
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
