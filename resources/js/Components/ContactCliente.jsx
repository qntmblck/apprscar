// resources/js/Components/ContactCliente.jsx
import { Link, usePage } from '@inertiajs/react'
import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function ContactCliente() {
  const { props } = usePage()
  const user = props.auth?.user || null

  const ctaHref = user ? '/dashboard#solicitud-transporte' : '/register'

  return (
    <section
      className="bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a]"
      aria-labelledby="clientes-title"
      itemScope
      itemType="https://schema.org/Service"
    >
      {/* Alineado EXACTO a ContactColaborador */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        {/* Card oscura (paleta del resto) con layout alineado */}
        <div className="rounded-xl bg-white/5 ring-1 ring-white/15 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-widest uppercase text-indigo-200">
                Clientes · Cotización
              </p>

              <h2 id="clientes-title" className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                Cliente: cotizar flete
              </h2>

              <p className="mt-6 text-lg text-white/80">
                Para cotizar un flete necesitamos origen, destino y descripción de la carga. La forma más rápida es
                usar el portal SCAR para registrar tu solicitud.
              </p>

              <div className="mt-8 rounded-xl bg-white/5 ring-1 ring-white/15 p-5">
                <h3 className="text-lg font-semibold text-white">Qué debes ingresar</h3>
                <ul className="mt-3 space-y-2 text-white/80 list-disc list-inside">
                  <li>Origen y destino.</li>
                  <li>Tipo de carga y observaciones.</li>
                  <li>Peso/volumen aproximado (si aplica).</li>
                  <li>Fecha de retiro (opcional).</li>
                </ul>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={ctaHref}
                    className="rounded-md bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow transition"
                  >
                    {user ? 'Ir al portal y solicitar' : 'Crear cuenta para solicitar'}
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
              </div>

              <dl className="mt-10 space-y-4 text-base text-white/80" aria-label="Datos de contacto">
                <div className="flex gap-x-4">
                  <dt className="flex-shrink-0" aria-hidden="true">
                    <BuildingOffice2Icon className="h-6 w-6 text-indigo-300" />
                  </dt>
                  <dd>Sta. Rosa de Santiago &amp; Cam. Uno, Lampa</dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-shrink-0" aria-hidden="true">
                    <PhoneIcon className="h-6 w-6 text-indigo-300" />
                  </dt>
                  <dd>
                    <a href="tel:+56944671205" className="hover:text-white">
                      +56 9 4467 1205
                    </a>
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-shrink-0" aria-hidden="true">
                    <EnvelopeIcon className="h-6 w-6 text-indigo-300" />
                  </dt>
                  <dd>
                    <a href="mailto:contacto@scartransportes.cl" className="hover:text-white">
                      contacto@scartransportes.cl
                    </a>
                  </dd>
                </div>
              </dl>

              {/* SEO / marketing */}
              <p className="mt-6 text-xs text-white/70">
                Servicio orientado a <span className="font-semibold text-white">transporte y distribución</span> con foco
                en cumplimiento, planificación y trazabilidad. Cotiza por portal para respuesta más rápida.
              </p>

              {/* Schema.org */}
              <meta itemProp="serviceType" content="Cotización de fletes y transporte" />
              <meta itemProp="provider" content="Transportes SCAR" />
              <meta itemProp="areaServed" content="Chile" />
            </div>


          </div>
        </div>
      </div>
    </section>
  )
}
