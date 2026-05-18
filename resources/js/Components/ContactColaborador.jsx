// resources/js/Components/ContactColaborador.jsx
import { Link, usePage } from '@inertiajs/react'
import SectionBadge from './SectionBadge'

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
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-16 sm:py-20 text-white">
        <div className="w-full rounded-xl bg-white/5 ring-1 ring-white/15 p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
            <div>
              <SectionBadge>
                Colaboradores · Integración
              </SectionBadge>

              <h2 id="colaboradores-title" className="mt-2 text-3xl sm:text-4xl font-semibold">
                Describe tu Flota
              </h2>

              <p className="mt-4 text-white/80">
                Si operas camiones, ramplas o furgones y buscas continuidad operacional, completa la solicitud desde el
                portal SCAR. Así podemos evaluar cobertura, capacidad y estándares de cumplimiento.
              </p>

              <p className="mt-6 text-xs text-white/70">
                Canal orientado a alianzas B2B. Si prefieres, escribe a{' '}
                <a className="text-[#0094d9] hover:underline" href="mailto:contacto@scartransportes.cl">
                  contacto@scartransportes.cl
                </a>
                .
              </p>
            </div>

            <div className="rounded-xl bg-white/5 ring-1 ring-white/15 p-5 sm:p-6">
              <h3 className="text-lg font-semibold">Qué se evalúa</h3>
              <ul className="mt-2 space-y-2 text-white/80 list-disc list-inside">
                <li>Tamaño y tipo de flota</li>
                <li>Cobertura (rutas/regiones)</li>
                <li>Disponibilidad y tiempos de respuesta</li>
                <li>Documentación y seguridad operacional</li>
              </ul>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Link
                  href={primaryHref}
                  className="rounded-xl bg-[#0094d9] hover:bg-[#00a0f0] px-4 py-2 text-center text-sm font-semibold text-white shadow transition"
                >
                  {user ? 'Ir al portal y enviar solicitud' : 'Iniciar sesión para solicitar'}
                </Link>

                {!user && (
                  <Link
                    href={secondaryHref}
                    className="rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 px-4 py-2 text-center text-sm font-semibold text-white ring-1 ring-white/20 transition"
                  >
                    Crear cuenta
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
