import { useState } from 'react'

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

    const payload = {
      flete_id: fleteId,
      rendicion_id: rendicionId,
      monto: form.monto,
      litros: form.litros,
      metodo_pago: form.metodo_pago,
    }

    if (form.foto instanceof File) {
      payload.foto = form.foto
    }

    try {
      const res = await onSubmit(payload)
      if (res?.data?.flete) {
        onSuccess(res.data.flete)
        setForm({ monto: '', litros: '', metodo_pago: '', foto: null })
        setExito(true)
        setTimeout(() => setExito(false), 1800)
      } else {
        throw new Error('No se pudo registrar el diesel.')
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
    <div className="bg-gray-50 rounded-md p-3 space-y-3 border border-gray-200 shadow-sm text-sm w-full">
      {error && (
        <div className="text-red-600 text-xs bg-red-100 p-2 rounded flex items-center gap-1">
          ❌ {error}
        </div>
      )}

      <div className="space-y-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name="monto"
          placeholder="💰 Monto en pesos"
          value={form.monto}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm"
        />

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name="litros"
          placeholder="⛽ Litros enteros"
          value={form.litros}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm"
        />

        <select
          name="metodo_pago"
          value={form.metodo_pago}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm"
        >
          <option value="">Método de pago</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Crédito">Crédito</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor={`foto-${fleteId}`}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded text-xs text-center cursor-pointer w-full"
        >
          📷 Subir foto
        </label>
        <input
          id={`foto-${fleteId}`}
          type="file"
          accept="image/*"
          capture="environment"
          name="foto"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={handleSend}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-xs"
        >
          Enviar
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded text-xs"
        >
          Cancelar
        </button>
      </div>

      {exito && (
        <div className="text-green-600 text-xs text-right">✔️ Registrado correctamente</div>
      )}
    </div>
  )
}
