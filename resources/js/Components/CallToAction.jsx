export default function CallToAction() {
    return (
      <section
        id="cta"
        className="relative isolate overflow-hidden bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a] py-16 sm:py-24 text-white"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative isolate px-4 sm:px-8 text-center z-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              ¿Listo para confiar tu carga a verdaderos profesionales?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/80">
              En Transportes SCAR, aseguramos puntualidad, eficiencia y seguimiento en cada uno de tus envíos.
              Escríbenos hoy mismo y cotiza sin compromiso.
            </p>
            <div className="mt-6 flex justify-center gap-x-6 flex-wrap">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
              >
                Alianza Transportista
              </a>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 transition"
              >
                Quiero Conducir <span aria-hidden="true">→</span>
              </a>
            </div>

            {/* Fondo decorativo sutil */}
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
