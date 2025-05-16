import { useState } from 'react'

export default function DieselForm({ fleteId, rendicionId, onSubmit, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    monto: '',
    litros: '',
    metodo_pago: '',
    foto: null,
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSend = () => {
    const payload = {
      ...form,
      flete_id: fleteId,
      rendicion_id: rendicionId,
    }

    onSubmit(payload)
    onSuccess('Diesel registrado correctamente.')
    setForm({ monto: '', litros: '', metodo_pago: '', foto: null })
  }

  return (
    <div className="space-y-2 text-left text-xs">
      <label>Monto:</label>
      <input
        type="number"
        name="monto"
        value={form.monto}
        onChange={handleChange}
        className="w-full p-1 rounded text-black text-sm"
      />

      <label>Litros (solo enteros):</label>
      <input
        type="number"
        name="litros"
        inputMode="numeric"
        value={form.litros}
        onChange={handleChange}
        className="w-full p-1 rounded text-black text-sm"
      />

      <label>Método de pago:</label>
      <select
        name="metodo_pago"
        value={form.metodo_pago}
        onChange={handleChange}
        className="w-full p-1 rounded text-black text-sm"
      >
        <option value="">Seleccionar</option>
        <option value="Efectivo">Efectivo</option>
        <option value="Transferencia">Transferencia</option>
        <option value="Crédito">Crédito</option>
      </select>

      <div className="flex items-center justify-between mt-2">
        <label
          htmlFor="foto"
          className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
        >
          📷 Foto
        </label>
        <input
          id="foto"
          type="file"
          accept="image/*"
          capture="environment"
          name="foto"
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex gap-2">
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
    </div>
  )
}
