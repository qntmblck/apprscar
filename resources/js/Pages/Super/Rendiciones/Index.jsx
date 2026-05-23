import { useState } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import axios from 'axios'
import {
  TruckIcon, CheckCircleIcon, CurrencyDollarIcon,
  ClockIcon, FunnelIcon, ArrowPathIcon,
  ChatBubbleLeftRightIcon, EnvelopeIcon,
  ExclamationTriangleIcon, ChevronDownIcon,
  DocumentCheckIcon, BanknotesIcon,
} from '@heroicons/react/24/outline'

/* ─── helpers ─────────────────────────────────────────────────── */
const fmt = (n) =>
  n != null ? `$${Number(n).toLocaleString('es-CL')}` : '—'

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'

const STATUS = {
  'En curso': { label: 'En curso',  color: 'bg-[#0094d9]/15 text-[#0094d9]  border-[#0094d9]/30' },
  'Rendido':  { label: 'Rendido',   color: 'bg-amber-500/15 text-amber-300  border-amber-400/30' },
  'Aprobado': { label: 'Aprobado',  color: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' },
  'Pagado':   { label: 'Pagado',    color: 'bg-violet-500/15 text-violet-300 border-violet-400/30' },
}

/* ─── WhatsApp / Email helpers ────────────────────────────────── */
function buildWaMessage(flete) {
  const destino   = flete.destino?.nombre ?? 'sin destino'
  const cliente   = flete.cliente_principal?.razon_social ?? flete.cliente_nombre ?? '—'
  const salida    = fmtDate(flete.fecha_salida)
  const llegada   = fmtDate(flete.fecha_llegada)
  const url       = `${window.location.origin}/conductor/servicios`

  return encodeURIComponent(
    `Hola ${flete.conductor?.name ?? 'conductor'} 👋,\n` +
    `Te solicitamos rendir los gastos del flete:\n` +
    `• Destino: ${destino}\n` +
    `• Cliente: ${cliente}\n` +
    `• Salida: ${salida} — Llegada: ${llegada}\n\n` +
    `Por favor ingresa al sistema y registra tus gastos:\n${url}`
  )
}

function buildEmailHref(flete) {
  const destino = flete.destino?.nombre ?? 'sin destino'
  const salida  = fmtDate(flete.fecha_salida)
  const url     = `${window.location.origin}/conductor/servicios`
  const subject = encodeURIComponent(`Rendición de gastos — flete a ${destino} (${salida})`)
  const body    = encodeURIComponent(
    `Hola ${flete.conductor?.name ?? 'conductor'},\n\n` +
    `Te solicitamos que rindas los gastos del siguiente servicio:\n` +
    `Destino: ${destino} | Salida: ${salida}\n\n` +
    `Ingresa aquí para registrarlos: ${url}\n\n` +
    `Gracias.`
  )
  const email = flete.conductor?.email ?? ''
  return `mailto:${email}?subject=${subject}&body=${body}`
}

/* ─── Stat card ───────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color }) {
  const c = {
    blue:   'from-[#0094d9]/20 to-[#003f8c]/10 border-[#0094d9]/25 text-[#0094d9]',
    amber:  'from-amber-500/20 to-amber-800/10 border-amber-400/25 text-amber-300',
    emerald:'from-emerald-500/20 to-emerald-800/10 border-emerald-400/25 text-emerald-300',
    violet: 'from-violet-500/20 to-violet-800/10 border-violet-400/25 text-violet-300',
  }[color]
  return (
    <div className={`bg-gradient-to-br ${c} border rounded-2xl px-5 py-4 flex items-center gap-4`}>
      <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-current" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-white leading-none">{value}</p>
        <p className="text-xs font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

/* ─── Rendicion summary inside card ──────────────────────────── */
function RendicionSummary({ rendicion }) {
  if (!rendicion) return (
    <p className="text-xs text-slate-500 italic">Sin rendición registrada</p>
  )

  const gastos  = rendicion.total_gastos ?? rendicion.gastos?.reduce((a, g) => a + g.monto, 0) ?? 0
  const diesel  = rendicion.total_diesel ?? rendicion.diesels?.reduce((a, d) => a + d.monto, 0) ?? 0
  const abonos  = rendicion.abonos?.reduce((a, b) => a + b.monto, 0) ?? 0
  const saldo   = rendicion.saldo_temporal ?? (abonos - gastos - diesel)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
      {[
        { label: 'Gastos',  value: gastos,  color: 'text-red-300' },
        { label: 'Diesel',  value: diesel,  color: 'text-orange-300' },
        { label: 'Abonos',  value: abonos,  color: 'text-emerald-300' },
        { label: 'Saldo',   value: saldo,   color: saldo >= 0 ? 'text-emerald-300' : 'text-red-400' },
      ].map(({ label, value, color }) => (
        <div key={label} className="bg-white/[0.03] border border-white/8 rounded-xl px-3 py-2">
          <p className="text-[10px] text-slate-500 font-medium">{label}</p>
          <p className={`text-sm font-bold ${color}`}>{fmt(value)}</p>
        </div>
      ))}
    </div>
  )
}

/* ─── Flete card (review-style) ──────────────────────────────── */
function FleteRendicionCard({ flete, onSolicitar, onAprobar, onPagado, loading }) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS[flete.estado] ?? STATUS['En curso']
  const isSinRendir = flete.estado === 'En curso' && !flete.rendicion
  const isRendido   = flete.estado === 'Rendido'
  const isAprobado  = flete.estado === 'Aprobado'

  const waMsg  = buildWaMessage(flete)
  const phone  = flete.conductor_phone?.replace(/\D/g, '') ?? ''
  const waHref = phone ? `https://wa.me/56${phone}?text=${waMsg}` : `https://wa.me/?text=${waMsg}`
  const emailHref = buildEmailHref(flete)

  const yaSolicitado = !!flete.rendicion_solicitada_at

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/15 transition-colors">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icono estado */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isSinRendir ? 'bg-amber-500/15' :
              isRendido   ? 'bg-[#0094d9]/15' :
              isAprobado  ? 'bg-emerald-500/15' : 'bg-violet-500/15'
            }`}>
              {isSinRendir  ? <ExclamationTriangleIcon className="w-4.5 h-4.5 text-amber-400" /> :
               isRendido    ? <DocumentCheckIcon className="w-4.5 h-4.5 text-[#0094d9]" /> :
               isAprobado   ? <CheckCircleIcon className="w-4.5 h-4.5 text-emerald-400" /> :
                              <BanknotesIcon className="w-4.5 h-4.5 text-violet-400" />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  #{flete.id}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.color}`}>
                  {status.label}
                </span>
                {yaSolicitado && flete.estado === 'En curso' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full border bg-orange-500/10 text-orange-300 border-orange-400/25">
                    Solicitado
                  </span>
                )}
              </div>
              <p className="text-base font-bold text-white mt-0.5 truncate">
                {flete.destino?.nombre ?? '—'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {flete.cliente_principal?.razon_social ?? flete.cliente_nombre ?? '—'}
              </p>
            </div>
          </div>

          {/* Fechas */}
          <div className="text-right shrink-0">
            <p className="text-[10px] text-slate-500">Salida</p>
            <p className="text-xs font-semibold text-slate-300">{fmtDate(flete.fecha_salida)}</p>
            {flete.fecha_llegada && (
              <>
                <p className="text-[10px] text-slate-500 mt-1">Llegada</p>
                <p className="text-xs font-semibold text-slate-300">{fmtDate(flete.fecha_llegada)}</p>
              </>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-lg bg-[#0094d9]/10 flex items-center justify-center">
              <TruckIcon className="w-3 h-3 text-[#0094d9]" />
            </div>
            <span className="text-xs text-slate-400">{flete.conductor?.name ?? '—'}</span>
          </div>
          {flete.tracto?.patente && (
            <span className="text-[10px] bg-white/5 border border-white/10 rounded px-2 py-0.5 text-slate-400 font-mono">
              {flete.tracto.patente}
            </span>
          )}
          {flete.guiaruta && (
            <span className="text-[10px] text-slate-500">GR: {flete.guiaruta}</span>
          )}
        </div>

        {/* Expandir rendición */}
        <button
          onClick={() => setExpanded(p => !p)}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 mt-3 transition-colors"
        >
          <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Ocultar detalle' : 'Ver detalle rendición'}
        </button>
      </div>

      {/* Rendicion detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3">
          <RendicionSummary rendicion={flete.rendicion} />
          {flete.rendicion?.observaciones && (
            <p className="text-xs text-slate-400 mt-2 italic">{flete.rendicion.observaciones}</p>
          )}
        </div>
      )}

      {/* Actions footer */}
      <div className="px-4 py-3 border-t border-white/5 flex items-center gap-2 flex-wrap bg-white/[0.015]">

        {/* Sin rendir: mostrar solicitar + WhatsApp + Email */}
        {isSinRendir && (
          <>
            <button
              onClick={() => onSolicitar(flete.id)}
              disabled={loading === flete.id}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/20 transition-colors disabled:opacity-50"
            >
              <ClockIcon className="w-3.5 h-3.5" />
              {yaSolicitado ? 'Re-solicitar' : 'Solicitar rendición'}
            </button>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-500/15 hover:bg-green-500/25 text-green-300 border border-green-400/20 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
              WhatsApp
            </a>

            <a
              href={emailHref}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
            >
              <EnvelopeIcon className="w-3.5 h-3.5" />
              Email
            </a>
          </>
        )}

        {/* Rendido: aprobar */}
        {isRendido && (
          <button
            onClick={() => onAprobar(flete.id)}
            disabled={loading === flete.id}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/25 transition-colors disabled:opacity-50"
          >
            <CheckCircleIcon className="w-3.5 h-3.5" />
            {loading === flete.id ? 'Aprobando…' : 'Aprobar rendición'}
          </button>
        )}

        {/* Aprobado: marcar pagado */}
        {isAprobado && (
          <button
            onClick={() => onPagado(flete.id)}
            disabled={loading === flete.id}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-400/25 transition-colors disabled:opacity-50"
          >
            <BanknotesIcon className="w-3.5 h-3.5" />
            {loading === flete.id ? 'Procesando…' : 'Marcar pagado'}
          </button>
        )}

        {/* Pagado: estado final */}
        {flete.estado === 'Pagado' && (
          <span className="text-xs text-violet-400 font-medium flex items-center gap-1">
            <BanknotesIcon className="w-3.5 h-3.5" />
            Pagado ✓
          </span>
        )}
      </div>
    </div>
  )
}

/* ─── Filtros ─────────────────────────────────────────────────── */
function Filtros({ filtros, conductores, estados, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FunnelIcon className="w-4 h-4 text-slate-500 shrink-0" />

      <select
        value={filtros.conductor_id ?? ''}
        onChange={e => onChange('conductor_id', e.target.value || null)}
        className="bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300 px-3 py-1.5 focus:outline-none focus:border-[#0094d9]/40"
      >
        <option value="">Todos los conductores</option>
        {conductores.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        value={filtros.estado ?? ''}
        onChange={e => onChange('estado', e.target.value || null)}
        className="bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300 px-3 py-1.5 focus:outline-none focus:border-[#0094d9]/40"
      >
        <option value="">Todos los estados</option>
        {estados.map(e => <option key={e} value={e}>{e}</option>)}
      </select>

      <input
        type="date"
        value={filtros.desde ?? ''}
        onChange={e => onChange('desde', e.target.value || null)}
        className="bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400 px-3 py-1.5 focus:outline-none focus:border-[#0094d9]/40"
      />
      <span className="text-slate-600 text-xs">—</span>
      <input
        type="date"
        value={filtros.hasta ?? ''}
        onChange={e => onChange('hasta', e.target.value || null)}
        className="bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400 px-3 py-1.5 focus:outline-none focus:border-[#0094d9]/40"
      />
    </div>
  )
}

/* ─── Main page ───────────────────────────────────────────────── */
export default function SuperRendicionesIndex() {
  const { props } = usePage()
  const { fletes, stats, filtros: initFiltros, conductores, estados } = props

  const [filtros, setFiltros]   = useState(initFiltros ?? {})
  const [loading, setLoading]   = useState(null)
  const [toast, setToast]       = useState(null)
  const [fletesData, setFletes] = useState(fletes)

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleFiltro = (key, val) => {
    const next = { ...filtros, [key]: val }
    setFiltros(next)
    router.get(route('super.rendiciones.index'), next, { preserveState: true, replace: true })
  }

  const doPost = async (url, fleteId, successMsg) => {
    setLoading(fleteId)
    try {
      const res = await axios.post(url)
      showToast(successMsg)
      // Update local flete state
      setFletes(prev => ({
        ...prev,
        data: prev.data.map(f => f.id === fleteId ? { ...f, ...res.data.flete } : f),
      }))
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al procesar.', 'err')
    } finally {
      setLoading(null)
    }
  }

  const handleSolicitar = (id) =>
    doPost(route('super.rendiciones.solicitar', id), id, 'Rendición solicitada al conductor.')

  const handleAprobar = (id) =>
    doPost(route('super.rendiciones.aprobar', id), id, 'Rendición aprobada.')

  const handlePagado = (id) =>
    doPost(route('super.rendiciones.pagado', id), id, 'Flete marcado como pagado.')

  const lista = fletesData?.data ?? []

  return (
    <AuthenticatedLayout>
      <Head title="Panel de Rendiciones" />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium transition-all ${
            toast.type === 'ok'
              ? 'bg-emerald-900/90 border-emerald-500/30 text-emerald-300'
              : 'bg-red-900/90 border-red-500/30 text-red-300'
          }`}>
            {toast.type === 'ok' ? <CheckCircleIcon className="w-4 h-4" /> : <ExclamationTriangleIcon className="w-4 h-4" />}
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div>
          <p className="text-xs font-semibold text-[#0094d9] uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <DocumentCheckIcon className="w-3.5 h-3.5" />
            Superadmin
          </p>
          <h1 className="text-2xl font-extrabold text-white">Panel de Rendiciones</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Gestiona los gastos rendidos por conductores — solicita, aprueba y paga.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={ExclamationTriangleIcon} label="Sin rendir"  value={stats.sin_rendir}  color="amber"   />
          <StatCard icon={DocumentCheckIcon}       label="Rendidos"    value={stats.rendidos}    color="blue"    />
          <StatCard icon={CheckCircleIcon}         label="Aprobados"   value={stats.aprobados}   color="emerald" />
          <StatCard icon={BanknotesIcon}           label="Pagados"     value={stats.pagados}     color="violet"  />
        </div>

        {/* Filtros */}
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-4">
          <Filtros
            filtros={filtros}
            conductores={conductores}
            estados={estados}
            onChange={handleFiltro}
          />
        </div>

        {/* Lista */}
        {lista.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0094d9]/10 border border-[#0094d9]/20 flex items-center justify-center mb-4">
              <ArrowPathIcon className="w-8 h-8 text-[#0094d9]/40" />
            </div>
            <p className="text-slate-300 font-semibold">Sin fletes para mostrar</p>
            <p className="text-slate-500 text-sm mt-1">Prueba ajustando los filtros.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lista.map(flete => (
              <FleteRendicionCard
                key={flete.id}
                flete={flete}
                onSolicitar={handleSolicitar}
                onAprobar={handleAprobar}
                onPagado={handlePagado}
                loading={loading}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {fletesData?.last_page > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            {Array.from({ length: fletesData.last_page }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => router.get(route('super.rendiciones.index'), { ...filtros, page }, { preserveState: true })}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                  page === fletesData.current_page
                    ? 'bg-[#0094d9] text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
