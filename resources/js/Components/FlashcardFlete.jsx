import { useState, useEffect } from 'react'
import './FlashcardFlete.css'

export default function FlashcardFlete({
  title,
  description,
  onDieselClick,
  onGastoClick,
  onFinalizarClick,
}) {
  const [flipped, setFlipped] = useState(false)
  const [activeForm, setActiveForm] = useState(null)
  const [formData, setFormData] = useState({})
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const descriptionList = description
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  const handleToggle = () => setFlipped(!flipped)

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [activeForm]: e.target.value }))
  }

  const handleSubmit = () => {
    if (activeForm === 'diesel') onDieselClick?.(formData.diesel)
    if (activeForm === 'gasto') onGastoClick?.(formData.gasto)
    if (activeForm === 'finalizar') onFinalizarClick?.(formData.finalizar)
    setActiveForm(null)
    setFormData({})
  }

  const handleCancel = () => {
    setActiveForm(null)
    setFormData({})
  }

  return (
    <div
      className="flete-perspective cursor-pointer w-full h-[240px] sm:h-[260px] lg:h-[280px] transition-shadow duration-300 px-1"
      onClick={handleToggle}
    >
      <div
        className={`flete-transform-style transition-transform duration-700 w-full h-full relative ${flipped ? 'flete-rotate-y-180' : ''}`}
      >
        {/* Front */}
        <div className="flete-card-face absolute inset-0 flete-backface-hidden rounded-xl shadow-md bg-white h-full w-full flex flex-col justify-center items-center px-4 py-3 text-center">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-indigo-800">{title}</h3>
            {descriptionList.map((line, i) => (
              <p key={i} className="text-xs sm:text-sm text-gray-700 leading-snug">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Back */}
        <div className="flete-card-face absolute inset-0 flete-rotate-y-180 flete-backface-hidden rounded-xl bg-gradient-to-br from-[#0c1e3a] via-[#0c1e3aa0] to-[#102546] text-white h-full w-full relative px-4 py-3 text-center">
          {/* Botones fijos arriba */}
          <div className="absolute top-2 left-0 right-0 flex justify-center gap-2 px-4">
            <button
              onClick={e => { e.stopPropagation(); setActiveForm('diesel') }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold py-1.5 px-3 rounded transition"
            >
              Registrar Diesel
            </button>
            <button
              onClick={e => { e.stopPropagation(); setActiveForm('gasto') }}
              className="bg-yellow-500 hover:bg-yellow-400 text-white text-xs sm:text-sm font-semibold py-1.5 px-3 rounded transition"
            >
              Agregar Gasto
            </button>
            <button
              onClick={e => { e.stopPropagation(); setActiveForm('finalizar') }}
              className="bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-semibold py-1.5 px-3 rounded transition"
            >
              Terminar Flete
            </button>
          </div>

          {/* Contenido debajo de los botones */}
          {activeForm && (
            <div className="mt-16 text-left">
              <label className="block text-xs sm:text-sm mb-1 capitalize">{activeForm}:</label>
              <input
                type="text"
                value={formData[activeForm] || ''}
                onChange={handleInputChange}
                className="w-full p-1 rounded text-black text-sm"
                placeholder={`Ingrese ${activeForm}`}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleSubmit() }}
                  className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs"
                >
                  Enviar
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleCancel() }}
                  className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded text-xs"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
