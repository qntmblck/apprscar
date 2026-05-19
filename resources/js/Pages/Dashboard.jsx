import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Link, useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'
import {
  TruckIcon, UserGroupIcon, BuildingOfficeIcon,
  CheckCircleIcon, XCircleIcon, BellAlertIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import { DocumentArrowUpIcon } from '@heroicons/react/24/solid'

const TIPO_LABEL = {
  conductor:   'postulación como conductor',
  transporte:  'solicitud de transporte',
  colaborador: 'solicitud de integración de flota',
}

const TABS = [
  { key: 'conductor',   label: 'Conductor',   icon: TruckIcon },
  { key: 'transporte',  label: 'Transporte',  icon: UserGroupIcon },
  { key: 'colaborador', label: 'Colaborador', icon: BuildingOfficeIcon },
]

function InputField({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

function DarkInput({ value, onChange, placeholder, type = 'text', min, ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      className="w-full rounded-xl bg-white/[0.05] border border-[#0094d9]/20 text-slate-200 placeholder-slate-500 px-3 py-2 text-sm focus:outline-none focus:border-[#0094d9]/50 focus:bg-white/[0.08] transition-colors"
      {...rest}
    />
  )
}

function DarkTextarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl bg-white/[0.05] border border-[#0094d9]/20 text-slate-200 placeholder-slate-500 px-3 py-2 text-sm focus:outline-none focus:border-[#0094d9]/50 focus:bg-white/[0.08] transition-colors"
    />
  )
}

export default function Dashboard() {
  const { props } = usePage()
  const user = props.auth?.user || {}
  const roles = props.auth?.roles || []
  const flash = props.flash || {}
  const notifications = props.solicitudNotifications || []

  const hasRole = roles.length > 0
  const [activeTab, setActiveTab] = useState('conductor')

  const getDashboardUrl = () => {
    if (roles.includes('superadmin')) return '/super/dashboard'
    if (roles.includes('admin')) return '/admin/dashboard'
    if (roles.includes('colaborador')) return '/colaborador/dashboard'
    if (roles.includes('cliente')) return '/cliente/dashboard'
    if (roles.includes('conductor')) return '/conductor/dashboard'
    return '/dashboard'
  }

  const postulacion = useForm({
    phone: '', city: '', license_type: '', experience_years: '', cv_file: null, notes: '',
  })

  const solicitud = useForm({
    origin: '', destination: '', cargo_type: '', cargo_weight_kg: '',
    pickup_date: '', description: '', contact_phone: '', contact_email: user.email || '',
  })

  const colaborador = useForm({
    company_name: '', contact_name: '', email: user.email || '',
    phone: '', fleet_size: '', fleet_types: '', coverage: '', message: '',
  })

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#0094d9] uppercase tracking-widest mb-1">Portal</p>
            <h1 className="text-2xl font-extrabold text-white">Bienvenido, {user.name?.split(' ')[0]}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
          </div>
          {hasRole && (
            <Link
              href={getDashboardUrl()}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#0094d9]/20 hover:bg-[#0094d9]/30 border border-[#0094d9]/30 text-[#0094d9] hover:text-white text-xs font-semibold px-4 py-2 transition-all"
            >
              Ir a mi panel <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Flash messages */}
        {flash.success && (
          <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 text-sm">
            <CheckCircleIcon className="w-4 h-4 shrink-0" />{flash.success}
          </div>
        )}
        {flash.error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 text-sm">
            <XCircleIcon className="w-4 h-4 shrink-0" />{flash.error}
          </div>
        )}

        {/* Notificaciones de solicitudes procesadas */}
        {notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
                  n.status === 'approved'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                <BellAlertIcon className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">
                    {n.status === 'approved'
                      ? `✅ Tu ${TIPO_LABEL[n.tipo]} fue aprobada`
                      : `❌ Tu ${TIPO_LABEL[n.tipo]} fue revisada y no pudo avanzar`}
                  </p>
                  {n.admin_notes && <p className="mt-1 opacity-80 text-xs">{n.admin_notes}</p>}
                  {n.status === 'approved' && hasRole && (
                    <Link href={getDashboardUrl()} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-2">
                      Ir a mi panel <ArrowRightIcon className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formularios solo si no tiene rol */}
        {!hasRole && (
          <div className="bg-white/[0.02] border border-[#0094d9]/15 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[#0094d9]/15">
              <p className="text-sm text-slate-300">
                Tu cuenta aún no tiene un rol asignado. Completa la solicitud que corresponda para que podamos orientar tu caso con datos claros.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#0094d9]/15">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${
                    activeTab === key
                      ? 'text-[#0094d9] border-b-2 border-[#0094d9] bg-[#0094d9]/5'
                      : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className="w-4 h-4 hidden sm:block" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab: Conductor */}
            {activeTab === 'conductor' && (
              <form
                className="p-6 space-y-5"
                onSubmit={(e) => { e.preventDefault(); postulacion.post('/postulaciones/conductor', { forceFormData: true }) }}
              >
                <div>
                  <h2 className="text-base font-bold text-white">Postulación a conductor</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Adjunta tu CV y completa antecedentes de licencia, experiencia y disponibilidad para evaluar compatibilidad operativa.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Teléfono" error={postulacion.errors.phone}>
                    <DarkInput value={postulacion.data.phone} onChange={e => postulacion.setData('phone', e.target.value)} placeholder="+56 9..." />
                  </InputField>
                  <InputField label="Ciudad base" error={postulacion.errors.city}>
                    <DarkInput value={postulacion.data.city} onChange={e => postulacion.setData('city', e.target.value)} placeholder="Talca, Santiago..." />
                  </InputField>
                  <InputField label="Tipo de licencia" error={postulacion.errors.license_type}>
                    <DarkInput value={postulacion.data.license_type} onChange={e => postulacion.setData('license_type', e.target.value)} placeholder="A2 / A4 / A5..." />
                  </InputField>
                  <InputField label="Años de experiencia" error={postulacion.errors.experience_years}>
                    <DarkInput type="number" min="0" value={postulacion.data.experience_years} onChange={e => postulacion.setData('experience_years', e.target.value)} placeholder="0" />
                  </InputField>
                </div>

                <InputField label="CV (PDF/DOC/DOCX)" error={postulacion.errors.cv_file}>
                  <label className="flex items-center gap-3 w-full rounded-xl bg-white/[0.05] border border-dashed border-[#0094d9]/30 px-4 py-4 cursor-pointer hover:border-[#0094d9]/50 hover:bg-white/[0.08] transition-colors">
                    <DocumentArrowUpIcon className="h-6 w-6 text-[#0094d9]/60 shrink-0" />
                    <div className="text-sm">
                      <span className="font-semibold text-[#0094d9]">Subir archivo</span>
                      <span className="text-slate-400 ml-1">o arrastra aquí · Máx. 5MB</span>
                      {postulacion.data.cv_file && (
                        <div className="mt-1 text-xs text-emerald-400">✓ {postulacion.data.cv_file.name}</div>
                      )}
                    </div>
                    <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={e => postulacion.setData('cv_file', e.target.files?.[0] || null)} />
                  </label>
                </InputField>

                <InputField label="Comentarios" error={postulacion.errors.notes}>
                  <DarkTextarea value={postulacion.data.notes} onChange={e => postulacion.setData('notes', e.target.value)} placeholder="Disponibilidad, rutas conocidas, experiencia, tipo de camión, etc." />
                </InputField>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button type="button" onClick={() => postulacion.reset()} className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Limpiar</button>
                  <button type="submit" disabled={postulacion.processing} className="rounded-xl bg-[#0094d9] hover:bg-[#00a0f0] disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0094d9]/20 transition-all">
                    {postulacion.processing ? 'Enviando…' : 'Enviar postulación'}
                  </button>
                </div>
              </form>
            )}

            {/* Tab: Transporte */}
            {activeTab === 'transporte' && (
              <form
                className="p-6 space-y-5"
                onSubmit={(e) => { e.preventDefault(); solicitud.post('/solicitudes/transporte') }}
              >
                <div>
                  <h2 className="text-base font-bold text-white">Solicitar transporte</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Indica origen, destino, volumen y ventana. Evaluaremos si conviene flete dedicado, carga consolidada o distribución programada.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Origen" error={solicitud.errors.origin}>
                    <DarkInput value={solicitud.data.origin} onChange={e => solicitud.setData('origin', e.target.value)} placeholder="Ciudad / dirección" />
                  </InputField>
                  <InputField label="Destino" error={solicitud.errors.destination}>
                    <DarkInput value={solicitud.data.destination} onChange={e => solicitud.setData('destination', e.target.value)} placeholder="Ciudad / dirección" />
                  </InputField>
                  <InputField label="Tipo de carga" error={solicitud.errors.cargo_type}>
                    <DarkInput value={solicitud.data.cargo_type} onChange={e => solicitud.setData('cargo_type', e.target.value)} placeholder="Paletizada, bultos, carga general..." />
                  </InputField>
                  <InputField label="Peso aprox. (kg)" error={solicitud.errors.cargo_weight_kg}>
                    <DarkInput type="number" min="0" value={solicitud.data.cargo_weight_kg} onChange={e => solicitud.setData('cargo_weight_kg', e.target.value)} placeholder="1000" />
                  </InputField>
                  <InputField label="Fecha de retiro (opcional)" error={solicitud.errors.pickup_date}>
                    <DarkInput type="date" value={solicitud.data.pickup_date} onChange={e => solicitud.setData('pickup_date', e.target.value)} />
                  </InputField>
                  <InputField label="Teléfono de contacto" error={solicitud.errors.contact_phone}>
                    <DarkInput value={solicitud.data.contact_phone} onChange={e => solicitud.setData('contact_phone', e.target.value)} placeholder="+56 9..." />
                  </InputField>
                </div>

                <InputField label="Descripción" error={solicitud.errors.description}>
                  <DarkTextarea rows={4} value={solicitud.data.description} onChange={e => solicitud.setData('description', e.target.value)} placeholder="Dimensiones, cuidados, horario, prioridad, restricciones o documentación..." />
                </InputField>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button type="button" onClick={() => solicitud.reset()} className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Limpiar</button>
                  <button type="submit" disabled={solicitud.processing} className="rounded-xl bg-[#0094d9] hover:bg-[#00a0f0] disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0094d9]/20 transition-all">
                    {solicitud.processing ? 'Enviando…' : 'Enviar solicitud'}
                  </button>
                </div>
              </form>
            )}

            {/* Tab: Colaborador */}
            {activeTab === 'colaborador' && (
              <form
                className="p-6 space-y-5"
                onSubmit={(e) => { e.preventDefault(); colaborador.post('/solicitudes/colaborador', { onSuccess: () => colaborador.reset() }) }}
              >
                <div>
                  <h2 className="text-base font-bold text-white">Integrar flota como colaborador</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Si cuentas con camiones, ramplas o furgones, cuéntanos cobertura, disponibilidad y estándares para evaluar rutas compatibles.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Empresa / Razón social" error={colaborador.errors.company_name}>
                    <DarkInput value={colaborador.data.company_name} onChange={e => colaborador.setData('company_name', e.target.value)} placeholder="Transportes Ejemplo SpA" />
                  </InputField>
                  <InputField label="Nombre de contacto" error={colaborador.errors.contact_name}>
                    <DarkInput value={colaborador.data.contact_name} onChange={e => colaborador.setData('contact_name', e.target.value)} placeholder="Nombre y apellido" />
                  </InputField>
                  <InputField label="Teléfono" error={colaborador.errors.phone}>
                    <DarkInput value={colaborador.data.phone} onChange={e => colaborador.setData('phone', e.target.value)} placeholder="+56 9..." />
                  </InputField>
                  <InputField label="Correo" error={colaborador.errors.email}>
                    <DarkInput type="email" value={colaborador.data.email} onChange={e => colaborador.setData('email', e.target.value)} placeholder="nombre@empresa.cl" />
                  </InputField>
                  <InputField label="Tamaño de flota" error={colaborador.errors.fleet_size}>
                    <DarkInput value={colaborador.data.fleet_size} onChange={e => colaborador.setData('fleet_size', e.target.value)} placeholder="5, 12, 40..." />
                  </InputField>
                  <InputField label="Tipos de equipos" error={colaborador.errors.fleet_types}>
                    <DarkInput value={colaborador.data.fleet_types} onChange={e => colaborador.setData('fleet_types', e.target.value)} placeholder="Rampla, camión 3/4, furgón..." />
                  </InputField>
                  <InputField label="Cobertura / rutas" error={colaborador.errors.coverage}>
                    <DarkInput value={colaborador.data.coverage} onChange={e => colaborador.setData('coverage', e.target.value)} placeholder="Regiones, troncales, última milla..." />
                  </InputField>
                </div>

                <InputField label="Detalles operativos" error={colaborador.errors.message}>
                  <DarkTextarea rows={4} value={colaborador.data.message} onChange={e => colaborador.setData('message', e.target.value)} placeholder="Disponibilidad, experiencia, documentación, tipo de servicio..." />
                </InputField>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button type="button" onClick={() => colaborador.reset()} className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Limpiar</button>
                  <button type="submit" disabled={colaborador.processing} className="rounded-xl bg-[#0094d9] hover:bg-[#00a0f0] disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0094d9]/20 transition-all">
                    {colaborador.processing ? 'Enviando…' : 'Enviar solicitud'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Si ya tiene rol, mensaje de redirección */}
        {hasRole && notifications.length === 0 && (
          <div className="bg-white/[0.02] border border-[#0094d9]/15 rounded-2xl p-6 text-center">
            <p className="text-slate-400 text-sm mb-3">Accede a tu panel para revisar fletes, solicitudes y estados operativos.</p>
            <Link href={getDashboardUrl()} className="inline-flex items-center gap-2 rounded-xl bg-[#0094d9] hover:bg-[#00a0f0] px-5 py-2.5 text-sm font-semibold text-white transition-all">
              Ir a mi panel <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
