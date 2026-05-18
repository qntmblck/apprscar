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

const loopCopies = 5
const centerCopyIndex = Math.floor(loopCopies / 2)
const autoScrollSpeed = 38

export default function Clients() {
  const scrollerRef = useRef(null)
  const segmentRef = useRef(null)
  const segmentWidthRef = useRef(0)
  const isRepositioningRef = useRef(false)
  const autoFrameRef = useRef(null)
  const lastAutoScrollTimeRef = useRef(0)
  const dragRef = useRef({ active: false, startX: 0, startScrollLeft: 0 })

  useEffect(() => {
    const scroller = scrollerRef.current
    const segment = segmentRef.current
    if (!scroller || !segment) return

    const measureSegmentWidth = () => {
      const width = segment.scrollWidth || segment.offsetWidth
      if (!width) return false

      segmentWidthRef.current = width
      return true
    }

    const setCenterPosition = () => {
      if (!measureSegmentWidth()) return
      scroller.scrollLeft = segmentWidthRef.current * centerCopyIndex
    }

    const updateMeasurements = () => {
      const previousWidth = segmentWidthRef.current
      if (!measureSegmentWidth()) return

      if (!previousWidth || scroller.scrollLeft < segmentWidthRef.current) {
        scroller.scrollLeft = segmentWidthRef.current * centerCopyIndex
      }
    }

    const animateScroll = (timestamp) => {
      if (!lastAutoScrollTimeRef.current) {
        lastAutoScrollTimeRef.current = timestamp
      }

      const elapsed = timestamp - lastAutoScrollTimeRef.current
      lastAutoScrollTimeRef.current = timestamp

      if (!dragRef.current.active && segmentWidthRef.current) {
        scroller.scrollLeft += (autoScrollSpeed * elapsed) / 1000
        keepScrollInfinite()
      }

      autoFrameRef.current = requestAnimationFrame(animateScroll)
    }

    const logoImages = Array.from(segment.querySelectorAll('img'))
    const handleAssetReady = () => requestAnimationFrame(updateMeasurements)

    logoImages.forEach((image) => {
      if (!image.complete) {
        image.addEventListener('load', handleAssetReady, { once: true })
        image.addEventListener('error', handleAssetReady, { once: true })
      }
    })

    const resizeObserver = new ResizeObserver(updateMeasurements)
    resizeObserver.observe(segment)

    const frame = requestAnimationFrame(() => {
      setCenterPosition()
      autoFrameRef.current = requestAnimationFrame(animateScroll)
    })

    const fontsReady = document.fonts?.ready
    fontsReady?.then(handleAssetReady).catch(() => {})

    window.addEventListener('resize', setCenterPosition)
    window.addEventListener('load', handleAssetReady, { once: true })

    return () => {
      cancelAnimationFrame(frame)
      if (autoFrameRef.current) {
        cancelAnimationFrame(autoFrameRef.current)
      }
      resizeObserver.disconnect()
      logoImages.forEach((image) => {
        image.removeEventListener('load', handleAssetReady)
        image.removeEventListener('error', handleAssetReady)
      })
      window.removeEventListener('resize', setCenterPosition)
      window.removeEventListener('load', handleAssetReady)
    }
  }, [])

  const keepScrollInfinite = () => {
    const scroller = scrollerRef.current
    const segment = segmentRef.current
    if (!scroller || !segment || isRepositioningRef.current) return

    const segmentWidth = segmentWidthRef.current || segment.scrollWidth || segment.offsetWidth
    if (!segmentWidth) return

    const leftBoundary = segmentWidth
    const rightBoundary = segmentWidth * (loopCopies - 2)

    if (scroller.scrollLeft < leftBoundary) {
      const shift = segmentWidth * centerCopyIndex

      isRepositioningRef.current = true
      scroller.scrollLeft += shift
      if (dragRef.current.active) {
        dragRef.current.startScrollLeft += shift
      }
      requestAnimationFrame(() => {
        isRepositioningRef.current = false
      })
    } else if (scroller.scrollLeft > rightBoundary) {
      const shift = segmentWidth * centerCopyIndex

      isRepositioningRef.current = true
      scroller.scrollLeft -= shift
      if (dragRef.current.active) {
        dragRef.current.startScrollLeft -= shift
      }
      requestAnimationFrame(() => {
        isRepositioningRef.current = false
      })
    }
  }

  const handlePointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return

    const scroller = scrollerRef.current
    if (!scroller) return

    dragRef.current = {
      active: true,
      startX: event.clientX,
      startScrollLeft: scroller.scrollLeft,
    }

    scroller.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const scroller = scrollerRef.current
    const drag = dragRef.current
    if (!scroller || !drag.active) return

    scroller.scrollLeft = drag.startScrollLeft - (event.clientX - drag.startX)
  }

  const endPointerDrag = (event) => {
    const scroller = scrollerRef.current
    dragRef.current.active = false

    if (scroller?.hasPointerCapture?.(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId)
    }
  }

  const renderLogo = (client, index, copyIndex) => {
    const isDuplicate = copyIndex !== centerCopyIndex

    return (
      <div
        key={`${client.name}-${copyIndex}-${index}`}
        className="flex items-center justify-center flex-shrink-0 grayscale-[60%] opacity-90 hover:grayscale-0 hover:opacity-100 transition duration-300"
        style={{
          width: `${client.width + 28}px`,
          height: `${client.height + 10}px`,
        }}
      >
        <img
          src={client.logo}
          alt={isDuplicate ? '' : `Logo ${client.name}`}
          aria-hidden={isDuplicate ? 'true' : undefined}
          loading={isDuplicate ? 'eager' : 'lazy'}
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
  }

  return (
    <section id="clientes" className="bg-white pt-10 pb-2 px-6 sm:px-8 -mt-[1px]">
      <div
        ref={scrollerRef}
        className="overflow-x-auto scrollbar-hide cursor-grab select-none touch-pan-y active:cursor-grabbing"
        onScroll={keepScrollInfinite}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
        onPointerLeave={endPointerDrag}
      >
        <div className="flex w-max items-center">
          {Array.from({ length: loopCopies }).map((_, copyIndex) => (
            <div
              key={copyIndex}
              ref={copyIndex === 0 ? segmentRef : undefined}
              className="flex flex-shrink-0 items-center gap-16 pr-16"
              aria-hidden={copyIndex === centerCopyIndex ? undefined : 'true'}
            >
              {clients.map((client, index) => renderLogo(client, index, copyIndex))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
