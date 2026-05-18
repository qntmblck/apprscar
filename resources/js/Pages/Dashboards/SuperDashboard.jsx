import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, usePage, Link, router } from '@inertiajs/react'
import {
  TruckIcon, UsersIcon, WrenchScrewdriverIcon, ClipboardDocumentListIcon,
  CheckCircleIcon, XCircleIcon, ClockIcon, ChartBarIcon,
  UserGroupIcon, BellAlertIcon, DocumentTextIcon, ArrowRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

function StatCard({ icon: Icon, label, value, color, href }) {
  const colors = {
    blue:   'from-[#0094d9]/20 to-[#003f8c]/10 border-[#0094d9]/20 text-[#0094d9]',
    green:  'from-emerald-500/20 to-emerald-700/10 border-emerald-500/20 text-emerald-400',
    amber:  'from-amber-500/20 to-amber-700/10 border-amber-500/20 text-amber-400',
    indigo: 'from-indigo-500/20 to-indigo-700/10 border-indigo-500/20 text-indigo-400',
  }
  const card = (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5 flex items-center gap-4 hover:brightness-110 transition-all`}>
      <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-current" />
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-3xl font-extrabold text-white mt-0.5">{value}</p>
      </div>
    </div>
  )
  return href ? <Link href={href}>{card}</Link> : card
}

function SolicitudRow({ item, tipo, onAction }) {
  const [nota, setNota] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(null)

  const labels = {
    transporte:   { emoji: '🚛', label: 'Transporte' },
    conductor:    { emoji: '👷', label: 'Conductor' },
    colaborador:  { emoji: '🤝', label: 'Colaborador' },
  }
  const t = labels[tipo]

  async function handle(accion) {
    setLoading(accion)
    await onAction(item.id, tipo, accion, nota)
    setLoading(null)
    setOpen(false)
  }

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-white/[0.05] transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-xl">{t.emoji}</span>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold uppercase tracking-wide text-[#0094d9]">{t.label}</span>
              <span className="text-xs text-slate-500">#{item.id}</span>
            </div>
            <p className="text-sm font-semibold text-white">{item.user_name || 'Usuario'}</p>
            <p className="text-xs text-slate-400">{item.user_email}</p>
            {item.origin && <p className="text-xs text-slate-500 mt-1">{item.origin} → {item.destination}</p>}
            {item.city && <p className="text-xs text-slate-500 mt-1">{item.city} · Lic. {item.license_type}</p>}
            {item.company_name && <p className="text-xs text-slate-500 mt-1">{item.company_name} · {item.fleet_size} unidades</p>}
            <p className="text-xs text-slate-600 mt-1">{new Date(item.created_at).toLocaleDateString('es-CL')}</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(v => !v)}
          className="text-xs text-[#0094d9] hover:underline shrink-0"
        >
          {open ? 'Cerrar' : 'Gestionar'}
        </button>
      </div>

      {open && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
          <textarea
            value={nota}
            onChange={e => setNota(e.target.value)}
            placeholder="Nota para el usuario (opcional)..."
            rows={2}
            className="w-full bg-black/30 border border-white/10 text-slate-300 placeholder-slate-600 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0094d9]/50 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handle('approved')}
              disabled={loading === 'approved'}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <CheckCircleIcon className="w-4 h-4" />
              {loading === 'approved' ? 'Procesando…' : 'Aprobar'}
            </button>
            <button
              onClick={() => handle('rejected')}
              disabled={loading === 'rejected'}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <XCircleIcon className="w-4 h-4" />
              {loading === 'rejected' ? 'Procesando…' : 'Rechazar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SuperDashboard() {
  const { summary, actividadReciente, solicitudesPendientes } = usePage().props
  const {
    fletesRealizados = 0,
    conductoresActivos = 0,
    solicitudesMantencion = 0,
    usuariosTotal = 0,
  } = summary || {}

  const pendientes = solicitudesPendientes || { transporte: [], conductor: [], colaborador: [] }
  const totalPendientes = (pendientes.transporte?.length || 0) +
                          (pendientes.conductor?.length || 0) +
                          (pendientes.colaborador?.length || 0)

  function handleAction(id, tipo, accion, nota) {
    const routeMap = {
      transporte:  route('admin.solicitudes_transporte.status', id),
      conductor:   route('admin.postulaciones_conductor.status', id),
      colaborador: route('admin.solicitudes_colaborador.status', id),
    }
    return new Promise((resolve) => {
      router.patch(routeMap[tipo], { status: accion, admin_notes: nota }, {
        preserveScroll: true,
        onFinish: resolve,
      })
    })
  }

  const allSolicitudes = [
    ...(pendientes.transporte  || []).map(s => ({ ...s, tipo: 'transporte' })),
    ...(pendientes.conductor   || []).map(s => ({ ...s, tipo: 'conductor' })),
    ...(pendientes.colaborador || []).map(s => ({ ...s, tipo: 'colaborador' })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return (
    <AuthenticatedLayout>
      <Head title="SuperAdmin Dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#0094d9] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <ShieldCheckIcon className="w-3.5 h-3.5" /> SuperAdmin
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Panel de Control</h1>
          </div>
          {totalPendientes > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <BellAlertIcon className="w-4 h-4" />
              {totalPendientes} solicitud{totalPendientes !== 1 ? 'es' : ''} pendiente{totalPendientes !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={TruckIcon}            label="Fletes realizados"    value={fletesRealizados}      color="blue"   href="/fletes" />
          <StatCard icon={UsersIcon}            label="Conductores activos"  value={conductoresActivos}    color="green"  href="/usuarios" />
          <StatCard icon={WrenchScrewdriverIcon} label="Mant. pendientes"   value={solicitudesMantencion} color="amber" />
          <StatCard icon={UserGroupIcon}        label="Usuarios totales"     value={usuariosTotal}         color="indigo" href="/usuarios" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Solicitudes pendientes */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ClipboardDocumentListIcon className="w-4 h-4 text-[#0094d9]" />
                Solicitudes de contacto
                {totalPendientes > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">{totalPendientes}</span>
                )}
              </h2>
            </div>

            {allSolicitudes.length > 0 ? (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {allSolicitudes.map(s => (
                  <SolicitudRow
                    key={`${s.tipo}-${s.id}`}
                    item={s}
                    tipo={s.tipo}
                    onAction={handleAction}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-white/10 rounded-2xl bg-white/[0.02]">
                <CheckCircleIcon className="w-10 h-10 mx-auto mb-3 text-emerald-500/40" />
                <p className="text-slate-400 font-medium text-sm">Sin solicitudes pendientes</p>
                <p className="text-slate-600 text-xs mt-1">Todo al día.</p>
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div className="space-y-4">

            {/* Accesos rápidos */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <ChartBarIcon className="w-4 h-4 text-[#0094d9]" />
                Accesos rápidos
              </h2>
              <div className="space-y-2">
                {[
                  { href: '/fletes',   label: 'Revisar fletes',     icon: TruckIcon },
                  { href: '/usuarios', label: 'Gestionar usuarios',  icon: UsersIcon },
                  { href: '/admin/solicitudes', label: 'Todas las solicitudes', icon: DocumentTextIcon },
                ].map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-[#0094d9]/10 border border-white/5 hover:border-[#0094d9]/30 text-slate-300 hover:text-white transition-all group">
                    <div className="flex items-center gap-2.5 text-sm font-medium">
                      <Icon className="w-4 h-4 text-[#0094d9]" />
                      {label}
                    </div>
                    <ArrowRightIcon className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#0094d9] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Actividad reciente */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-[#0094d9]" />
                Actividad reciente
              </h2>
              <ul className="space-y-2">
                {actividadReciente && actividadReciente.length > 0 ? (
                  actividadReciente.map((item, i) => (
                    <li key={i} className="text-xs text-slate-400 py-2 border-b border-white/5 last:border-0">
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-600">Sin actividad reciente.</li>
                )}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
