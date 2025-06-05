import { useState } from 'react'
import { CameraIcon } from '@heroicons/react/20/solid'

export default function DieselForm({ fleteId, rendicionId, onSubmit, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    monto: '',
    litros: '',
    metodo_pago: '',
    foto: null,
  })

  const [exito, setExito] = useState(false)
  const [error, setError] = useState(null)

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
    if (form.foto instanceof File) {
      payload.append('foto', form.foto)
    }

    try {
      const res = await onSubmit(payload)
      if (res?.data?.flete) {
        onSuccess(res.data.flete)
        setForm({ monto: '', litros: '', metodo_pago: '', foto: null })
        setExito(true)
        setTimeout(() => setExito(false), 1800)
      } else {
        throw new Error('No se devolvió el flete actualizado.')
      }
    } catch (e) {
      const message =
        e.response?.data?.message ||
        e.response?.data?.error ||
        (e.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join(' ')
          : 'Error inesperado al registrar el diesel.')
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

        <select
          name="metodo_pago"
          value={form.metodo_pago}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300 bg-white w-full text-[11px]"
        >
          <option value="">Método de pago</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Crédito">Crédito</option>
        </select>

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

        <button
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded text-[11px] w-full transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSend}
          className="bg-[#149e60] hover:bg-green-700 text-white px-3 py-2 rounded text-[11px] w-full transition-colors"
        >
          Enviar
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
