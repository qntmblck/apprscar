export default function CallToAction() {
    return (
      <section
        id="cta"
        className="relative isolate overflow-hidden bg-[#0c1e3a] py-16 sm:py-20 text-white"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative isolate overflow-hidden px-6 py-14 text-center sm:px-16">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              ¿Listo para confiar tu carga a verdaderos profesionales?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-gray-300">
              En Transportes SCAR, aseguramos puntualidad, eficiencia y seguimiento en cada uno de tus envíos.
              Escríbenos hoy mismo y cotiza sin compromiso.
            </p>
            <div className="mt-8 flex justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Alianza Transportista
              </a>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-white hover:text-indigo-300"
              >
                Quiero Conducir <span aria-hidden="true">→</span>
              </a>
            </div>

            {/* Fondo decorativo SVG suave */}
            <svg
              viewBox="0 0 1024 1024"
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -z-10 h-[48rem] w-[48rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
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
    );
  }
