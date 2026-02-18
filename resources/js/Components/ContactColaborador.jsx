// resources/js/Components/ContactColaborador.jsx
import { Link, usePage } from '@inertiajs/react'

export default function ContactColaborador() {
  const { props } = usePage()
  const user = props.auth?.user || null

  // Si está logueado -> lo llevamos directo al dashboard con ancla del form
  // Si NO está logueado -> lo invitamos a iniciar sesión para completar la solicitud
  const primaryHref = user ? '/dashboard#solicitud-colaborador' : '/login'
  const secondaryHref = '/register'

  return (
    <section
      className="bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a]"
      aria-labelledby="colaboradores-title"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-16 sm:py-20 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="rounded-xl bg-white/5 ring-1 ring-white/15 p-6 sm:p-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-indigo-200">
              Colaboradores · Integración
            </p>

            <h2 id="colaboradores-title" className="mt-2 text-3xl sm:text-4xl font-semibold">
              Describe tu Flota
            </h2>

            <p className="mt-4 text-white/80">
              Si operas camiones, ramplas o furgones y buscas continuidad operacional, completa la solicitud desde el
              portal SCAR. Así podemos evaluar cobertura, capacidad y estándares de cumplimiento.
            </p>

            <h3 className="mt-6 text-lg font-semibold">Qué se evalúa</h3>
            <ul className="mt-2 space-y-2 text-white/80 list-disc list-inside">
              <li>Tamaño y tipo de flota</li>
              <li>Cobertura (rutas/regiones)</li>
              <li>Disponibilidad y tiempos de respuesta</li>
              <li>Documentación y seguridad operacional</li>
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href={primaryHref}
                className="rounded-md bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow transition"
              >
                {user ? 'Ir al portal y enviar solicitud' : 'Iniciar sesión para solicitar'}
              </Link>

              {!user && (
                <Link
                  href={secondaryHref}
                  className="rounded-md bg-white/10 hover:bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition"
                >
                  Crear cuenta
                </Link>
              )}
            </div>

            <p className="mt-6 text-xs text-white/70">
              Canal orientado a alianzas B2B. Si prefieres, escribe a{' '}
              <a className="text-indigo-300 hover:underline" href="mailto:contacto@scartransportes.cl">
                contacto@scartransportes.cl
              </a>
              .
            </p>
          </div>

          <div className="hidden lg:block">
            <img
              src="/img/dashboard/flota-colaboradores.jpg"
              alt="Integración de flota para colaboración con Transportes SCAR"
              className="rounded-xl shadow-xl object-cover w-full min-h-[520px]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
