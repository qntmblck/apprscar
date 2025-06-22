// resources/js/Components/Forms/DieselForm.jsx
import { useState } from 'react'
import { CameraIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid'

export default function DieselForm({ fleteId, rendicionId, onSubmit, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    monto: '',
    litros: '',
    metodo_pago: '',
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
    if (!form.monto || !form.litros || !form.metodo_pago) {
      setError('Completa todos los campos obligatorios.')
      return
    }
    const payload = new FormData()
    payload.append('flete_id', fleteId)
    payload.append('rendicion_id', rendicionId)
    payload.append('monto', form.monto)
    payload.append('litros', form.litros)
    payload.append('metodo_pago', form.metodo_pago)
    if (form.foto instanceof File) payload.append('foto', form.foto)

    try {
      const res = await onSubmit(payload)
      if (res?.data?.flete) {
        onSuccess(res.data.flete)
        setForm({ monto: '', litros: '', metodo_pago: '', foto: null })
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
          : 'Error inesperado al registrar el diesel.')
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

      {/* Formulario */}
      <div className="grid grid-cols-2 gap-2">
        {/* Monto */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name="monto"
          placeholder="💰 Monto"
          value={form.monto}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300 bg-white w-full text-[11px]"
        />

        {/* Litros */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name="litros"
          placeholder="⛽ Litros"
          value={form.litros}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300 bg-white w-full text-[11px]"
        />

        {/* Método de pago */}
<select
  name="metodo_pago"
  value={form.metodo_pago}
  onChange={handleChange}
  className="h-6 px-2 py-0.5 rounded border border-gray-300 bg-white w-full text-[11px]"
>
  <option value="">Método</option>
  <option value="Efectivo">Efectivo</option>
  <option value="Transferencia">Transferencia</option>
  <option value="Crédito">Crédito</option>
</select>


        {/* Cámara + Enviar (iconos h-6) */}
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
  className="group flex-grow h-6 flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-all duration-200"
>
  <PaperAirplaneIcon
    className="h-6 w-6 text-white transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-200"
  />
</button>

        </div>
      </div>

      {/* Éxito */}
      {exito && (
        <div className="text-green-600 text-[10px] bg-green-100 p-2 rounded mt-2">
          ✔️ Registrado correctamente
        </div>
      )}
    </div>
  )
}
