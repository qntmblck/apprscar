import { useState, useEffect } from 'react'
import './Flashcard.css'

export default function FlashcardFlete({
  title,
  description,
  onDieselClick,
  onGastoClick,
  onFinalizarClick,
}) {
  const [flipped, setFlipped] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const descriptionList = description
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  const handleToggle = () => {
    if (isTouchDevice) {
      setFlipped(!flipped)
    }
  }

  return (
    <div
      className="flashcard-container perspective cursor-pointer w-full min-h-[260px] sm:min-h-[280px] lg:min-h-[300px] hover:shadow-lg transition-shadow duration-300 px-1"
      onMouseEnter={() => !isTouchDevice && setFlipped(true)}
      onMouseLeave={() => !isTouchDevice && setFlipped(false)}
      onClick={handleToggle}
    >
      <div
        className={`flashcard-inner transform-style preserve-3d transition-transform duration-700 w-full h-full relative ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-xl shadow-md bg-white h-full w-full flex flex-col justify-center items-center px-4 py-6 text-center">
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-indigo-800">{title}</h3>
            {descriptionList.map((line, i) => (
              <p key={i} className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-xl bg-gradient-to-br from-[#0c1e3a] via-[#0c1e3aa0] to-[#102546] text-white h-full w-full flex flex-col justify-center items-center px-4 py-6 text-center">
          <div className="space-y-2 mb-4">
            <h3 className="text-base sm:text-lg font-bold">{title}</h3>
            {descriptionList.map((line, i) => (
              <p key={i} className="text-sm sm:text-base leading-relaxed">
                {line}
              </p>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <button
              onClick={e => {
                e.stopPropagation()
                onDieselClick?.()
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded transition"
            >
              Registrar Diesel
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                onGastoClick?.()
              }}
              className="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-2 px-4 rounded transition"
            >
              Agregar Gasto
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                onFinalizarClick?.()
              }}
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded transition"
            >
              Terminar Flete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
