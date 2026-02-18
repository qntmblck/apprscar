// Statistics.jsx
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

const statsData = [
  {
    label: 'Empresas atendidas en los últimos 12 meses',
    value: 127,
    suffix: '',
    decimals: false,
    sr: 'Empresas atendidas recientemente',
  },
  {
    label: 'Índice de cumplimiento operativo',
    value: 98.7,
    suffix: '%',
    decimals: true,
    sr: 'Cumplimiento promedio',
  },
  {
    label: 'Cobertura activa',
    value: 16,
    suffix: ' regiones',
    decimals: false,
    sr: 'Presencia operativa por región',
  },
  {
    label: 'Personal operativo certificado',
    value: 100,
    suffix: '%',
    decimals: false,
    sr: 'Equipo certificado',
  },
]

function useCounter(target, decimals = false, trigger) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger) return

    let raf
    const duration = 1100
    const start = performance.now()
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = easeOutCubic(progress)
      const value = target * eased

      setCount(value)

      if (progress < 1) raf = requestAnimationFrame(animate)
      else setCount(target)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [target, trigger])

  return decimals ? Number(count).toFixed(1) : Math.round(count)
}

export default function Statistics() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (inView) setAnimate(true)
  }, [inView])

  return (
    <section
      ref={ref}
      id="estadisticas"
      className="bg-gradient-to-r from-[#f6f9ff] to-[#eceaff] py-20 px-6"
      aria-labelledby="stats-title"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div
        className={`max-w-7xl mx-auto text-center transform transition-all duration-700 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600">
          Métricas · Cumplimiento · Cobertura
        </p>

        <h2
          id="stats-title"
          className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
        >
          Indicadores operativos
        </h2>

        {/* ✅ Un solo párrafo: sin repetir "transporte/distribución" */}
        <p className="mt-6 text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Datos orientativos que reflejan nivel de cumplimiento, cobertura activa y certificación operacional.
          Transparencia y control para respaldar decisiones y planificación logística.
        </p>

        <dl
          className="mt-16 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Indicadores de desempeño"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          {statsData.map((stat, i) => {
            const count = useCounter(stat.value, stat.decimals, inView)

            return (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                role="listitem"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={i + 1} />

                <dt className="text-sm font-semibold text-gray-600 leading-snug">
                  {stat.label}
                </dt>

                <dd className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tabular-nums">
                  {Number(count).toLocaleString('es-CL')}
                  <span className="text-gray-700">{stat.suffix}</span>
                </dd>

                <p className="mt-2 text-xs text-gray-500">{stat.sr}</p>
              </div>
            )
          })}
        </dl>

        <p className="mt-12 text-sm text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Métricas orientativas que reflejan capacidad operativa y estándares de servicio.
          Para disponibilidad por ruta y cotizaciones específicas, contáctanos desde el portal.
        </p>

        <div className="sr-only" itemScope itemType="https://schema.org/LocalBusiness">
          <span itemProp="name">Transportes SCAR</span>
          <span itemProp="areaServed">Chile</span>
          <span itemProp="serviceType">Logística B2B</span>
        </div>
      </div>
    </section>
  )
}
