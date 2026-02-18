

import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'

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
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a] py-16 sm:py-24 text-white"
      aria-labelledby="cta-title"
      itemScope
      itemType="https://schema.org/Service"
    >
      <div
        className={`mx-auto max-w-7xl px-6 sm:px-8 lg:px-8 transform transition-all duration-1000 ${
          animate ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="relative isolate px-4 sm:px-8 text-center z-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-200">
            Diagnóstico · Diseño · Puesta en marcha
          </p>

          <h2 id="cta-title" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Conversemos tu operación y definamos el mejor esquema
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base sm:text-lg leading-7 text-white/85">
            Cuéntanos tu flujo (rutas, ventanas, volúmenes y restricciones) y te respondemos con una propuesta clara:
            alcance, condiciones, plazos y puntos de control. Menos fricción operativa, más previsibilidad y respaldo.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/contacto#clientes"
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Cotizar Servicio
            </a>

            <a
              href="/contacto#conductores"
              className="rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
            >
              Postular como Conductor
            </a>

            <a
              href="/contacto#colaboradores"
              className="rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
            >
              Integrar mi Flota
            </a>
          </div>

          <meta itemProp="provider" content="Transportes SCAR" />
          <meta itemProp="areaServed" content="Chile" />
          <meta itemProp="serviceType" content="Servicios logísticos B2B con control operativo" />

          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          >
            <circle r={512} cx={512} cy={512} fill="url(#scar-gradient)" fillOpacity="0.6" />
            <defs>
              <radialGradient id="scar-gradient">
                <stop stopColor="#4f46e5" />
                <stop offset={1} stopColor="#312e81" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  )
}
