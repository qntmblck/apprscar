// resources/js/Components/Forms/AdicionalForm.jsx
import { useState } from 'react'

export default function AdicionalForm({
  fleteId,
  rendicionId,
  onSubmit,    // (payload) => Promise
  onCancel,
  onSuccess,   // callback con flete actualizado
}) {
  const [form, setForm] = useState({ descripcion: '', monto: '' })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSend = async () => {
    setError(null)
    if (!form.descripcion.trim() || !form.monto) {
      setError('Debes completar todos los campos.')
      return
    }

    const payload = {
      flete_id: fleteId,
      rendicion_id: rendicionId,
      tipo: 'Adicional',
      descripcion: form.descripcion.trim(),
      monto: Number(form.monto),
    }

    try {
      const res = await onSubmit(payload)
      if (res?.data?.flete) {
        onSuccess(res.data.flete)
        setForm({ descripcion: '', monto: '' })
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
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
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-inner text-xs w-full">
      {error && (
        <div className="text-red-600 bg-red-100 p-2 rounded mb-2 text-[10px]">
          ❌ {error}
        </div>
      )}

      <label className="block text-[11px] font-medium text-gray-700">Detalle</label>
      <input
        type="text"
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        placeholder="Descripción adicional"
        className="mt-1 block w-full rounded border-gray-300 text-[11px] py-1 px-2"
      />

      <label className="block text-[11px] font-medium text-gray-700 mt-2">Monto</label>
      <input
        type="number"
        value={form.monto}
        onChange={(e) => setForm({ ...form, monto: e.target.value })}
        placeholder="0"
        className="mt-1 block w-full rounded border-gray-300 text-[11px] py-1 px-2"
      />

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleSend}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-[11px] w-full"
        >
          Enviar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded text-[11px] w-full"
        >
          Cancelar
        </button>
      </div>

      {success && (
        <div className="text-green-600 bg-green-100 p-2 rounded mt-2 text-[10px]">
          ✔️ Adicional registrado
        </div>
      )}
    </div>
  )
}
