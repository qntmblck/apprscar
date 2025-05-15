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
      className="flashcard-container perspective cursor-pointer w-full h-auto min-h-[220px] sm:h-[250px] lg:h-[290px] hover:shadow-lg transition-shadow duration-300 px-4"
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

        {/* Back */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-xl bg-gradient-to-tr from-indigo-900 via-indigo-800 to-indigo-700 text-white h-full overflow-hidden">
          <div className="p-4 flex flex-col h-full">
            <h3 className="text-sm sm:text-base font-bold mb-2">{title}</h3>
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
              <ul className="text-sm leading-relaxed space-y-1 list-disc list-inside">
                {descriptionList.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
