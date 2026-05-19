// resources/js/Components/ContactConductor.jsx
import { Link, usePage } from '@inertiajs/react'
import SectionBadge from './SectionBadge'

export default function ContactConductor() {
  const { props } = usePage()
  const user = props.auth?.user || null

  const ctaHref = user ? '/dashboard#postulacion-conductor' : '/register'

  return (
    <section
      className="bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a]"
      aria-labelledby="conductores-title"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-16 sm:py-20 text-white">
        <div className="w-full rounded-xl bg-white/5 ring-1 ring-white/15 p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
            <div>
              <SectionBadge>
                Conductores · Ruta profesional
              </SectionBadge>

              <h2 id="conductores-title" className="mt-2 text-3xl sm:text-4xl font-semibold">
                Postula con antecedentes claros
              </h2>

              <p className="mt-4 text-white/80">
                Buscamos conductores que entiendan seguridad, puntualidad y documentación como parte del servicio. En el
                portal podrás adjuntar tu CV y dejar datos clave para evaluar compatibilidad operativa.
              </p>

              {/* SEO copy (marketing) */}
              <p className="mt-6 text-xs text-white/70">
                Transportes SCAR evalúa conductores para transporte de carga, distribución y rutas coordinadas. Postula
                desde el portal para acelerar revisión y contacto.
              </p>
            </div>

            <div className="rounded-xl bg-white/5 ring-1 ring-white/15 p-5 sm:p-6">
              <h3 className="text-lg font-semibold">Antecedentes recomendados</h3>
              <ul className="mt-2 space-y-2 text-white/80 list-disc list-inside">
                <li>CV (PDF/DOC/DOCX)</li>
                <li>Ciudad base y disponibilidad</li>
                <li>Tipo de licencia vigente</li>
                <li>Experiencia en rutas o distribución</li>
              </ul>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Link
                  href={ctaHref}
                  className="rounded-xl bg-[#0094d9] hover:bg-[#00a0f0] px-4 py-2 text-center text-sm font-semibold text-white shadow transition"
                >
                  {user ? 'Ir al portal y postular' : 'Crear cuenta para postular'}
                </Link>
                {!user && (
                  <Link
                    href="/login"
                    className="rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 px-4 py-2 text-center text-sm font-semibold text-white ring-1 ring-white/20 transition"
                  >
                    Iniciar sesión
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
