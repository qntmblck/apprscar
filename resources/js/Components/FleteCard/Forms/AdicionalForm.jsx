// resources/js/Components/Forms/AdicionalForm.jsx
import { useState } from 'react'
import { CameraIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid'

export default function AdicionalForm({
  fleteId,
  rendicionId,
  onSubmit,    // (FormData) => Promise
  onCancel,
  onSuccess,   // callback con flete actualizado
}) {
  const [form, setForm] = useState({ descripcion: '', monto: '', foto: null })
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSend = async () => {
    setError(null)
    if (!form.descripcion.trim() || !form.monto) {
      setError('Debes completar todos los campos.')
      return
    }
    const payload = new FormData()
    payload.append('flete_id', fleteId)
    payload.append('rendicion_id', rendicionId)
    payload.append('tipo', 'Adicional')
    payload.append('descripcion', form.descripcion.trim())
    payload.append('monto', form.monto)
    if (form.foto instanceof File) payload.append('foto', form.foto)

    try {
      const res = await onSubmit(payload)
      if (res?.data?.flete) {
        onSuccess(res.data.flete)
        setForm({ descripcion: '', monto: '', foto: null })
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
          : 'Error inesperado al registrar el adicional.')
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
        {/* Descripción ocupa ambas filas en columna 1 */}
        <textarea
          name="descripcion"
          placeholder="✏️ Descripción"
          value={form.descripcion}
          onChange={handleChange}
          rows={4}
          className="row-span-2 h-20 p-2 rounded border border-gray-300 bg-white w-full text-base text-gray-800 resize-none align-top"
        />

        {/* Fila 1, columna 2: Monto */}
        <input
          type="number"
          name="monto"
          placeholder="💰 Monto"
          value={form.monto}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300 bg-white w-full text-[11px]"
        />

        {/* Fila 2, columna 2: Foto + Enviar */}
        <div className="flex h-6 overflow-hidden rounded-lg shadow-md">
          <label
            htmlFor={`foto-${fleteId}`}
            className="group flex-shrink-0 w-1/2 h-6 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 cursor-pointer"
          >
            <CameraIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
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
  className="group flex-grow h-6 flex items-center justify-center bg-black hover:bg-gray-800 transition-all duration-200"
>
  <PaperAirplaneIcon
    className="h-6 w-6 text-white transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-200"
  />
</button>

        </div>
      </div>

      {exito && (
        <div className="text-green-600 text-[10px] bg-green-100 p-2 rounded mt-2">
          ✔️ Adicional registrado correctamente
        </div>
      )}
    </div>
  )
}
