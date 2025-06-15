// resources/js/Components/Forms/FinalizarForm.jsx
import { useState, useEffect } from 'react'
import { CameraIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid'

export default function FinalizarForm({
  fleteId,
  rendicionId,
  fechaSalida,
  fechaLlegada,           // Asumimos que ahora llega la fecha de llegada
  fletePosteriorEnMismoDia = false,
  onSubmit,
  onCancel,
  onSuccess,
}) {
  const [viaticoEfec, setViaticoEfec] = useState('')
  const [dias, setDias] = useState(0)
  const [viaticoSuggest, setViaticoSuggest] = useState(0)
  const [foto, setFoto] = useState(null)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)

  // Calculamos días y viático sugerido cuando cambian fechas
  useEffect(() => {
    if (fechaSalida && fechaLlegada) {
      const start = new Date(fechaSalida)
      const end = new Date(fechaLlegada)
      if (!isNaN(start) && !isNaN(end)) {
        let days = Math.floor((end - start) / (1000*60*60*24)) + 1
        if (fletePosteriorEnMismoDia) days = Math.max(0, days - 1)
        setDias(days)
        setViaticoSuggest(days * 15000)
      }
    }
  }, [fechaSalida, fechaLlegada, fletePosteriorEnMismoDia])

  const handleFile = (e) => {
    setFoto(e.target.files[0] || null)
  }

  const handleSend = async () => {
    setError(null)
    if (viaticoEfec === '' && !foto) {
      setError('Debes ingresar viático efectivo o tomar foto.')
      return
    }
    const payload = new FormData()
    payload.append('flete_id', fleteId)
    payload.append('rendicion_id', rendicionId)
    if (viaticoEfec !== '') payload.append('viatico_efectivo', viaticoEfec)
    if (foto instanceof File) payload.append('foto', foto)

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
      {error && (
        <div className="text-red-600 text-[10px] bg-red-100 p-2 rounded mb-2">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {/* Columna 1: viático sugerido + días */}
        <div className="col-span-1 row-span-2 bg-white border border-gray-300 rounded-lg p-3 flex flex-col justify-center items-center">
          <span className="text-lg font-semibold text-gray-800">
            ${viaticoSuggest.toLocaleString('es-CL')}
          </span>
          <span className="text-[10px] text-gray-600 mt-1">
            {dias} día{dias !== 1 && 's'} de viaje
          </span>
        </div>

        {/* Columna 2, Fila 1: viático efectivo */}
        <input
          type="text"
          name="viatico_efectivo"
          placeholder="💵 Viático efectivo"
          value={viaticoEfec}
          onChange={e => setViaticoEfec(e.target.value)}
          className="p-2 rounded border border-gray-300 bg-white w-full text-[11px]"
        />

        {/* Columna 2, Fila 2: foto + enviar */}
        <div className="flex h-full overflow-hidden rounded-lg shadow-md">
          <label
            htmlFor={`foto-${fleteId}`}
            className="group relative flex-shrink-0 w-1/2 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 ease-out cursor-pointer"
          >
            <CameraIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
            <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 text-xs text-white bg-black bg-opacity-60 rounded px-2 py-1 pointer-events-none transition-opacity duration-200">
              Tomar foto
            </span>
            <input
              id={`foto-${fleteId}`}
              type="file"
              accept="image/*"
              capture="environment"
              name="foto"
              onChange={handleFile}
              className="hidden"
            />
          </label>
          <button
            onClick={handleSend}
            className="group relative flex-grow flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 ease-out"
          >
            <PaperAirplaneIcon className="h-6 w-6 text-white transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-200" />
            <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 text-xs text-white bg-black bg-opacity-60 rounded px-2 py-1 pointer-events-none transition-opacity duration-200">
              Enviar
            </span>
          </button>
        </div>
      </div>

      {exito && (
        <div className="text-green-600 text-[10px] bg-green-100 p-2 rounded mt-2">
          ✔️ Finalización registrada
        </div>
      )}
    </div>
  )
}
