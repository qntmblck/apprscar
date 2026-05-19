import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import SectionBadge from './SectionBadge'

const actions = [
  { label: 'Cotizar transporte', href: '/contacto#clientes', primary: true },
  { label: 'Postular como conductor', href: '/contacto#conductores' },
  { label: 'Integrar mi flota', href: '/contacto#colaboradores' },
]

const checkpoints = [
  'Origen y destino',
  'Volumen y tipo de carga',
  'Ventana de retiro o entrega',
  'Restricciones operativas',
]

export default function CallToAction() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (inView) setAnimate(true)
  }, [inView])

  return (
    <section
      id="cta"
      ref={ref}
      className="bg-white pt-6 pb-14 sm:pt-8 sm:pb-16"
      aria-labelledby="cta-title"
      itemScope
      itemType="https://schema.org/Service"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={`relative isolate overflow-hidden rounded-3xl bg-[#071121] px-6 py-14 text-center shadow-2xl shadow-[#0c1e3a]/20 transition duration-700 sm:px-10 lg:px-16 ${
            animate ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 -z-10 opacity-25"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,148,217,0.25) 1px, transparent 0)',
              backgroundSize: '30px 30px',
            }}
          />
          <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent" />

          <SectionBadge color="#c7e9ff" backgroundOpacity={0.12} borderOpacity={0.28}>
            Cotiza con contexto · Ruta · Capacidad · Control
          </SectionBadge>

          <h2 id="cta-title" className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
            Dinos qué necesitas mover y te diremos el esquema más conveniente
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">
            No partimos por prometer un camión: partimos por entender la decisión logística. Con datos mínimos podemos
            orientar si conviene flete dedicado, carga consolidada o distribución programada.
          </p>

          <ul className="mx-auto mt-8 grid max-w-3xl gap-3 text-sm text-slate-300 sm:grid-cols-4">
            {checkpoints.map((item) => (
              <li key={item} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            {actions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                className={
                  action.primary
                    ? 'rounded-lg bg-[#0094d9] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0094d9]/20 transition hover:bg-[#00a0f0]'
                    : 'rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10'
                }
              >
                {action.label}
              </a>
            ))}
          </div>

          <meta itemProp="provider" content="Transportes SCAR" />
          <meta itemProp="areaServed" content="Chile" />
          <meta itemProp="serviceType" content="Cotización de transporte de carga, carga consolidada y distribución B2B" />
        </div>
      </div>
    </section>
  )
}
