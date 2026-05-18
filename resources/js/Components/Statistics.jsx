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
      className="relative py-20 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #080f1e 0%, #0c1e3a 42%, #102a62 76%, #1e3a8a 100%)' }}
      aria-labelledby="stats-title"
      itemScope
      itemType="https://schema.org/Organization"
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,148,217,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#0094d9]/8 blur-[140px] pointer-events-none" />

      <div
        className={`relative z-10 max-w-7xl mx-auto text-center transform transition-all duration-700 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-[#0094d9]">
          Métricas · Cumplimiento · Cobertura
        </p>

        <h2
          id="stats-title"
          className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
        >
          Indicadores operativos
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Datos orientativos que reflejan nivel de cumplimiento, cobertura activa y certificación operacional.
          Transparencia y control para respaldar decisiones y planificación logística.
        </p>

        <dl
          className="mt-14 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5"
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
                className="bg-white/[0.03] border border-[#0094d9]/20 rounded-2xl p-6 hover:border-[#0094d9]/40 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1"
                role="listitem"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={i + 1} />

                <dt className="text-sm font-semibold text-slate-400 leading-snug">
                  {stat.label}
                </dt>

                <dd className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                  {Number(count).toLocaleString('es-CL')}
                  <span className="text-[#0094d9]">{stat.suffix}</span>
                </dd>

                <p className="mt-2 text-xs text-slate-500">{stat.sr}</p>
              </div>
            )
          })}
        </dl>

        <p className="mt-10 text-sm text-slate-500 max-w-4xl mx-auto leading-relaxed">
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
