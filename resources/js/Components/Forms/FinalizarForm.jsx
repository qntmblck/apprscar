import { useState, useEffect } from 'react'

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSend = () => {
    const payload = {
      flete_id: fleteId,
      rendicion_id: rendicionId,
      fecha_termino: form.fecha_termino,
      viatico_efectivo: form.viatico_efectivo,
      viatico_calculado: viaticoCalculado,
    }

    onSubmit(payload)                 // Enviar al backend
    onSuccess('Flete finalizado exitosamente.') // Mensaje + giro flashcard + cierre
    setForm({ fecha_termino: '', viatico_efectivo: '' }) // Reset form
  }

  return (
    <div className="space-y-2 text-left text-xs">
      <label className="block mb-1">Selecciona la fecha de término:</label>
      <input
        type="date"
        name="fecha_termino"
        value={form.fecha_termino}
        onChange={handleChange}
        className="w-full h-[42px] text-sm sm:text-base p-2 rounded bg-white text-black"
      />

      <label className="block mt-2">Viático calculado:</label>
      <input
        type="text"
        value={viaticoCalculado.toLocaleString('es-CL')}
        readOnly
        className="w-full p-1 rounded text-gray-500 text-sm bg-gray-100"
      />

      <label className="block">Viático efectivo recibido:</label>
      <input
        type="number"
        name="viatico_efectivo"
        value={form.viatico_efectivo}
        onChange={handleChange}
        className="w-full p-1 rounded text-black text-sm"
      />

      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={handleSend}
          className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs"
        >
          Enviar
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded text-xs"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
