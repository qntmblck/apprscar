import { useState } from 'react'

export default function FlashcardFlete({
  fleteId,
  rendicionId,
  title,
  description,
}) {
  const [activeForm, setActiveForm] = useState(null)
  const [formData, setFormData] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const descriptionList = description
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/diesel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({
          flete_id: fleteId,
          rendicion_id: rendicionId,
          monto: formData.monto,
          litros: formData.litros,
          metodo_pago: formData.metodo_pago,
        }),
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.message || 'Error al registrar diesel.')

      setSuccessMessage(result.message)
      setFormData({})
      setActiveForm(null)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Diesel submit error:', error)
      setSuccessMessage('❌ Error al registrar diesel.')
    }
  }

  return (
    <div className="w-full h-[380px] bg-white rounded-xl shadow p-4 flex flex-col justify-between">
      <div className="text-center mb-2">
        <h3 className="text-base font-bold text-indigo-700 mb-1">{title}</h3>
        {descriptionList.map((line, i) => (
          <p key={i} className="text-sm text-gray-700">{line}</p>
        ))}
      </div>

      <div className="flex justify-center gap-2 flex-wrap mb-2">
        <button onClick={() => setActiveForm('diesel')} className="bg-indigo-600 text-white text-xs px-3 py-1 rounded">Diesel</button>
        <button disabled className="bg-yellow-400 text-white text-xs px-3 py-1 rounded opacity-50 cursor-not-allowed">Gasto</button>
        <button disabled className="bg-red-500 text-white text-xs px-3 py-1 rounded opacity-50 cursor-not-allowed">Finalizar</button>
      </div>

      {successMessage && (
        <div className="text-green-500 text-sm text-center font-semibold mb-1">{successMessage}</div>
      )}

      {activeForm === 'diesel' && (
        <div className="text-sm overflow-y-auto max-h-[200px]">
          <label>Monto:
            <input type="number" name="monto" onChange={handleInputChange} className="w-full p-1 rounded mt-1" />
          </label>
          <label>Litros:
            <input type="number" name="litros" onChange={handleInputChange} className="w-full p-1 rounded mt-1" />
          </label>
          <label>Método de pago:
            <select name="metodo_pago" onChange={handleInputChange} className="w-full p-1 rounded mt-1">
              <option value="">Seleccione</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Crédito">Crédito</option>
            </select>
          </label>

          <div className="flex justify-end gap-2 mt-3">
            <button onClick={handleSubmit} className="bg-green-600 text-white text-xs px-3 py-1 rounded">Enviar</button>
            <button onClick={() => setActiveForm(null)} className="bg-gray-500 text-white text-xs px-3 py-1 rounded">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
