import { useEffect, useRef } from 'react'

const clients = [
  { name: 'Latam', logo: '/img/latam.webp?v=2', width: 140, height: 48, offsetX: 0, offsetY: 7 },
  { name: 'Essity', logo: '/img/dashboard/essity.webp?v=3', width: 145, height: 38, offsetX: 0, offsetY: 4 },
  { name: 'Ripley', logo: '/img/ripley.webp?v=2', width: 150, height: 60, offsetX: -4, offsetY: -2 },
  { name: 'Walmart', logo: '/img/walmart.webp?v=2', width: 140, height: 64, offsetX: 8, offsetY: 0 },
  { name: 'Deco Muebles', logo: '/img/dashboard/deco.webp?v=2', width: 165, height: 60, offsetX: 22, offsetY: 2 },
  { name: 'Fruna', logo: '/img/dashboard/fruna.webp?v=2', width: 160, height: 66, offsetX: 2, offsetY: 2 },
  { name: 'Fibox', logo: '/img/dashboard/fibox.webp?v=2', width: 130, height: 60, offsetX: -15, offsetY: -2 },
  { name: 'Tottus', logo: '/img/tottus.webp?v=2', width: 150, height: 60, offsetX: 4, offsetY: -1 },
  { name: 'Falabella', logo: '/img/dashboard/falabella.webp?v=2', width: 140, height: 60, offsetX: 27, offsetY: -1 },
  { name: 'Prisa', logo: '/img/dashboard/prisa.webp?v=2', width: 185, height: 75, offsetX: 2, offsetY: -2 },
  { name: 'Canontex', logo: '/img/dashboard/canontex.webp?v=2', width: 160, height: 70, offsetX: -3, offsetY: 0 },
  { name: 'Paris', logo: '/img/paris.webp?v=2', width: 95, height: 40, offsetX: 15, offsetY: 10 },
  { name: 'Geoprospec', logo: '/img/dashboard/geo.webp?v=2', width: 190, height: 70, offsetX: 35, offsetY: -4 },
  { name: 'Construmart', logo: '/img/contrumart.webp?v=2', width: 240, height: 83, offsetX: -15, offsetY: -14 },
  { name: 'Tecnopapel', logo: '/img/tecnopapel.webp?v=2', width: 180, height: 76, offsetX: -43, offsetY: 4 },
  { name: 'Rosen', logo: '/img/Rosen-logo.webp?v=1', width: 170, height: 42, offsetX: -18, offsetY: 4 },
]

export default function Clients() {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const segmentRef = useRef(null)
  const segmentWidthRef = useRef(0)
  const offsetRef = useRef(0)
  const frameRef = useRef(null)
  const lastTimeRef = useRef(0)
  const dragRef = useRef({ active: false, startX: 0, startOffset: 0 })

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const segment = segmentRef.current
    if (!viewport || !track || !segment) return

    const normalizeOffset = () => {
      const width = segmentWidthRef.current
      if (!width) return

      offsetRef.current = ((offsetRef.current % width) + width) % width
    }

    const applyTransform = () => {
      normalizeOffset()
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
    }

    const measure = () => {
      const width = segment.scrollWidth || segment.offsetWidth
      if (!width) return

      segmentWidthRef.current = width
      applyTransform()
    }

    const animate = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time

      const elapsed = time - lastTimeRef.current
      lastTimeRef.current = time

      if (!dragRef.current.active && segmentWidthRef.current) {
        offsetRef.current += (38 * elapsed) / 1000
        applyTransform()
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    const handleWheel = (event) => {
      const horizontalDelta = Math.abs(event.deltaX) >= Math.abs(event.deltaY)
        ? event.deltaX
        : event.shiftKey
          ? event.deltaY
          : 0

      if (!horizontalDelta || !segmentWidthRef.current) return

      event.preventDefault()
      offsetRef.current += horizontalDelta
      applyTransform()
    }

    const handlePointerDown = (event) => {
      if (event.button !== undefined && event.button !== 0) return

      dragRef.current = {
        active: true,
        startX: event.clientX,
        startOffset: offsetRef.current,
      }

      viewport.setPointerCapture?.(event.pointerId)
    }

    const handlePointerMove = (event) => {
      if (!dragRef.current.active || !segmentWidthRef.current) return

      offsetRef.current = dragRef.current.startOffset - (event.clientX - dragRef.current.startX)
      applyTransform()
    }

    const handlePointerEnd = (event) => {
      dragRef.current.active = false

      if (viewport.hasPointerCapture?.(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId)
      }
    }

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(segment)

    const images = Array.from(segment.querySelectorAll('img'))
    images.forEach((image) => {
      if (!image.complete) {
        image.addEventListener('load', measure, { once: true })
        image.addEventListener('error', measure, { once: true })
      }
    })

    measure()
    frameRef.current = requestAnimationFrame(animate)

    viewport.addEventListener('wheel', handleWheel, { passive: false })
    viewport.addEventListener('pointerdown', handlePointerDown)
    viewport.addEventListener('pointermove', handlePointerMove)
    viewport.addEventListener('pointerup', handlePointerEnd)
    viewport.addEventListener('pointercancel', handlePointerEnd)
    viewport.addEventListener('pointerleave', handlePointerEnd)
    window.addEventListener('resize', measure)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      resizeObserver.disconnect()
      images.forEach((image) => {
        image.removeEventListener('load', measure)
        image.removeEventListener('error', measure)
      })
      viewport.removeEventListener('wheel', handleWheel)
      viewport.removeEventListener('pointerdown', handlePointerDown)
      viewport.removeEventListener('pointermove', handlePointerMove)
      viewport.removeEventListener('pointerup', handlePointerEnd)
      viewport.removeEventListener('pointercancel', handlePointerEnd)
      viewport.removeEventListener('pointerleave', handlePointerEnd)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const renderLogo = (client, index, duplicate = false) => (
    <div
      key={`${duplicate ? 'duplicate' : 'main'}-${client.name}-${index}`}
      className="flex shrink-0 items-center justify-center grayscale-[60%] opacity-90 transition duration-300 select-none"
      style={{
        width: `${client.width + 28}px`,
        height: `${client.height + 10}px`,
      }}
    >
      <img
        src={client.logo}
        alt={duplicate ? '' : `Logo ${client.name}`}
        aria-hidden={duplicate ? 'true' : undefined}
        loading="eager"
        decoding="async"
        width={client.width}
        height={client.height}
        className="pointer-events-none object-contain mx-auto"
        style={{
          width: `${client.width}px`,
          height: `${client.height}px`,
          transform: `translate(${client.offsetX}px, ${client.offsetY}px)`,
        }}
      />
    </div>
  )

  return (
    <section id="clientes" className="bg-white pt-10 pb-2 px-6 sm:px-8 -mt-[1px] overflow-hidden">
      <style>
        {`
          .clients-marquee-viewport {
            cursor: grab;
            touch-action: pan-y;
          }

          .clients-marquee-viewport:active {
            cursor: grabbing;
          }

          .clients-marquee-track {
            will-change: transform;
          }
        `}
      </style>

      <div ref={viewportRef} className="clients-marquee-viewport relative w-full overflow-hidden select-none">
        <div ref={trackRef} className="clients-marquee-track flex w-max items-center select-none">
          <div ref={segmentRef} className="flex shrink-0 items-center gap-16 pr-16">
            {clients.map((client, index) => renderLogo(client, index))}
          </div>

          <div className="flex shrink-0 items-center gap-16 pr-16" aria-hidden="true">
            {clients.map((client, index) => renderLogo(client, index, true))}
          </div>

          <div className="flex shrink-0 items-center gap-16 pr-16" aria-hidden="true">
            {clients.map((client, index) => renderLogo(client, index, true))}
          </div>
        </div>
      </div>
    </section>
  )
}
