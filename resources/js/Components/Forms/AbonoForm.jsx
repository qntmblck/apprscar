import { useState } from 'react'

const opciones = ['Efectivo', 'Transferencia']

export default function AbonoForm({ fleteId, rendicionId, onSubmit, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    tipo: '',
    monto: '',
  })

  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSend = async () => {
    setError(null)

    if (!form.tipo || !form.monto) {
      setError('Debes completar todos los campos.')
      return
    }

    const payload = {
      flete_id: fleteId,
      rendicion_id: rendicionId,
      tipo: form.tipo,
      monto: parseInt(form.monto),
    }

    try {
      const res = await onSubmit('/registro', payload)
      if (res?.data?.flete) {
        onSuccess(res.data.flete)
        setForm({ tipo: '', monto: '' })
        setExito(true)
        setTimeout(() => setExito(false), 1500)
      } else {
        throw new Error('❌ No se devolvió el flete actualizado.')
      }
    } catch (e) {
      const mensaje =
        e.response?.data?.message ||
        e.response?.data?.error ||
        (e.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join(' ')
          : `Error inesperado.`)

      setError('❌ ' + mensaje)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-xs shadow-md w-full overflow-visible">
      {error && (
        <div className="text-red-600 text-[10px] bg-red-100 p-2 rounded-md mb-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          className="px-2 py-2 rounded-md border border-gray-300 bg-white w-full text-[11px]"
        >
          <option value="">💳 Método</option>
          {opciones.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="monto"
          placeholder="💰 Monto"
          value={form.monto}
          onChange={handleChange}
          className="px-2 py-2 rounded-md border border-gray-300 bg-white w-full text-[11px]"
        />

        <button
          onClick={handleSend}
          className="bg-[#149e60] hover:bg-green-700 text-white px-3 py-2 rounded text-[11px] w-full"
        >
          Enviar
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded text-[11px] w-full"
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
