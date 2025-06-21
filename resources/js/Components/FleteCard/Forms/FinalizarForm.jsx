// resources/js/Components/Forms/FinalizarForm.jsx
import { useState, useEffect } from 'react'
import { CameraIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid'
import { parseISO, differenceInCalendarDays } from 'date-fns'

export default function FinalizarForm({
  fleteId,
  rendicionId,
  fechaSalida,            // ISO puro "YYYY-MM-DD"
  fechaLlegada,           // ISO puro ó undefined
  fletePosteriorEnMismoDia = false,
  onSubmit,
  onCancel,
  onSuccess,
}) {
  const [viaticoEfec, setViaticoEfec]       = useState('')
  const [dias, setDias]                     = useState(0)
  const [viaticoSuggest, setViaticoSuggest] = useState(0)
  const [foto, setFoto]                     = useState(null)
  const [error, setError]                   = useState(null)
  const [exito, setExito]                   = useState(false)

  useEffect(() => {
    if (!fechaSalida) return

    const start = parseISO(fechaSalida)
    const end   = fechaLlegada
      ? parseISO(fechaLlegada)
      : new Date()

    let rawDays = differenceInCalendarDays(end, start) + 1
    if (fletePosteriorEnMismoDia) {
      rawDays = Math.max(0, rawDays - 1)
    }

    setDias(rawDays)
    setViaticoSuggest(rawDays * 15000)
  }, [fechaSalida, fechaLlegada, fletePosteriorEnMismoDia])

  const handleFile = e => setFoto(e.target.files[0] || null)

  const handleSend = async () => {
    setError(null)
    if (viaticoEfec === '' && !foto) {
      setError('Debes ingresar viático efectivo o tomar foto.')
      return
    }
    const payload = new FormData()
    payload.append('flete_id', fleteId)
    payload.append('rendicion_id', rendicionId)
    if (viaticoEfec) payload.append('viatico_efectivo', viaticoEfec)
    if (foto) payload.append('foto', foto)

    try {
      const res = await onSubmit(payload)
      if (res?.data?.flete) {
        onSuccess(res.data.flete)
        setViaticoEfec('')
        setFoto(null)
        setExito(true)
        setTimeout(() => setExito(false), 2000)
      } else {
        throw new Error('No se devolvió el flete actualizado.')
      }
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        (e.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join(' ')
          : 'Error inesperado al finalizar.')
      setError(msg)
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-inner text-xs w-full">

      {/* 1) Error */}
      {error && (
        <div className="text-red-600 text-[10px] bg-red-100 p-2 rounded mb-2">
          ❌ {error}
        </div>
      )}

      {/* 2) Alerta si es flete posterior en mismo día */}
      {fletePosteriorEnMismoDia && (
        <div className="text-yellow-700 text-[10px] bg-yellow-100 p-2 rounded mb-2">
          ⚠️ Viático ya cubierto por flete anterior
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {/* Viático sugerido + días */}
        <div
          className={`col-span-1 row-span-2 bg-white border border-gray-300 rounded-lg p-3
            flex flex-col justify-center items-center
            ${fletePosteriorEnMismoDia ? 'opacity-50' : ''}`}
        >
          <span className="text-lg font-semibold text-gray-800">
            ${viaticoSuggest.toLocaleString('es-CL')}
          </span>
          <span className="text-[10px] text-gray-600 mt-1">
            {dias} día{dias !== 1 && 's'} de viaje
          </span>
        </div>

        {/* Viático efectivo */}
        <input
          type="text"
          name="viatico_efectivo"
          placeholder="💵 Viático efectivo"
          value={viaticoEfec}
          onChange={e => setViaticoEfec(e.target.value)}
          className="p-2 rounded border border-gray-300 bg-white w-full text-[11px]"
        />

        {/* Foto + enviar */}
        <div className="flex h-full overflow-hidden rounded-lg shadow-md">
          <label
            htmlFor={`foto-${fleteId}`}
            className="group relative flex-shrink-0 w-1/2 flex items-center justify-center
                       bg-gradient-to-br from-green-500 to-green-600
                       hover:from-green-600 hover:to-green-700
                       transition-all duration-200 ease-out cursor-pointer"
          >
            <CameraIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
            <input
              id={`foto-${fleteId}`}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              className="hidden"
            />
          </label>
          <button
            onClick={handleSend}
            className="group relative flex-grow flex items-center justify-center
                       bg-gradient-to-br from-yellow-400 to-yellow-500
                       hover:from-yellow-500 hover:to-yellow-600
                       transition-all duration-200 ease-out"
          >
            <PaperAirplaneIcon className="h-6 w-6 text-white
                      transform group-hover:rotate-12 group-hover:scale-110
                      transition-all duration-200" />
          </button>
        </div>
      </div>

      {/* 3) Éxito */}
      {exito && (
        <div className="text-green-600 text-[10px] bg-green-100 p-2 rounded mt-2">
          ✔️ Finalización registrada
        </div>
      )}
    </div>
  )
}
