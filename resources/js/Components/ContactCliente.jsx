// resources/js/Components/ContactCliente.jsx
import { Link, usePage } from '@inertiajs/react'
import SectionBadge from './SectionBadge'

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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <div className="w-full rounded-xl bg-white/5 ring-1 ring-white/15 p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
            <div>
              <SectionBadge>
                Clientes · Cotización
              </SectionBadge>

              <h2 id="clientes-title" className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                Solicita tu Flete
              </h2>

              <p className="mt-6 text-lg text-white/80">
                Para cotizar un flete necesitamos origen, destino y descripción de la carga. La forma más rápida es
                usar el portal SCAR para registrar tu solicitud.
              </p>

              {/* SEO / marketing */}
              <p className="mt-8 text-xs text-white/70">
                Servicio orientado a <span className="font-semibold text-white">transporte y distribución</span> con foco
                en cumplimiento, planificación y trazabilidad. Cotiza por portal para respuesta más rápida.
              </p>

              {/* Schema.org */}
              <meta itemProp="serviceType" content="Cotización de fletes y transporte" />
              <meta itemProp="provider" content="Transportes SCAR" />
              <meta itemProp="areaServed" content="Chile" />
            </div>

            <div className="rounded-xl bg-white/5 ring-1 ring-white/15 p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-white">Qué debes ingresar</h3>
              <ul className="mt-3 space-y-2 text-white/80 list-disc list-inside">
                <li>Origen y destino.</li>
                <li>Tipo de carga y observaciones.</li>
                <li>Peso/volumen aproximado (si aplica).</li>
                <li>Fecha de retiro (opcional).</li>
              </ul>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Link
                  href={ctaHref}
                  className="rounded-xl bg-[#0094d9] hover:bg-[#00a0f0] px-4 py-2 text-center text-sm font-semibold text-white shadow transition"
                >
                  {user ? 'Ir al portal y solicitar' : 'Crear cuenta para solicitar'}
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
