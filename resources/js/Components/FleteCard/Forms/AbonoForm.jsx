// resources/js/Components/Forms/AbonoForm.jsx
import { useState } from 'react'

const METODOS = ['Efectivo', 'Transferencia']

export default function AbonoForm({
  fleteId,
  rendicionId,
  onSubmit,
  onCancel,
  onSuccess,
}) {
  const [form, setForm] = useState({ metodo: '', monto: '' })
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)

  const handleSend = async () => {
    setError(null)
    if (!form.metodo || !form.monto) {
      setError('Debes completar todos los campos.')
      return
    }
    const payload = {
      flete_id: fleteId,
      rendicion_id: rendicionId,
      tipo: form.metodo,
      monto: Number(form.monto),
    }
    try {
      const res = await onSubmit(payload)
      if (res?.data?.flete) {
        onSuccess(res.data.flete)
        setForm({ metodo: '', monto: '' })
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
          : 'Error inesperado al registrar el abono.')
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

      <div className="grid grid-cols-3 gap-2">
        {/* Columna 1: Monto */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name="monto"
          placeholder="💰 Monto"
          value={form.monto}
          onChange={e => setForm(p => ({ ...p, monto: e.target.value }))}
          className="h-10 px-4 py-2 rounded border border-gray-300 bg-white w-full text-base"
        />

        {/* Columna 2: Método */}
        <select
          name="metodo"
          value={form.metodo}
          onChange={e => setForm(p => ({ ...p, metodo: e.target.value }))}
          className="h-10 px-3 py-2 pr-8 rounded border border-gray-300 bg-white w-full text-base appearance-none"
        >
          <option value="">Método</option>
          {METODOS.map(m => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Columna 3: Enviar (verde) */}
        <button
          onClick={handleSend}
          className="bg-green-600 hover:bg-green-700 text-white px-4 h-10 rounded text-[11px] transition-colors w-full"
        >
          Enviar
        </button>
      </div>

      {exito && (
        <div className="text-green-600 text-[10px] bg-green-100 p-2 rounded mt-2">
          ✔️ Abono registrado
        </div>
      )}
    </div>
  )
}
