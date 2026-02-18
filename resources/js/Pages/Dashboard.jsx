// resources/js/Pages/Dashboard.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Link, useForm, usePage } from '@inertiajs/react'
import { PhotoIcon } from '@heroicons/react/24/solid'

export default function Dashboard() {
  const { props } = usePage()
  const user = props.auth?.user || {}
  const roles = user.roles || []
  const flash = props.flash || {}

  const hasRole = roles.length > 0

  const getDashboardUrl = () => {
    if (roles.includes('superadmin')) return '/super/dashboard'
    if (roles.includes('admin')) return '/admin/dashboard'
    if (roles.includes('colaborador')) return '/colaborador/dashboard'
    if (roles.includes('cliente')) return '/cliente/dashboard'
    if (roles.includes('conductor')) return '/conductor/dashboard'
    return '/dashboard'
  }

  // Form: Postulación Conductor
  const postulacion = useForm({
    phone: '',
    city: '',
    license_type: '',
    experience_years: '',
    cv_file: null,
    notes: '',
  })

  // Form: Solicitud Transporte
  const solicitud = useForm({
    origin: '',
    destination: '',
    cargo_type: '',
    cargo_weight_kg: '',
    pickup_date: '',
    description: '',
    contact_phone: '',
    contact_email: user.email || '',
  })

  // Form: Solicitud Colaborador (Integración de flota)
  const colaborador = useForm({
    company_name: '',
    contact_name: '',
    email: user.email || '',
    phone: '',
    fleet_size: '',
    fleet_types: '',
    coverage: '',
    message: '',
  })

  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl mx-auto p-6 sm:p-8 relative">
        {/* Botón a dashboard por rol (solo si tiene rol) */}
        {hasRole && (
          <Link
            href={getDashboardUrl()}
            className="absolute right-6 top-6 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition"
          >
            Ir a mi panel →
          </Link>
        )}

        {/* Flash messages */}
        {flash.success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 text-green-800 px-4 py-2">
            {flash.success}
          </div>
        )}
        {flash.info && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 text-blue-800 px-4 py-2">
            {flash.info}
          </div>
        )}
        {flash.error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-800 px-4 py-2">
            {flash.error}
          </div>
        )}

        {/* Contenedor principal - alto contraste */}
        <div className="rounded-xl bg-white shadow-md ring-1 ring-gray-200">
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">Bienvenido, {user.name}</h1>

            {!hasRole ? (
              <p className="mt-2 text-sm text-gray-700 max-w-3xl">
                Tu cuenta aún no tiene un rol asignado. Puedes <b>postular como conductor</b>,{' '}
                <b>solicitar un servicio de transporte</b> o <b>postular como colaborador (integrar flota)</b>. Si ya
                perteneces a SCAR y necesitas acceso, contáctanos.
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-700">
                Accede a tu panel según tu rol para gestionar fletes y operación.
              </p>
            )}
          </div>

          {!hasRole && (
            <div className="p-6 sm:p-8 space-y-8">
              {/* Grid 2 columnas: Conductor + Transporte */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- Postulación a conductor --- */}
                <section id="postulacion-conductor" className="rounded-xl border border-gray-200">
                  <div className="p-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Postulación a Conductor</h2>
                    <p className="mt-1 text-sm text-gray-700">
                      Completa tus datos y adjunta tu CV. Revisaremos tu postulación y te contactaremos.
                    </p>
                  </div>

                  <form
                    className="p-5 space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault()
                      postulacion.post('/postulaciones/conductor', { forceFormData: true })
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900">Teléfono</label>
                        <input
                          name="phone"
                          value={postulacion.data.phone}
                          onChange={(e) => postulacion.setData('phone', e.target.value)}
                          placeholder="+56 9..."
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                        />
                        {postulacion.errors.phone && (
                          <p className="mt-1 text-xs text-red-600">{postulacion.errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">Ciudad base</label>
                        <input
                          name="city"
                          value={postulacion.data.city}
                          onChange={(e) => postulacion.setData('city', e.target.value)}
                          placeholder="Talca, Santiago..."
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                        />
                        {postulacion.errors.city && (
                          <p className="mt-1 text-xs text-red-600">{postulacion.errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">Licencia</label>
                        <input
                          name="license_type"
                          value={postulacion.data.license_type}
                          onChange={(e) => postulacion.setData('license_type', e.target.value)}
                          placeholder="A2 / A4 / A5..."
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                        />
                        {postulacion.errors.license_type && (
                          <p className="mt-1 text-xs text-red-600">{postulacion.errors.license_type}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">Años de experiencia</label>
                        <input
                          name="experience_years"
                          type="number"
                          min="0"
                          value={postulacion.data.experience_years}
                          onChange={(e) => postulacion.setData('experience_years', e.target.value)}
                          placeholder="0"
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                        />
                        {postulacion.errors.experience_years && (
                          <p className="mt-1 text-xs text-red-600">{postulacion.errors.experience_years}</p>
                        )}
                      </div>
                    </div>

                    {/* Upload CV */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900">CV (PDF/DOC/DOCX)</label>
                      <div className="mt-2 rounded-lg border border-dashed border-gray-300 px-4 py-6">
                        <div className="flex items-center gap-3">
                          <PhotoIcon className="h-7 w-7 text-gray-400" />
                          <div className="text-sm text-gray-700">
                            <label
                              htmlFor="cv-upload"
                              className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
                            >
                              Subir archivo
                            </label>
                            <input
                              id="cv-upload"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="sr-only"
                              onChange={(e) => postulacion.setData('cv_file', e.target.files?.[0] || null)}
                            />
                            <span className="ml-2 text-gray-600">o arrastra y suelta aquí</span>
                            <div className="mt-1 text-xs text-gray-500">Máx. 5MB</div>
                            {postulacion.data.cv_file && (
                              <div className="mt-2 text-xs text-gray-700">
                                Archivo seleccionado: <b>{postulacion.data.cv_file.name}</b>
                              </div>
                            )}
                          </div>
                        </div>
                        {postulacion.errors.cv_file && (
                          <p className="mt-2 text-xs text-red-600">{postulacion.errors.cv_file}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900">Comentarios</label>
                      <textarea
                        name="notes"
                        rows={3}
                        value={postulacion.data.notes}
                        onChange={(e) => postulacion.setData('notes', e.target.value)}
                        placeholder="Disponibilidad, rutas, tipo de camión, etc."
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                      />
                      {postulacion.errors.notes && (
                        <p className="mt-1 text-xs text-red-600">{postulacion.errors.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => postulacion.reset()}
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                      >
                        Limpiar
                      </button>
                      <button
                        type="submit"
                        disabled={postulacion.processing}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:opacity-60"
                      >
                        {postulacion.processing ? 'Enviando...' : 'Enviar postulación'}
                      </button>
                    </div>
                  </form>
                </section>

                {/* --- Solicitud de transporte --- */}
                <section className="rounded-xl border border-gray-200">
                  <div className="p-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Solicitar transporte</h2>
                    <p className="mt-1 text-sm text-gray-700">
                      Indica origen, destino y detalles de la carga. Te contactaremos para coordinar.
                    </p>
                  </div>

                  <form
                    className="p-5 space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault()
                      solicitud.post('/solicitudes/transporte')
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900">Origen</label>
                        <input
                          name="origin"
                          value={solicitud.data.origin}
                          onChange={(e) => solicitud.setData('origin', e.target.value)}
                          placeholder="Ciudad / dirección"
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                        />
                        {solicitud.errors.origin && (
                          <p className="mt-1 text-xs text-red-600">{solicitud.errors.origin}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">Destino</label>
                        <input
                          name="destination"
                          value={solicitud.data.destination}
                          onChange={(e) => solicitud.setData('destination', e.target.value)}
                          placeholder="Ciudad / dirección"
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                        />
                        {solicitud.errors.destination && (
                          <p className="mt-1 text-xs text-red-600">{solicitud.errors.destination}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">Tipo de carga</label>
                        <input
                          name="cargo_type"
                          value={solicitud.data.cargo_type}
                          onChange={(e) => solicitud.setData('cargo_type', e.target.value)}
                          placeholder="Paletizada, granel, maquinaria..."
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                        />
                        {solicitud.errors.cargo_type && (
                          <p className="mt-1 text-xs text-red-600">{solicitud.errors.cargo_type}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">Peso aprox. (kg)</label>
                        <input
                          name="cargo_weight_kg"
                          type="number"
                          min="0"
                          value={solicitud.data.cargo_weight_kg}
                          onChange={(e) => solicitud.setData('cargo_weight_kg', e.target.value)}
                          placeholder="1000"
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                        />
                        {solicitud.errors.cargo_weight_kg && (
                          <p className="mt-1 text-xs text-red-600">{solicitud.errors.cargo_weight_kg}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">Fecha de retiro (opcional)</label>
                        <input
                          name="pickup_date"
                          type="date"
                          value={solicitud.data.pickup_date}
                          onChange={(e) => solicitud.setData('pickup_date', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                        />
                        {solicitud.errors.pickup_date && (
                          <p className="mt-1 text-xs text-red-600">{solicitud.errors.pickup_date}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">Teléfono de contacto</label>
                        <input
                          name="contact_phone"
                          value={solicitud.data.contact_phone}
                          onChange={(e) => solicitud.setData('contact_phone', e.target.value)}
                          placeholder="+56 9..."
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                        />
                        {solicitud.errors.contact_phone && (
                          <p className="mt-1 text-xs text-red-600">{solicitud.errors.contact_phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900">Descripción</label>
                      <textarea
                        name="description"
                        rows={4}
                        value={solicitud.data.description}
                        onChange={(e) => solicitud.setData('description', e.target.value)}
                        placeholder="Dimensiones, cuidados, horario, referencias..."
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                      />
                      {solicitud.errors.description && (
                        <p className="mt-1 text-xs text-red-600">{solicitud.errors.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => solicitud.reset()}
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                      >
                        Limpiar
                      </button>
                      <button
                        type="submit"
                        disabled={solicitud.processing}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:opacity-60"
                      >
                        {solicitud.processing ? 'Enviando...' : 'Enviar solicitud'}
                      </button>
                    </div>
                  </form>
                </section>
              </div>

              {/* --- Solicitud Colaborador (Integración de flota) --- */}
              <section id="solicitud-colaborador" className="rounded-xl border border-gray-200">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Convertirse en Colaborador (Integrar flota)
                  </h2>
                  <p className="mt-1 text-sm text-gray-700">
                    Si cuentas con camiones/ramplas/furgones y quieres operar con SCAR, completa este formulario.
                    Evaluamos alianzas B2B de mediano y largo plazo.
                  </p>
                </div>

                <form
                  className="p-5 space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault()
                    colaborador.post(route('contacto.colaborador'), {
                      onSuccess: () => colaborador.reset(),
                    })
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-900">Empresa / Razón social</label>
                      <input
                        name="company_name"
                        value={colaborador.data.company_name}
                        onChange={(e) => colaborador.setData('company_name', e.target.value)}
                        placeholder="Ej: Transportes Ejemplo SpA"
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                      />
                      {colaborador.errors.company_name && (
                        <p className="mt-1 text-xs text-red-600">{colaborador.errors.company_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900">Nombre de contacto</label>
                      <input
                        name="contact_name"
                        value={colaborador.data.contact_name}
                        onChange={(e) => colaborador.setData('contact_name', e.target.value)}
                        placeholder="Nombre y apellido"
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                      />
                      {colaborador.errors.contact_name && (
                        <p className="mt-1 text-xs text-red-600">{colaborador.errors.contact_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900">Teléfono</label>
                      <input
                        name="phone"
                        value={colaborador.data.phone}
                        onChange={(e) => colaborador.setData('phone', e.target.value)}
                        placeholder="+56 9..."
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                      />
                      {colaborador.errors.phone && (
                        <p className="mt-1 text-xs text-red-600">{colaborador.errors.phone}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-900">Correo</label>
                      <input
                        name="email"
                        type="email"
                        value={colaborador.data.email}
                        onChange={(e) => colaborador.setData('email', e.target.value)}
                        placeholder="nombre@empresa.cl"
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                      />
                      {colaborador.errors.email && (
                        <p className="mt-1 text-xs text-red-600">{colaborador.errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900">Tamaño de flota</label>
                      <input
                        name="fleet_size"
                        value={colaborador.data.fleet_size}
                        onChange={(e) => colaborador.setData('fleet_size', e.target.value)}
                        placeholder="Ej: 5, 12, 40"
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                      />
                      {colaborador.errors.fleet_size && (
                        <p className="mt-1 text-xs text-red-600">{colaborador.errors.fleet_size}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900">Tipos de equipos</label>
                      <input
                        name="fleet_types"
                        value={colaborador.data.fleet_types}
                        onChange={(e) => colaborador.setData('fleet_types', e.target.value)}
                        placeholder="Rampla, camión 3/4, furgón..."
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                      />
                      {colaborador.errors.fleet_types && (
                        <p className="mt-1 text-xs text-red-600">{colaborador.errors.fleet_types}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-900">Cobertura / rutas</label>
                      <input
                        name="coverage"
                        value={colaborador.data.coverage}
                        onChange={(e) => colaborador.setData('coverage', e.target.value)}
                        placeholder="Regiones, troncales, última milla..."
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                      />
                      {colaborador.errors.coverage && (
                        <p className="mt-1 text-xs text-red-600">{colaborador.errors.coverage}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">Detalles operativos</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={colaborador.data.message}
                      onChange={(e) => colaborador.setData('message', e.target.value)}
                      placeholder="Disponibilidad, experiencia, documentación, tipo de servicio, observaciones..."
                      className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
                    />
                    {colaborador.errors.message && (
                      <p className="mt-1 text-xs text-red-600">{colaborador.errors.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => colaborador.reset()}
                      className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Limpiar
                    </button>
                    <button
                      type="submit"
                      disabled={colaborador.processing}
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:opacity-60"
                    >
                      {colaborador.processing ? 'Enviando...' : 'Enviar solicitud'}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}

          {/* Soporte simple y real */}
          <div className="p-6 sm:p-8 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Soporte</h3>
            <p className="mt-1 text-sm text-gray-700">
              Si necesitas ayuda con tu cuenta o tu solicitud, escríbenos:
              <a href="mailto:contacto@scartransportes.cl" className="ml-1 text-indigo-600 hover:underline">
                contacto@scartransportes.cl
              </a>
            </p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
