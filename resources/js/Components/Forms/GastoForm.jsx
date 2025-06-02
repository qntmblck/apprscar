import { useState } from 'react'

const tipos = ['Carga', 'Descarga', 'Camioneta', 'Estacionamiento', 'Peaje', 'Otros']

export default function GastoForm({ fleteId, rendicionId, onSubmit, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    tipo: '',
    monto: '',
    descripcion: '',
    foto: null,
  })

  const [exito, setExito] = useState(false)
  const [error, setError] = useState(null)

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

  const handleSend = async () => {
    setError(null)

    if (!form.tipo || !form.monto) {
      setError('Debes seleccionar tipo y monto.')
      return
    }

    const payload = {
      flete_id: fleteId,
      rendicion_id: rendicionId,
      tipo: form.tipo,
      monto: form.monto,
      descripcion: form.descripcion,
    }

    if (form.foto instanceof File) {
      payload.foto = form.foto
    }

    try {
      const res = await onSubmit(payload)
      if (res?.data?.flete) {
        onSuccess(res.data.flete)
        setForm({ tipo: '', monto: '', descripcion: '', foto: null })
        setExito(true)
        setTimeout(() => setExito(false), 1800)
      } else {
        throw new Error('No se pudo registrar el gasto.')
      }
    } catch (e) {
      const message =
        e.response?.data?.message ||
        e.response?.data?.error ||
        (e.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join(' ')
          : 'Error inesperado al registrar el gasto.')
      setError(message)
    }
  }

  return (
    <div className="bg-gray-50 rounded-md p-3 space-y-3 border border-gray-200 shadow-sm text-sm w-full">
      {error && (
        <div className="text-red-600 text-xs bg-red-100 p-2 rounded">
          ❌ {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center">
        {tipos.map((tipo) => (
          <button
            key={tipo}
            type="button"
            onClick={() => handleTipoClick(tipo)}
            className={`px-2 py-1 rounded text-xs border font-semibold transition ${
              form.tipo === tipo
                ? 'bg-white text-indigo-700 border-indigo-700'
                : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        name="monto"
        placeholder="💰 Monto"
        value={form.monto}
        onChange={handleChange}
        className="w-full px-3 py-2 rounded border border-gray-300 bg-white"
      />

      <input
        type="text"
        name="descripcion"
        placeholder="✏️ Descripción (opcional)"
        value={form.descripcion}
        onChange={handleChange}
        className="w-full px-3 py-2 rounded border border-gray-300 bg-white"
      />

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

