import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, usePage, Link, router } from '@inertiajs/react'
import {
  TruckIcon, UsersIcon, ClipboardDocumentListIcon,
  CheckCircleIcon, XCircleIcon, ClockIcon,
  UserGroupIcon, BellAlertIcon, DocumentTextIcon, ArrowRightIcon,
  ShieldCheckIcon, BanknotesIcon, ExclamationTriangleIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline'

/* ─── helpers ─────────────────────────────────────────────────── */
const fmt = n => n != null ? `$${Math.round(Number(n)).toLocaleString('es-CL')}` : '—'

/* ─── KPI Card ────────────────────────────────────────────────── */
function KpiCard({ icon: Icon, label, value, sub, color, href, alert }) {
  const colors = {
    blue:    'from-[#0094d9]/20 to-[#003f8c]/10 border-[#0094d9]/20 text-[#0094d9]',
    emerald: 'from-emerald-500/20 to-emerald-700/10 border-emerald-500/20 text-emerald-400',
    amber:   'from-amber-500/20 to-amber-700/10 border-amber-500/20 text-amber-400',
    violet:  'from-violet-500/20 to-violet-700/10 border-violet-500/20 text-violet-400',
    red:     'from-red-500/20 to-red-700/10 border-red-500/20 text-red-400',
    slate:   'from-slate-500/15 to-slate-700/10 border-slate-500/15 text-slate-400',
  }
  const inner = (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-4 flex items-center gap-3 hover:brightness-110 transition-all h-full`}>
      <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-current" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium truncate">{label}</p>
        <p className="text-2xl font-extrabold text-white leading-tight">{value}</p>
        {sub && <p className="text-[10px] text-slate-500 mt-0.5 truncate">{sub}</p>}
      </div>
      {alert && <ExclamationTriangleIcon className="w-4 h-4 text-amber-400 shrink-0" />}
    </div>
  )
  return href ? <Link href={href} className="block h-full">{inner}</Link> : <div className="h-full">{inner}</div>
}

/* ─── Trend badge ─────────────────────────────────────────────── */
function Trend({ current, prev }) {
  if (prev === 0) return null
  const delta = current - prev
  const pct   = Math.round((delta / prev) * 100)
  if (delta === 0) return <span className="text-[10px] text-slate-500">= mes anterior</span>
  return (
    <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
      {delta > 0 ? <ArrowTrendingUpIcon className="w-3 h-3" /> : <ArrowTrendingDownIcon className="w-3 h-3" />}
      {Math.abs(pct)}% vs mes ant.
    </span>
  )
}

/* ─── Solicitud Row ───────────────────────────────────────────── */
function SolicitudRow({ item, tipo, onAction }) {
  const [nota, setNota]       = useState('')
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(null)

  const labels = {
    transporte:  { emoji: '🚛', label: 'Transporte' },
    conductor:   { emoji: '👷', label: 'Conductor' },
    colaborador: { emoji: '🤝', label: 'Colaborador' },
  }
  const t = labels[tipo]

  const handle = async (accion) => {
    setLoading(accion)
    await onAction(item.id, tipo, accion, nota)
    setLoading(null)
    setOpen(false)
  }

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 hover:bg-white/[0.05] transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="text-base">{t.emoji}</span>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#0094d9]">{t.label}</span>
              <span className="text-[10px] text-slate-600">#{item.id}</span>
            </div>
            <p className="text-sm font-semibold text-white">{item.user_name || 'Usuario'}</p>
            <p className="text-[11px] text-slate-400">{item.user_email}</p>
            {item.origin && <p className="text-[10px] text-slate-500 mt-0.5">{item.origin} → {item.destination}</p>}
            {item.city && <p className="text-[10px] text-slate-500 mt-0.5">{item.city} · Lic. {item.license_type}</p>}
            {item.company_name && <p className="text-[10px] text-slate-500 mt-0.5">{item.company_name}</p>}
          </div>
        </div>
        <button onClick={() => setOpen(v => !v)} className="text-[11px] text-[#0094d9] hover:underline shrink-0">
          {open ? 'Cerrar' : 'Gestionar'}
        </button>
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
          <textarea value={nota} onChange={e => setNota(e.target.value)}
            placeholder="Nota para el usuario (opcional)..." rows={2}
            className="w-full bg-black/30 border border-white/10 text-slate-300 placeholder-slate-600 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0094d9]/50 resize-none" />
          <div className="flex gap-2">
            <button onClick={() => handle('approved')} disabled={loading === 'approved'}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all disabled:opacity-50">
              <CheckCircleIcon className="w-3.5 h-3.5" />{loading === 'approved' ? 'Procesando…' : 'Aprobar'}
            </button>
            <button onClick={() => handle('rejected')} disabled={loading === 'rejected'}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-xs font-semibold transition-all disabled:opacity-50">
              <XCircleIcon className="w-3.5 h-3.5" />{loading === 'rejected' ? 'Procesando…' : 'Rechazar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main ────────────────────────────────────────────────────── */
export default function SuperDashboard() {
  const { kpis = {}, ultimosFletes = [], solicitudesPendientes = {}, totalPendientes = 0 } = usePage().props

  const {
    fletes_en_curso       = 0,
    fletes_rendidos       = 0,
    fletes_aprobados      = 0,
    fletes_mes            = 0,
    fletes_mes_anterior   = 0,
    pagado_mes            = 0,
    sin_rendir            = 0,
    conductores_activos   = 0,
    conductores_con_flete = 0,
    saldo_total_aprobado  = 0,
  } = kpis

  const pendientes = solicitudesPendientes || {}
  const allSolicitudes = [
    ...(pendientes.transporte  || []).map(s => ({ ...s, tipo: 'transporte' })),
    ...(pendientes.conductor   || []).map(s => ({ ...s, tipo: 'conductor' })),
    ...(pendientes.colaborador || []).map(s => ({ ...s, tipo: 'colaborador' })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const handleAction = (id, tipo, accion, nota) => {
    const routeMap = {
      transporte:  route('admin.solicitudes_transporte.status', id),
      conductor:   route('admin.postulaciones_conductor.status', id),
      colaborador: route('admin.solicitudes_colaborador.status', id),
    }
    return new Promise(resolve => {
      router.patch(routeMap[tipo], { status: accion, admin_notes: nota }, { preserveScroll: true, onFinish: resolve })
    })
  }

  const STATUS_COLOR = {
    'En curso': 'text-[#0094d9]',
    'Rendido':  'text-amber-300',
    'Aprobado': 'text-emerald-300',
    'Pagado':   'text-violet-300',
  }

  return (
    <AuthenticatedLayout>
      <Head title="Panel SuperAdmin" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-[#0094d9] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <ShieldCheckIcon className="w-3 h-3" /> SuperAdmin
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Panel de control</h1>
          </div>
          {totalPendientes > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <BellAlertIcon className="w-4 h-4" />
              {totalPendientes} solicitud{totalPendientes !== 1 ? 'es' : ''} pendiente{totalPendientes !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* ── KPIs fila 1: Operacional ─────────────────────────────── */}
        <div>
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">Operación</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KpiCard icon={TruckIcon}    label="En curso"    value={fletes_en_curso}   color="blue"   href="/fletes?estado=En+curso" />
            <KpiCard icon={DocumentTextIcon} label="Por rendir" value={sin_rendir}     color="amber"  href="/super/rendiciones?estado=En+curso"
              alert={sin_rendir > 5} sub={sin_rendir > 0 ? 'Pendientes de rendición' : 'Al día'} />
            <KpiCard icon={ClockIcon}    label="Rendidos"    value={fletes_rendidos}   color="amber"  href="/super/rendiciones?estado=Rendido" />
            <KpiCard icon={CheckCircleIcon} label="Aprobados" value={fletes_aprobados} color="emerald" href="/super/rendiciones?estado=Aprobado" />
          </div>
        </div>

        {/* ── KPIs fila 2: Financiero ──────────────────────────────── */}
        <div>
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">Financiero</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-emerald-500/15 to-emerald-800/10 border border-emerald-500/20 rounded-2xl p-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Saldo por pagar</p>
              <p className="text-2xl font-extrabold text-white leading-tight mt-1">{fmt(saldo_total_aprobado)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{fletes_aprobados} flete{fletes_aprobados !== 1 ? 's' : ''} aprobado{fletes_aprobados !== 1 ? 's' : ''}</p>
            </div>
            <div className="bg-gradient-to-br from-violet-500/15 to-violet-800/10 border border-violet-500/20 rounded-2xl p-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Pagados este mes</p>
              <p className="text-2xl font-extrabold text-white leading-tight mt-1">{pagado_mes}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">fletes liquidados</p>
            </div>
            <div className="bg-gradient-to-br from-[#0094d9]/15 to-[#003f8c]/10 border border-[#0094d9]/20 rounded-2xl p-4">
              <div className="flex items-start justify-between">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Fletes este mes</p>
                <Trend current={fletes_mes} prev={fletes_mes_anterior} />
              </div>
              <p className="text-2xl font-extrabold text-white leading-tight mt-1">{fletes_mes}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{fletes_mes_anterior} el mes anterior</p>
            </div>
          </div>
        </div>

        {/* ── KPIs fila 3: Conductores ─────────────────────────────── */}
        <div>
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">Conductores</p>
          <div className="grid grid-cols-2 gap-3">
            <KpiCard icon={UsersIcon}     label="Conductores activos"   value={conductores_activos}   color="slate" href="/usuarios" />
            <KpiCard icon={UserGroupIcon} label="Con flete activo"       value={conductores_con_flete} color="blue"
              sub={conductores_activos > 0 ? `${Math.round((conductores_con_flete / conductores_activos) * 100)}% ocupados` : ''}/>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Últimos fletes */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TruckIcon className="w-4 h-4 text-[#0094d9]" />
                Fletes recientes
              </h2>
              <Link href="/fletes" className="text-[11px] text-[#0094d9] hover:underline flex items-center gap-1">
                Ver todos <ArrowRightIcon className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-1.5">
              {ultimosFletes.length > 0 ? ultimosFletes.map(f => (
                <div key={f.id} className="flex items-center gap-3 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-2.5">
                  <span className="text-[10px] font-mono text-slate-600 shrink-0">#{f.id}</span>
                  <span className="flex-1 text-sm font-semibold text-white truncate">{f.destino}</span>
                  <span className="text-[10px] text-slate-500 truncate hidden sm:block">{f.conductor}</span>
                  <span className={`text-[10px] font-semibold shrink-0 ${STATUS_COLOR[f.estado] ?? 'text-slate-400'}`}>{f.estado}</span>
                  <span className="text-[10px] text-slate-600 shrink-0">{f.fecha}</span>
                </div>
              )) : (
                <p className="text-xs text-slate-600 py-4 text-center">Sin fletes registrados.</p>
              )}
            </div>

            {/* Solicitudes pendientes */}
            {allSolicitudes.length > 0 && (
              <>
                <div className="flex items-center justify-between pt-4">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <ClipboardDocumentListIcon className="w-4 h-4 text-[#0094d9]" />
                    Solicitudes de contacto
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">{allSolicitudes.length}</span>
                  </h2>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {allSolicitudes.map(s => (
                    <SolicitudRow key={`${s.tipo}-${s.id}`} item={s} tipo={s.tipo} onAction={handleAction} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Panel lateral — Accesos rápidos */}
          <div className="space-y-4">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <ArrowRightIcon className="w-4 h-4 text-[#0094d9]" />
                Accesos rápidos
              </h2>
              <div className="space-y-2">
                {[
                  { href: '/fletes',            label: 'Operaciones',          icon: TruckIcon,               badge: fletes_en_curso > 0 ? fletes_en_curso : null },
                  { href: '/super/rendiciones', label: 'Rendiciones',           icon: DocumentTextIcon,        badge: fletes_rendidos > 0 ? fletes_rendidos : null, badgeColor: 'bg-amber-500/20 text-amber-300' },
                  { href: '/usuarios',          label: 'Usuarios & conductores',icon: UsersIcon },
                ].map(({ href, label, icon: Icon, badge, badgeColor }) => (
                  <Link key={href} href={href}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-[#0094d9]/10 border border-white/5 hover:border-[#0094d9]/30 text-slate-300 hover:text-white transition-all group">
                    <div className="flex items-center gap-2.5 text-sm font-medium">
                      <Icon className="w-4 h-4 text-[#0094d9]" />
                      {label}
                    </div>
                    <div className="flex items-center gap-2">
                      {badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${badgeColor ?? 'bg-[#0094d9]/20 text-[#0094d9]'}`}>{badge}</span>
                      )}
                      <ArrowRightIcon className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#0094d9] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Alertas */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-2.5">
              <h2 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <BellAlertIcon className="w-4 h-4 text-[#0094d9]" />
                Estado rápido
              </h2>
              {[
                {
                  ok: sin_rendir === 0,
                  msg: sin_rendir > 0 ? `${sin_rendir} fletes sin rendir` : 'Todos los fletes rendidos',
                  href: '/super/rendiciones?estado=En+curso',
                },
                {
                  ok: fletes_aprobados === 0,
                  msg: fletes_aprobados > 0 ? `${fletes_aprobados} aprobados pendientes de pago` : 'Sin pagos pendientes',
                  href: '/super/rendiciones?estado=Aprobado',
                },
                {
                  ok: totalPendientes === 0,
                  msg: totalPendientes > 0 ? `${totalPendientes} solicitudes de contacto` : 'Sin solicitudes pendientes',
                },
              ].map(({ ok, msg, href }, i) => {
                const inner = (
                  <div className={`flex items-center gap-2 text-xs rounded-xl px-3 py-2 border transition-colors ${
                    ok ? 'bg-emerald-500/8 border-emerald-500/15 text-emerald-400'
                       : 'bg-amber-500/8 border-amber-400/20 text-amber-300 hover:bg-amber-500/12 cursor-pointer'
                  }`}>
                    {ok ? <CheckCircleIcon className="w-3.5 h-3.5 shrink-0" /> : <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0" />}
                    {msg}
                  </div>
                )
                return href && !ok
                  ? <Link key={i} href={href}>{inner}</Link>
                  : <div key={i}>{inner}</div>
              })}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
