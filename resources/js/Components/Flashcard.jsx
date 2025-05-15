import { useState, useEffect } from 'react'
import './Flashcard.css'

export default function Flashcard({ title, description, image }) {
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
        <div className="absolute inset-0 backface-hidden rounded-xl shadow-md overflow-hidden flex flex-col justify-between bg-white h-full">
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={image}
              alt={title}
              className="max-h-[80px] sm:max-h-[100px] object-contain"
            />
          </div>
          <div className="bg-indigo-800 text-white text-center py-2 px-3">
            <h3 className="text-sm sm:text-base font-semibold leading-tight">{title}</h3>
          </div>
        </div>

        {/* Back (ahora optimizada como FlashcardFlete) */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-xl bg-gradient-to-br from-[#0c1e3a] via-[#0c1e3aa0] to-[#102546] text-white h-full w-full flex flex-col justify-center items-center px-4 py-6 text-center">
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold">{title}</h3>
            {descriptionList.map((line, i) => (
              <p key={i} className="text-sm sm:text-base leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
