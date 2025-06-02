import { useState } from 'react'

const tipos = ['Carga', 'Descarga', 'Camioneta', 'Estacionamiento', 'Peaje', 'Otros']

export default function GastoForm({ fleteId, rendicionId, onSubmit, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    tipo: '',
    monto: '',
    descripcion: '',
    foto: null,
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleTipoClick = (tipoSeleccionado) => {
    setForm(prev => ({ ...prev, tipo: tipoSeleccionado }))
  }

  const handleSend = () => {
    const payload = {
      ...form,
      flete_id: fleteId,
      rendicion_id: rendicionId,
    }

    onSubmit(payload, (updatedFlete) => {
      onSuccess(updatedFlete)
      setForm({ tipo: '', monto: '', descripcion: '', foto: null })
    })
  }

  return (
    <div className="space-y-2 text-left text-xs">
      <label>Tipo:</label>
      <div className="flex flex-wrap gap-1">
        {tipos.map((tipo) => (
          <button
            key={tipo}
            type="button"
            onClick={() => handleTipoClick(tipo)}
            className={`px-2 py-1 rounded text-xs font-semibold border transition
              ${form.tipo === tipo
                ? 'bg-white text-indigo-700 border-white'
                : 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-500'}
            `}
          >
            {tipo}
          </button>
        ))}
      </div>

      <label>Monto:</label>
      <input
        type="number"
        name="monto"
        value={form.monto}
        onChange={handleChange}
        className="w-full p-1 rounded text-black text-sm"
      />

      <label>Descripción:</label>
      <input
        type="text"
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        className="w-full p-1 rounded text-black text-sm"
      />

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
