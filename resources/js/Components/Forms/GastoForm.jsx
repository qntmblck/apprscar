import { useState } from 'react'
import { CameraIcon } from '@heroicons/react/20/solid'

const tipos = ['Carga', 'Descarga', 'Camioneta', 'Estacionamiento', 'Peaje', 'Otros']

export default function GastoForm({ fleteId, rendicionId, onSubmit, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    tipo: '',
    monto: '',
    descripcion: '',
    foto: null,
  })

  const [exito, setExito] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSend = async () => {
    setError(null)
    if (!form.tipo || !form.monto) {
      setError('Debes seleccionar tipo y monto.')
      return
    }

    const payload = {
      flete_id: fleteId,
      rendicion_id: rendicionId,
      tipo: form.tipo,
      monto: form.monto,
      descripcion: form.descripcion,
    }

    if (form.foto instanceof File) {
      payload.foto = form.foto
    }

    try {
      const res = await onSubmit(payload)
      if (res?.data?.flete) {
        onSuccess(res.data.flete)
        setForm({ tipo: '', monto: '', descripcion: '', foto: null })
        setExito(true)
        setTimeout(() => setExito(false), 1800)
      } else {
        throw new Error('No se pudo registrar el gasto.')
      }
    } catch (e) {
      const message =
        e.response?.data?.message ||
        e.response?.data?.error ||
        (e.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join(' ')
          : 'Error inesperado al registrar el gasto.')
      setError(message)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-xs shadow-md w-full overflow-visible">
  {error && (
    <div className="text-red-600 text-[10px] bg-red-100 p-2 rounded-md mb-2">
      ❌ {error}
    </div>
  )}

  <div className="grid grid-cols-2 gap-2">
    {/* Fila 1: Tipo / Monto */}
    <select
      name="tipo"
      value={form.tipo}
      onChange={handleChange}
      className="px-2 py-2 rounded-md border border-gray-300 bg-white w-full text-[11px]"
    >
      <option value="">📂 Tipo</option>
      {tipos.map((tipo) => (
        <option key={tipo} value={tipo}>{tipo}</option>
      ))}
    </select>

    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      name="monto"
      placeholder="💰 Monto"
      value={form.monto}
      onChange={handleChange}
      className="px-2 py-2 rounded-md border border-gray-300 bg-white w-full text-[11px]"
    />

    {/* Fila 2: Descripción / Subir Foto */}
    <input
  type="text"
  name="descripcion"
  placeholder="✏️ Descripción"
  value={form.descripcion}
  onChange={handleChange}
  className="px-2 py-2 rounded-md border border-gray-300 bg-white w-full text-[11px] col-span-1"
/>

<label
  htmlFor={`foto-${fleteId}`}
  className="flex items-center justify-center gap-1 bg-[#149e60] hover:bg-green-700 text-white px-3 py-2 rounded-md cursor-pointer w-full text-[11px] transition-colors"
>
  <CameraIcon className="w-4 h-4" />
  Foto
  <input
    id={`foto-${fleteId}`}
    type="file"
    accept="image/*"
    capture="environment"
    name="foto"
    onChange={handleChange}
    className="hidden"
  />
</label>

    {/* Fila 3: Enviar / Cancelar */}
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
      ✔️ Registrado correctamente
    </div>
  )}
</div>

  )
}
