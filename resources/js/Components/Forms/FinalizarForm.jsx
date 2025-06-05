import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './calendar-overrides.css'

export default function FinalizarForm({
  fleteId,
  rendicionId,
  fechaSalida,
  fletePosteriorEnMismoDia = false,
  onSubmit,
  onCancel,
  onSuccess,
}) {
  const [form, setForm] = useState({
    fecha_termino: '',
    viatico_efectivo: '',
  })

  const [viaticoCalculado, setViaticoCalculado] = useState(0)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (form.fecha_termino && fechaSalida) {
      const start = new Date(fechaSalida)
      const end = new Date(form.fecha_termino)

      if (!isNaN(start) && !isNaN(end)) {
        let dias = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
        if (fletePosteriorEnMismoDia) dias = Math.max(0, dias - 1)
        setViaticoCalculado(dias * 15000)
      }
    }
  }, [form.fecha_termino, fechaSalida, fletePosteriorEnMismoDia])

  const handleDateChange = (date) => {
    const corregida = new Date(date)
    corregida.setDate(corregida.getDate() + 1)
    const fechaISO = corregida.toISOString().split('T')[0]
    setForm(prev => ({ ...prev, fecha_termino: fechaISO }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const marcarFechaSalida = ({ date, view }) => {
    if (view === 'month' && fechaSalida) {
      const salida = new Date(fechaSalida)
      if (
        date.getFullYear() === salida.getFullYear() &&
        date.getMonth() === salida.getMonth() &&
        date.getDate() === salida.getDate()
      ) {
        return 'marcar-salida'
      }
    }
    return null
  }

  const handleSend = async () => {
    setError(null)

    if (!form.fecha_termino && !form.viatico_efectivo) {
      setError('Debes ingresar al menos la fecha o el viático efectivo.')
      return
    }

    const payload = {
      flete_id: fleteId,
      rendicion_id: rendicionId,
    }

    if (form.fecha_termino) {
      payload.fecha_termino = form.fecha_termino
    }

    if (form.viatico_efectivo !== '') {
      payload.viatico_efectivo = form.viatico_efectivo
    }

    try {
      const res = await onSubmit(payload)
      if (res?.data?.flete) {
        onSuccess(res.data.flete)
        setForm({ fecha_termino: '', viatico_efectivo: '' })
        setExito(true)
        setTimeout(() => setExito(false), 1800)
      } else {
        throw new Error('No se pudo finalizar el flete.')
      }
    } catch (e) {
      const message =
        e.response?.data?.message ||
        e.response?.data?.error ||
        (e.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join(' ')
          : 'Error inesperado al finalizar el flete.')
      setError(message)
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
        <div className="col-span-2 w-full">
          <Calendar
            onChange={handleDateChange}
            value={form.fecha_termino ? new Date(form.fecha_termino) : null}
            tileClassName={marcarFechaSalida}
            className="w-full rounded border border-gray-300 text-[11px]"
            locale="es-CL"
          />
        </div>

        <input
          type="text"
          value={viaticoCalculado.toLocaleString('es-CL')}
          readOnly
          placeholder="🌊 Calculado"
          className="p-2 rounded border border-gray-200 bg-gray-100 text-gray-500 w-full text-[11px]"
        />
        <input
          type="text"
          name="viatico_efectivo"
          placeholder="💵 Efectivo"
          value={form.viatico_efectivo}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300 bg-white w-full text-[11px]"
        />

        <button
  onClick={handleSend}
  className="bg-[#149e60] hover:bg-green-700 text-white px-3 py-2 rounded text-[11px] w-full transition-colors"
>
  Enviar
</button>
<button
  onClick={onCancel}
  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded text-[11px] w-full transition-colors"
>
  Cancelar
</button>

      </div>

      {exito && (
        <div className="text-green-600 text-[10px] text-right mt-2">
          ✔️ Viático registrado
        </div>
      )}
    </div>
  )
}
