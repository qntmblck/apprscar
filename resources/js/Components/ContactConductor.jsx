// resources/js/Components/ContactConductor.jsx
import { Link, usePage } from '@inertiajs/react'

export default function ContactConductor() {
  const { props } = usePage()
  const user = props.auth?.user || null

  const ctaHref = user ? '/dashboard#postulacion-conductor' : '/register'

  return (
    <section
      className="bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a]"
      aria-labelledby="conductores-title"
    >
      {/* Alineado al ancho de ContactColaborador (max-w-6xl + px-6 sm:px-8) */}
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-16 sm:py-20 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="rounded-xl bg-white/5 ring-1 ring-white/15 p-6 sm:p-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-indigo-200">
              Conductores · Portal de postulación
            </p>

            <h2 id="conductores-title" className="mt-2 text-3xl sm:text-4xl font-semibold">
              Conductor: postular con CV
            </h2>

            <p className="mt-4 text-white/80">
              La postulación se realiza desde el portal SCAR. Ahí podrás adjuntar tu CV y completar datos básicos para
              acelerar la evaluación y el contacto.
            </p>

            <h3 className="mt-6 text-lg font-semibold">Recomendado</h3>
            <ul className="mt-2 space-y-2 text-white/80 list-disc list-inside">
              <li>CV (PDF/DOC/DOCX)</li>
              <li>Ciudad base y disponibilidad</li>
              <li>Tipo de licencia A5</li>
              <li>5 Años de experiencia</li>
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href={ctaHref}
                className="rounded-md bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow transition"
              >
                {user ? 'Ir al portal y postular' : 'Crear cuenta para postular'}
              </Link>
              {!user && (
                <Link
                  href="/login"
                  className="rounded-md bg-white/10 hover:bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>

            {/* SEO copy (marketing) */}
            <p className="mt-6 text-xs text-white/70">
              Transportes SCAR busca conductores para servicios de transporte y distribución. Postula con tu CV desde el
              portal para acelerar la evaluación.
            </p>
          </div>

          <div className="hidden lg:block">
            <img
              src="/img/dashboard/transportista.jpg"
              alt="Conductor de camión de carga para postulación en Transportes SCAR"
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
