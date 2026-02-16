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

  // --- Form: Postulación Conductor (con CV) ---
  const postulacion = useForm({
    phone: '',
    city: '',
    license_type: '',
    experience_years: '',
    cv_file: null,
    notes: '',
  })

  // --- Form: Solicitud Transporte ---
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

  const novedades = [
    {
      title: 'Portal de postulación y cotización',
      description: 'Ahora puedes postular como conductor o solicitar un servicio de transporte desde tu cuenta.',
      date: 'Febrero 2026',
    },
    {
      title: 'Seguimiento de servicios (próximamente)',
      description: 'Estamos habilitando una vista simple para consultar estado y documentación del servicio.',
      date: 'Q1 2026',
    },
  ]

  const resumen = [
    { label: 'Servicios gestionados (referencial)', value: '248', tone: 'indigo' },
    { label: 'Clientes recurrentes (referencial)', value: '63', tone: 'emerald' },
    { label: 'Capacitaciones (referencial)', value: '142', tone: 'amber' },
  ]

  const toneClasses = {
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', bd: 'border-indigo-200/60 dark:border-indigo-500/20', tx: 'text-indigo-700 dark:text-indigo-200' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', bd: 'border-emerald-200/60 dark:border-emerald-500/20', tx: 'text-emerald-700 dark:text-emerald-200' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-500/10', bd: 'border-amber-200/60 dark:border-amber-500/20', tx: 'text-amber-700 dark:text-amber-200' },
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto p-6 sm:p-8 relative">
        {/* Botón a dashboard por rol (solo si tiene rol) */}
        {hasRole && (
          <Link
            href={getDashboardUrl()}
            className="absolute right-6 top-6 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition dark:bg-indigo-500"
          >
            Ir a mi panel →
          </Link>
        )}

        {/* Mensajes flash */}
        {flash.success && (
          <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-800 px-4 py-2 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-200">
            {flash.success}
          </div>
        )}
        {flash.info && (
          <div className="mb-4 rounded-lg bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-200">
            {flash.info}
          </div>
        )}
        {flash.error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-800 px-4 py-2 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-200">
            {flash.error}
          </div>
        )}

        {/* Card contenedora (estilo Application UI: bordes, subtítulos, forms) */}
        <div className="rounded-lg bg-white shadow-md p-6 dark:bg-gray-900/40 dark:ring-1 dark:ring-white/10">
          <div className="border-b border-gray-900/10 pb-6 dark:border-white/10">
            <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
              Bienvenido, {user.name}
            </h2>

            {!hasRole ? (
              <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                Tu cuenta aún no tiene un rol asignado. Mientras tanto, puedes <b>postular como conductor</b> o
                <b> solicitar un servicio de transporte</b>.
              </p>
            ) : (
              <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                Accede a tu panel para gestionar fletes, operaciones y reportes.
              </p>
            )}

            {/* Indicadores (sin clases dinámicas peligrosas) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumen.map((item, idx) => {
                const t = toneClasses[item.tone] || toneClasses.indigo
                return (
                  <div
                    key={idx}
                    className={`rounded-lg border p-4 text-center ${t.bg} ${t.bd}`}
                  >
                    <p className="text-sm/6 text-gray-600 dark:text-gray-400">{item.label}</p>
                    <p className={`mt-1 text-2xl font-bold ${t.tx}`}>{item.value}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* --- PORTAL SIN ROL: 2 BLOQUES DE FORM (Application UI style) --- */}
          {!hasRole && (
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Postulación Conductor */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  postulacion.post('/postulaciones/conductor', { forceFormData: true })
                }}
                className="rounded-lg border border-gray-900/10 p-5 dark:border-white/10"
              >
                <div className="border-b border-gray-900/10 pb-4 dark:border-white/10">
                  <h3 className="text-base/7 font-semibold text-gray-900 dark:text-white">Postulación a Conductor</h3>
                  <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                    Completa tus datos y adjunta tu CV. Te contactaremos para el proceso de selección.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                      Teléfono
                    </label>
                    <div className="mt-2">
                      <input
                        value={postulacion.data.phone}
                        onChange={(e) => postulacion.setData('phone', e.target.value)}
                        placeholder="+56 9..."
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      />
                      {postulacion.errors.phone && <p className="mt-1 text-xs text-red-600">{postulacion.errors.phone}</p>}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                      Ciudad base
                    </label>
                    <div className="mt-2">
                      <input
                        value={postulacion.data.city}
                        onChange={(e) => postulacion.setData('city', e.target.value)}
                        placeholder="Talca, Santiago..."
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      />
                      {postulacion.errors.city && <p className="mt-1 text-xs text-red-600">{postulacion.errors.city}</p>}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                      Licencia
                    </label>
                    <div className="mt-2">
                      <input
                        value={postulacion.data.license_type}
                        onChange={(e) => postulacion.setData('license_type', e.target.value)}
                        placeholder="A2 / A4 / A5..."
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      />
                      {postulacion.errors.license_type && <p className="mt-1 text-xs text-red-600">{postulacion.errors.license_type}</p>}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                      Años de experiencia
                    </label>
                    <div className="mt-2">
                      <input
                        type="number"
                        min="0"
                        value={postulacion.data.experience_years}
                        onChange={(e) => postulacion.setData('experience_years', e.target.value)}
                        placeholder="0"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      />
                      {postulacion.errors.experience_years && (
                        <p className="mt-1 text-xs text-red-600">{postulacion.errors.experience_years}</p>
                      )}
                    </div>
                  </div>

                  {/* CV upload (tomado del template) */}
                  <div className="col-span-full">
                    <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                      CV (PDF/DOC/DOCX)
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-8 dark:border-white/25">
                      <div className="text-center">
                        <PhotoIcon aria-hidden="true" className="mx-auto size-10 text-gray-300 dark:text-gray-600" />
                        <div className="mt-3 flex text-sm/6 text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="cv-upload"
                            className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:focus-within:outline-indigo-500 dark:hover:text-indigo-300"
                          >
                            <span>Subir archivo</span>
                            <input
                              id="cv-upload"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="sr-only"
                              onChange={(e) => postulacion.setData('cv_file', e.target.files?.[0] || null)}
                            />
                          </label>
                          <p className="pl-1">o arrastra y suelta</p>
                        </div>
                        <p className="text-xs/5 text-gray-600 dark:text-gray-400">PDF/DOC/DOCX hasta 5MB</p>
                        {postulacion.data.cv_file && (
                          <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                            Archivo: <span className="font-medium">{postulacion.data.cv_file.name}</span>
                          </p>
                        )}
                        {postulacion.errors.cv_file && <p className="mt-2 text-xs text-red-600">{postulacion.errors.cv_file}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                      Comentarios
                    </label>
                    <div className="mt-2">
                      <textarea
                        rows={3}
                        value={postulacion.data.notes}
                        onChange={(e) => postulacion.setData('notes', e.target.value)}
                        placeholder="Disponibilidad, rutas, tipo de camión, etc."
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      />
                      {postulacion.errors.notes && <p className="mt-1 text-xs text-red-600">{postulacion.errors.notes}</p>}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-4">
                  <button
                    type="button"
                    onClick={() => postulacion.reset()}
                    className="text-sm/6 font-semibold text-gray-900 dark:text-white"
                  >
                    Limpiar
                  </button>
                  <button
                    type="submit"
                    disabled={postulacion.processing}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:focus-visible:outline-indigo-500"
                  >
                    {postulacion.processing ? 'Enviando...' : 'Enviar postulación'}
                  </button>
                </div>
              </form>

              {/* Solicitud Transporte */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  solicitud.post('/solicitudes/transporte')
                }}
                className="rounded-lg border border-gray-900/10 p-5 dark:border-white/10"
              >
                <div className="border-b border-gray-900/10 pb-4 dark:border-white/10">
                  <h3 className="text-base/7 font-semibold text-gray-900 dark:text-white">Solicitar transporte</h3>
                  <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                    Indica origen, destino y detalles de tu carga. Te responderemos con tarifa y disponibilidad.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">Origen</label>
                    <div className="mt-2">
                      <input
                        value={solicitud.data.origin}
                        onChange={(e) => solicitud.setData('origin', e.target.value)}
                        placeholder="Ciudad / dirección"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      />
                      {solicitud.errors.origin && <p className="mt-1 text-xs text-red-600">{solicitud.errors.origin}</p>}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">Destino</label>
                    <div className="mt-2">
                      <input
                        value={solicitud.data.destination}
                        onChange={(e) => solicitud.setData('destination', e.target.value)}
                        placeholder="Ciudad / dirección"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      />
                      {solicitud.errors.destination && <p className="mt-1 text-xs text-red-600">{solicitud.errors.destination}</p>}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">Tipo de carga</label>
                    <div className="mt-2">
                      <input
                        value={solicitud.data.cargo_type}
                        onChange={(e) => solicitud.setData('cargo_type', e.target.value)}
                        placeholder="Paletizada, granel, maquinaria..."
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      />
                      {solicitud.errors.cargo_type && <p className="mt-1 text-xs text-red-600">{solicitud.errors.cargo_type}</p>}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">Peso (kg)</label>
                    <div className="mt-2">
                      <input
                        type="number"
                        min="0"
                        value={solicitud.data.cargo_weight_kg}
                        onChange={(e) => solicitud.setData('cargo_weight_kg', e.target.value)}
                        placeholder="1000"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      />
                      {solicitud.errors.cargo_weight_kg && <p className="mt-1 text-xs text-red-600">{solicitud.errors.cargo_weight_kg}</p>}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">Fecha de retiro</label>
                    <div className="mt-2">
                      <input
                        type="date"
                        value={solicitud.data.pickup_date}
                        onChange={(e) => solicitud.setData('pickup_date', e.target.value)}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:focus:outline-indigo-500"
                      />
                      {solicitud.errors.pickup_date && <p className="mt-1 text-xs text-red-600">{solicitud.errors.pickup_date}</p>}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">Teléfono contacto</label>
                    <div className="mt-2">
                      <input
                        value={solicitud.data.contact_phone}
                        onChange={(e) => solicitud.setData('contact_phone', e.target.value)}
                        placeholder="+56 9..."
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      />
                      {solicitud.errors.contact_phone && <p className="mt-1 text-xs text-red-600">{solicitud.errors.contact_phone}</p>}
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">Descripción</label>
                    <div className="mt-2">
                      <textarea
                        rows={4}
                        value={solicitud.data.description}
                        onChange={(e) => solicitud.setData('description', e.target.value)}
                        placeholder="Medidas, cuidados, horarios, referencias..."
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      />
                      {solicitud.errors.description && <p className="mt-1 text-xs text-red-600">{solicitud.errors.description}</p>}
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Incluye dimensiones, restricción de horario, tipo de camión requerido, etc.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-4">
                  <button
                    type="button"
                    onClick={() => solicitud.reset()}
                    className="text-sm/6 font-semibold text-gray-900 dark:text-white"
                  >
                    Limpiar
                  </button>
                  <button
                    type="submit"
                    disabled={solicitud.processing}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:focus-visible:outline-indigo-500"
                  >
                    {solicitud.processing ? 'Enviando...' : 'Solicitar cotización'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Novedades (secundario) */}
          <div className="mt-10 border-t border-gray-900/10 pt-6 dark:border-white/10">
            <h3 className="text-base/7 font-semibold text-gray-900 dark:text-white">Novedades</h3>
            <ul className="mt-4 space-y-3">
              {novedades.map((item, idx) => (
                <li
                  key={idx}
                  className="rounded-lg bg-indigo-50 p-4 hover:bg-indigo-100 transition dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">{item.title}</h4>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
                    </div>
                    <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{item.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div className="mt-10 border-t border-gray-900/10 pt-6 dark:border-white/10">
            <h3 className="text-base/7 font-semibold text-gray-900 dark:text-white">Soporte y asistencia</h3>
            <p className="mt-2 text-sm/6 text-gray-600 dark:text-gray-400">
              ¿Dudas sobre servicios o tu cuenta? Escríbenos y te ayudamos.
            </p>
            <ul className="mt-3 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              <li>
                Correo: <a href="mailto:contacto@scartransportes.cl" className="text-indigo-600 hover:underline dark:text-indigo-400">contacto@scartransportes.cl</a>
              </li>
              <li>Horario: 08:00 a 18:30 hrs</li>
              <li>
                Sección <Link href="/contacto" className="text-indigo-600 hover:underline dark:text-indigo-400">Contacto</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
