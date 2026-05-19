import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import SectionBadge from './SectionBadge'

const statsData = [
  {
    label: 'Empresas que ya confiaron en SCAR',
    value: 127,
    suffix: '',
    decimals: false,
    sr: 'Empresas atendidas durante los últimos 12 meses',
  },
  {
    label: 'Cumplimiento operativo estimado',
    value: 98.7,
    suffix: '%',
    decimals: true,
    sr: 'Cumplimiento promedio de servicios gestionados',
  },
  {
    label: 'Cobertura nacional coordinada',
    value: 16,
    suffix: ' regiones',
    decimals: false,
    sr: 'Presencia operativa por regiones',
  },
  {
    label: 'Equipo operativo certificado',
    value: 100,
    suffix: '%',
    decimals: false,
    sr: 'Personal con certificación operacional',
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

  return (
    <section
      ref={ref}
      id="estadisticas"
      className="relative overflow-hidden bg-[#071121] py-16 sm:py-20"
      aria-labelledby="stats-title"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0094d9]/40 to-transparent" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,148,217,0.13) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <SectionBadge color="#38bdf8" className="mb-5">
            Prueba operativa · Cobertura · Cumplimiento
          </SectionBadge>

          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <h2 id="stats-title" className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                Confianza basada en operación real
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                La decisión logística mejora cuando hay evidencia. Estos indicadores resumen experiencia reciente,
                cobertura activa y estándares de equipo para cotizar con más contexto y menos incertidumbre.
              </p>
              <p className="mt-6 max-w-2xl text-sm leading-6 text-slate-500">
                Las cifras son referenciales y ayudan a dimensionar capacidad, respaldo y consistencia operacional. La
                disponibilidad final depende de ruta, ventana, volumen y tipo de carga.
              </p>
            </div>

            <dl
              className="grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-y-12"
              role="list"
              aria-label="Indicadores de desempeño"
              itemScope
              itemType="https://schema.org/ItemList"
            >
              {statsData.map((stat, index) => {
                const count = useCounter(stat.value, stat.decimals, inView)

                return (
                  <div key={stat.label} className="border-l border-[#0094d9]/30 pl-5" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <meta itemProp="position" content={index + 1} />
                    <dt className="text-sm leading-6 text-slate-400">{stat.label}</dt>
                    <dd className="mt-3 text-4xl font-semibold tracking-tight text-white">
                      {Number(count).toLocaleString('es-CL')}
                      <span className="text-[#38bdf8]">{stat.suffix}</span>
                    </dd>
                    <p className="mt-2 text-xs text-slate-600">{stat.sr}</p>
                  </div>
                )
              })}
            </dl>
          </div>
        </div>

        <div className="sr-only" itemScope itemType="https://schema.org/LocalBusiness">
          <span itemProp="name">Transportes SCAR</span>
          <span itemProp="areaServed">Chile</span>
          <span itemProp="serviceType">Carga consolidada, fletes dedicados y logística B2B</span>
        </div>
      </div>
    </section>
  )
}
