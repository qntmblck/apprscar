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
    >
      <div
        className={`mx-auto max-w-7xl px-6 sm:px-8 lg:px-8 transform transition-all duration-1000 ${
          animate ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } hover:scale-[1.05]`}
      >
        <div className="relative isolate px-4 sm:px-8 text-center z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white transition-transform duration-300 hover:scale-115">
            ¿Listo para confiar tu carga a verdaderos profesionales?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/80 transition-transform duration-300 hover:scale-115">
            En Transportes SCAR, aseguramos puntualidad, eficiencia y seguimiento en cada uno de tus envíos.
            Escríbenos hoy mismo y cotiza sin compromiso.
          </p>

          <div className="mt-6 flex justify-center gap-x-6 flex-wrap">
            <a
              href="/contacto#colaboradores"
              className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-transform duration-300 hover:scale-115"
            >
              Alianza Transportista
            </a>

            <a
              href="/contacto#colaboradores"
              className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 transition-transform duration-300 hover:scale-115"
            >
              Quiero Conducir <span aria-hidden="true">→</span>
            </a>
          </div>

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
