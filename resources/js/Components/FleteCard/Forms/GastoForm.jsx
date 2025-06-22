// resources/js/Components/Forms/GastoForm.jsx
import { useState } from 'react'
import { CameraIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid'

const tipos = ['Carga', 'Descarga', 'Camioneta', 'Estacionamiento', 'Peaje', 'Otros']

export default function GastoForm({ fleteId, rendicionId, submitForm, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    tipo: '',
    monto: '',
    descripcion: '',
    foto: null,
  })
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }))
  }

  const handleSend = async () => {
    setError(null)
    if (!form.tipo || !form.monto) {
      setError('Debes seleccionar tipo y monto.')
      return
    }
    const payload = new FormData()
    payload.append('flete_id', fleteId)
    payload.append('rendicion_id', rendicionId)
    payload.append('tipo', form.tipo)
    payload.append('monto', form.monto)
    payload.append('descripcion', form.descripcion)
    if (form.foto instanceof File) payload.append('foto', form.foto)

    try {
      const res = await submitForm('/gasto', payload)
      if (res?.data?.flete) {
        onSuccess?.(res.data.flete)
        setForm({ tipo: '', monto: '', descripcion: '', foto: null })
        setExito(true)
        setTimeout(() => setExito(false), 1800)
      } else {
        throw new Error('No se pudo registrar el gasto.')
      }
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        (e.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join(' ')
          : `Error: ${e.message}`)
      setError(msg)
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-inner text-xs w-full">
      {/* Error */}
      {error && (
        <div className="text-red-600 text-[10px] bg-red-100 p-2 rounded mb-2">
          ❌ {error}
        </div>
      )}

      {/* Formulario 2x2 */}
      <div className="grid grid-cols-2 gap-2">
        {/* Col 1, Fila 1: Monto */}
        <input
          type="text"
          name="monto"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="💰 Monto"
          value={form.monto}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300 bg-white w-full text-[11px]"
        />

        {/* Col 2, Fila 1: Descripción */}
        <input
          type="text"
          name="descripcion"
          placeholder="✏️ Descripción"
          value={form.descripcion}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300 bg-white w-full text-[11px]"
        />

        {/* Col 1, Fila 2: Tipo (igual a Método en Diesel) */}
<select
  name="tipo"
  value={form.tipo}
  onChange={handleChange}
  className="h-6 px-2 py-0.5 rounded border border-gray-300 bg-white w-full text-[11px]"
>
  <option value="">📂 Tipo</option>
  {tipos.map(t => (
    <option key={t} value={t}>
      {t}
    </option>
  ))}
</select>


        {/* Col 2, Fila 2: Foto + Enviar */}
        <div className="flex h-6 overflow-hidden rounded-lg shadow-md">
          <label
            htmlFor={`foto-${fleteId}`}
            className="group flex-shrink-0 w-1/2 h-6 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 cursor-pointer"
          >
            <CameraIcon className="h-6 w-6 text-white transition-transform group-hover:scale-110 duration-200" />
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
          <button
  onClick={handleSend}
  className="group flex-grow h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 transition-all duration-200"
>
  <PaperAirplaneIcon
    className="h-6 w-6 text-white transition-transform group-hover:rotate-12 group-hover:scale-110 duration-200"
  />
</button>

        </div>
      </div>

      {/* Éxito */}
      {exito && (
        <div className="text-green-600 text-[10px] bg-green-100 p-2 rounded mt-2">
          ✔️ Gasto registrado correctamente
        </div>
      )}
    </div>
  )
}
