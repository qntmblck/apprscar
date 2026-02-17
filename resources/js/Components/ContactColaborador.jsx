// resources/js/Components/ContactColaborador.jsx
import { useForm } from '@inertiajs/react'

export default function ContactColaborador() {
  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    fleet_size: '',
    fleet_types: '',
    coverage: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post(route('contacto.colaborador'), {
      onSuccess: () => reset(),
    })
  }

  return (
    <section
      className="bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a]"
      aria-labelledby="colaboradores-title"
      itemScope
      itemType="https://schema.org/Service"
    >
      {/* Alineado a los otros: max-w-6xl / px / py */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        {/* Paleta IGUAL al resto (card oscura/translúcida) */}
        <div className="rounded-xl bg-white/5 ring-1 ring-white/15 p-6 sm:p-8 text-white">
          {/* Header */}
          <div className="border-b border-white/10 pb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-indigo-200">
              Colaboradores · Integración de flota
            </p>

            <h2 id="colaboradores-title" className="mt-2 text-3xl sm:text-4xl font-semibold text-white">
              Integra tu flota a Transportes SCAR
            </h2>

            <p className="mt-3 text-white/80 max-w-3xl">
              Si operas camiones, ramplas o furgones y buscas colaborar con una operación organizada, completa este
              formulario. Evaluamos alianzas de mediano y largo plazo para servicios de transporte y distribución,
              considerando cobertura, capacidad y cumplimiento.
            </p>

            {/* SEO / marketing microcopy (misma paleta) */}
            <p className="mt-3 text-xs text-white/70 max-w-3xl">
              <span className="font-semibold text-white">Transportes SCAR</span> trabaja con flotas que buscan
              continuidad operacional, trazabilidad, estándares de seguridad y planificación. Este canal está orientado
              a alianzas B2B.
            </p>

            {/* Schema meta */}
            <meta itemProp="serviceType" content="Integración de flota y colaboración B2B" />
            <meta itemProp="provider" content="Transportes SCAR" />
            <meta itemProp="areaServed" content="Chile" />
          </div>

          {/* Body */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Form */}
            <div>
              {recentlySuccessful && (
                <div
                  className="mb-5 rounded-lg border border-emerald-300/30 bg-emerald-500/10 text-emerald-100 px-4 py-3 text-sm"
                  role="status"
                  aria-live="polite"
                >
                  Solicitud enviada correctamente. Te contactaremos por correo o teléfono.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" aria-label="Formulario para integrar flota">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="company_name" className="block text-sm font-medium text-white">
                      Empresa / Razón social <span className="text-white/60">(obligatorio)</span>
                    </label>
                    <input
                      id="company_name"
                      name="company_name"
                      autoComplete="organization"
                      value={data.company_name}
                      onChange={(e) => setData('company_name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-indigo-400 focus:ring-indigo-400"
                      placeholder="Ej: Transportes Ejemplo SpA"
                      required
                      aria-invalid={!!errors.company_name}
                      aria-describedby={errors.company_name ? 'company_name_error' : undefined}
                    />
                    {errors.company_name && (
                      <p id="company_name_error" className="mt-1 text-xs text-red-200">
                        {errors.company_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact_name" className="block text-sm font-medium text-white">
                      Nombre de contacto <span className="text-white/60">(obligatorio)</span>
                    </label>
                    <input
                      id="contact_name"
                      name="contact_name"
                      autoComplete="name"
                      value={data.contact_name}
                      onChange={(e) => setData('contact_name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-indigo-400 focus:ring-indigo-400"
                      placeholder="Nombre y apellido"
                      required
                      aria-invalid={!!errors.contact_name}
                      aria-describedby={errors.contact_name ? 'contact_name_error' : undefined}
                    />
                    {errors.contact_name && (
                      <p id="contact_name_error" className="mt-1 text-xs text-red-200">
                        {errors.contact_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white">
                      Teléfono <span className="text-white/60">(obligatorio)</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      autoComplete="tel"
                      inputMode="tel"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-indigo-400 focus:ring-indigo-400"
                      placeholder="+56 9..."
                      required
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone_error' : undefined}
                    />
                    {errors.phone && (
                      <p id="phone_error" className="mt-1 text-xs text-red-200">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-white">
                      Correo <span className="text-white/60">(obligatorio)</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="mt-1 block w-full rounded-md border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-indigo-400 focus:ring-indigo-400"
                      placeholder="nombre@empresa.cl"
                      required
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email_error' : undefined}
                    />
                    {errors.email && (
                      <p id="email_error" className="mt-1 text-xs text-red-200">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="fleet_size" className="block text-sm font-medium text-white">
                      Tamaño de flota
                    </label>
                    <input
                      id="fleet_size"
                      name="fleet_size"
                      value={data.fleet_size}
                      onChange={(e) => setData('fleet_size', e.target.value)}
                      className="mt-1 block w-full rounded-md border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-indigo-400 focus:ring-indigo-400"
                      placeholder="Ej: 5, 12, 40"
                      aria-invalid={!!errors.fleet_size}
                      aria-describedby={errors.fleet_size ? 'fleet_size_error' : 'fleet_size_help'}
                    />
                    {errors.fleet_size && (
                      <p id="fleet_size_error" className="mt-1 text-xs text-red-200">
                        {errors.fleet_size}
                      </p>
                    )}
                    {!errors.fleet_size && (
                      <p id="fleet_size_help" className="mt-1 text-xs text-white/60">
                        Cantidad aproximada de equipos operativos.
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="fleet_types" className="block text-sm font-medium text-white">
                      Tipos de equipos
                    </label>
                    <input
                      id="fleet_types"
                      name="fleet_types"
                      value={data.fleet_types}
                      onChange={(e) => setData('fleet_types', e.target.value)}
                      className="mt-1 block w-full rounded-md border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-indigo-400 focus:ring-indigo-400"
                      placeholder="Rampla, camión 3/4, furgón..."
                      aria-invalid={!!errors.fleet_types}
                      aria-describedby={errors.fleet_types ? 'fleet_types_error' : undefined}
                    />
                    {errors.fleet_types && (
                      <p id="fleet_types_error" className="mt-1 text-xs text-red-200">
                        {errors.fleet_types}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="coverage" className="block text-sm font-medium text-white">
                      Cobertura / rutas
                    </label>
                    <input
                      id="coverage"
                      name="coverage"
                      value={data.coverage}
                      onChange={(e) => setData('coverage', e.target.value)}
                      className="mt-1 block w-full rounded-md border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-indigo-400 focus:ring-indigo-400"
                      placeholder="Regiones, troncales, última milla..."
                      aria-invalid={!!errors.coverage}
                      aria-describedby={errors.coverage ? 'coverage_error' : undefined}
                    />
                    {errors.coverage && (
                      <p id="coverage_error" className="mt-1 text-xs text-red-200">
                        {errors.coverage}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-white">
                      Detalles operativos <span className="text-white/60">(obligatorio)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={data.message}
                      onChange={(e) => setData('message', e.target.value)}
                      className="mt-1 block w-full rounded-md border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-indigo-400 focus:ring-indigo-400"
                      placeholder="Disponibilidad, experiencia, documentación al día, tipo de servicio, observaciones..."
                      required
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message_error' : 'message_help'}
                    />
                    {errors.message && (
                      <p id="message_error" className="mt-1 text-xs text-red-200">
                        {errors.message}
                      </p>
                    )}
                    {!errors.message && (
                      <p id="message_help" className="mt-1 text-xs text-white/60">
                        Mientras más detalle entregues, más rápido podremos evaluar tu propuesta.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <p className="text-xs text-white/60">Enviaremos tu solicitud a evaluación comercial y operativa.</p>

                  <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow transition disabled:opacity-60"
                  >
                    {processing ? 'Enviando...' : 'Enviar solicitud'}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-xs text-white/70 leading-relaxed">
                Al enviar este formulario aceptas que Transportes SCAR pueda contactarte para evaluar una{' '}
                <span className="font-semibold text-white">integración de flota</span>, disponibilidad por ruta y
                condiciones de servicio.
              </div>
            </div>

            {/* Panel derecho: misma paleta */}
            <aside
              className="rounded-xl bg-white/5 ring-1 ring-white/15 p-6 h-fit"
              aria-label="Criterios de evaluación para colaborar"
            >
              <h3 className="text-lg font-semibold text-white">Qué evaluamos</h3>
              <p className="mt-2 text-sm text-white/80">
                Para integrar una flota a la operación, revisamos criterios básicos:
              </p>

              <ul className="mt-4 space-y-2 text-sm text-white/80 list-disc list-inside">
                <li>
                  <b className="text-white">Capacidad operativa</b>: tipo de equipos y disponibilidad real.
                </li>
                <li>
                  <b className="text-white">Cobertura</b>: regiones/rutas y compatibilidad con demanda.
                </li>
                <li>
                  <b className="text-white">Cumplimiento</b>: experiencia, puntualidad y comunicación.
                </li>
                <li>
                  <b className="text-white">Estándares</b>: documentación y seguridad operacional.
                </li>
              </ul>



              <p className="mt-6 text-xs text-white/70">
                Si prefieres, también puedes escribir a{' '}
                <a className="text-indigo-300 hover:underline" href="mailto:contacto@scartransportes.cl">
                  contacto@scartransportes.cl
                </a>
                .
              </p>

              {/* LocalBusiness microdata */}
              <div className="sr-only" itemScope itemType="https://schema.org/LocalBusiness">
                <span itemProp="name">Transportes SCAR</span>
                <a itemProp="email" href="mailto:contacto@scartransportes.cl">
                  contacto@scartransportes.cl
                </a>
                <a itemProp="telephone" href="tel:+56944671205">
                  +56 9 4467 1205
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
