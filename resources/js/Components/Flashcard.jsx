import { useState, useEffect, useId, useMemo } from 'react'
import './Flashcard.css'

export default function Flashcard({ title, description, image, alt }) {
  const [flipped, setFlipped] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // IDs accesibles (SEO + a11y) sin afectar UI
  const uid = useId()
  const titleId = `flashcard-title-${uid}`
  const descId = `flashcard-desc-${uid}`

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Mantiene tu lógica, pero memo para rendimiento (marketing/app: LCP/UX)
  const descriptionList = useMemo(() => {
    return (description || '')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  }, [description])

  const handleToggle = () => {
    if (isTouchDevice) {
      setFlipped((v) => !v)
    }
  }

  const handleKeyDown = (e) => {
    // Accesibilidad: Enter/Espacio flip en desktop y móvil
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setFlipped((v) => !v)
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setFlipped(false)
    }
  }

  return (
    <div
      className="flashcard-container perspective cursor-pointer w-full min-h-[260px] sm:min-h-[280px] lg:min-h-[300px] hover:shadow-lg transition-shadow duration-300 px-1"
      onMouseEnter={() => !isTouchDevice && setFlipped(true)}
      onMouseLeave={() => !isTouchDevice && setFlipped(false)}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${title}. ${flipped ? 'Mostrando detalle.' : 'Mostrar detalle.'}`}
      aria-labelledby={titleId}
      aria-describedby={descId}
      itemScope
      itemType="https://schema.org/Organization"
    >
      {/* Microdata SEO (no visible, no rompe diseño) */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />

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
              alt={alt || title}
              className="max-h-[80px] sm:max-h-[100px] object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="bg-indigo-800 text-white text-center py-2 px-3">
            <h3 id={titleId} className="text-sm sm:text-base font-semibold leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Back (con scroll y contenido alineado al inicio) */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-xl bg-gradient-to-br from-[#0c1e3a] via-[#0c1e3aa0] to-[#102546] text-white h-full w-full flex flex-col px-4 py-6 text-center overflow-hidden">
          <div className="overflow-y-auto max-h-full w-full flex-1 flex flex-col items-center justify-start">
            <h3 className="text-base sm:text-lg font-bold mb-3">{title}</h3>

            <div id={descId} className="space-y-2 max-w-[90%]">
              {descriptionList.map((line, i) => (
                <p key={i} className="text-sm sm:text-base leading-relaxed break-words" itemProp="slogan">
                  {line}
                </p>
              ))}
            </div>

            {/* Microcopy (sr-only) para SEO/marketing sin tocar UI */}
            <span className="sr-only">
              Partner estratégico de Transportes SCAR. Cumplimiento, seguridad, trazabilidad y continuidad operacional.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
