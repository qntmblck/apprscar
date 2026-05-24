import { useState, useMemo, useEffect } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import axios from 'axios'
import {
  TruckIcon, CheckCircleIcon, CurrencyDollarIcon,
  ClockIcon, FunnelIcon, ArrowPathIcon,
  ChatBubbleLeftRightIcon, EnvelopeIcon,
  ExclamationTriangleIcon, ChevronDownIcon,
  DocumentCheckIcon, BanknotesIcon, XMarkIcon,
  ExclamationCircleIcon, MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

/* ─── helpers ─────────────────────────────────────────────────── */
const fmt = (n) => n != null ? `$${Number(n).toLocaleString('es-CL')}` : '—'
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'

const STATUS = {
  'En curso': { label: 'En curso',  color: 'bg-[#0094d9]/15 text-[#0094d9]  border-[#0094d9]/30' },
  'Rendido':  { label: 'Rendido',   color: 'bg-amber-500/15 text-amber-300  border-amber-400/30' },
  'Aprobado': { label: 'Aprobado',  color: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' },
  'Pagado':   { label: 'Pagado',    color: 'bg-violet-500/15 text-violet-300 border-violet-400/30' },
}

/* ─── WhatsApp / Email ────────────────────────────────────────── */
function buildWaRendicion(flete, publicUrl) {
  return encodeURIComponent(
    `Hola ${flete.conductor?.name ?? 'conductor'} 👋\n` +
    `Te solicitan rendir los gastos del flete #${flete.id} (${flete.destino?.nombre ?? ''}).\n\n` +
    `🔗 Ingresa aquí para completar tu rendición:\n${publicUrl}\n\n` +
    `Solo debes registrar tus gastos, abonos y retorno, y luego hacer clic en "Finalizar rendición". ¡Gracias!`
  )
}

function buildEmailRendicion(flete, publicUrl) {
  const subject = encodeURIComponent(`Solicitud de rendición — Flete #${flete.id} ${flete.destino?.nombre ?? ''}`)
  const body = encodeURIComponent(
    `Hola ${flete.conductor?.name ?? 'conductor'},\n\n` +
    `Te solicitamos completar la rendición del flete #${flete.id} (${flete.destino?.nombre ?? ''}).\n\n` +
    `Ingresa al siguiente enlace para registrar tus gastos y finalizar:\n${publicUrl}\n\n` +
    `Gracias.`
  )
  return `mailto:${flete.conductor?.email ?? ''}?subject=${subject}&body=${body}`
}

function buildWaObjetar(flete, publicUrl, observacion = '') {
  return encodeURIComponent(
    `Hola ${flete.conductor?.name ?? 'conductor'} 👋\n` +
    `La rendición del flete #${flete.id} (${flete.destino?.nombre ?? ''}) fue observada:\n\n` +
    `📋 ${observacion}\n\n` +
    `Por favor corrígela en: ${publicUrl}`
  )
}

function buildEmailObjetar(flete, publicUrl, observacion = '') {
  const subject = encodeURIComponent(`Rendición observada — flete #${flete.id} ${flete.destino?.nombre ?? ''}`)
  const body = encodeURIComponent(
    `Hola ${flete.conductor?.name ?? 'conductor'},\n\n` +
    `La rendición del flete #${flete.id} fue observada:\n\n` +
    `${observacion}\n\n` +
    `Por favor corrígela en: ${publicUrl}\n\nGracias.`
  )
  return `mailto:${flete.conductor?.email ?? ''}?subject=${subject}&body=${body}`
}

/* ─── Stat card filtro ────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, active, onClick }) {
  const c = {
    blue:   'from-[#0094d9]/20 to-[#003f8c]/10 border-[#0094d9]/25 text-[#0094d9]',
    amber:  'from-amber-500/20 to-amber-800/10 border-amber-400/25 text-amber-300',
    emerald:'from-emerald-500/20 to-emerald-800/10 border-emerald-400/25 text-emerald-300',
    violet: 'from-violet-500/20 to-violet-800/10 border-violet-400/25 text-violet-300',
  }[color]
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${c} border rounded-2xl px-4 py-3 flex items-center gap-3 w-full text-left transition-all ${
        active ? 'ring-2 ring-white/20 scale-[1.02]' : 'hover:scale-[1.01] hover:brightness-110'
      }`}
    >
      <div className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5 text-current" />
      </div>
      <div>
        <p className="text-xl font-extrabold text-white leading-none">{value}</p>
        <p className="text-[10px] font-medium mt-0.5">{label}</p>
      </div>
    </button>
  )
}

/* ─── Rendicion detail ────────────────────────────────────────── */
function RendicionDetalle({ flete }) {
  const r = flete.rendicion
  if (!r) return <p className="text-xs text-slate-500 italic">Sin rendición registrada.</p>

  const gastos = r.gastos?.reduce((s, g) => s + g.monto, 0) ?? 0
  const diesel = r.diesels?.filter(d => d.metodo_pago !== 'Crédito').reduce((s, d) => s + d.monto, 0) ?? 0
  const abonos = r.abonos?.reduce((s, a) => s + a.monto, 0) ?? 0
  const viatico = r.viatico_calculado ?? r.viatico_efectivo ?? 0
  const saldo  = r.saldo_temporal ?? (abonos - gastos - diesel - viatico)
  const comision = flete.comision_total ?? 0

  return (
    <div className="space-y-3 pt-3 border-t border-white/8">
      {/* Operación tipo suma/resta con resultado final */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        {[
          { label: 'Abonos', sign: '+', n: abonos, color: 'text-emerald-300' },
          { label: 'Gastos', sign: '-', n: gastos, color: 'text-red-300' },
          { label: 'Diésel', sign: '-', n: diesel, color: 'text-orange-300' },
          { label: 'Viático', sign: '-', n: viatico, color: 'text-amber-300' },
        ].map((row, i) => (
          <div key={row.label} className={`grid grid-cols-[22px_1fr_auto] items-center px-3 py-2.5 bg-white/[0.03] ${i > 0 ? 'border-t border-white/8' : ''}`}>
            <span className={`text-sm font-bold ${row.color}`}>{row.sign}</span>
            <span className="text-xs text-slate-300">{row.label}</span>
            <span className={`text-xs font-mono font-bold ${row.color}`}>{fmt(row.n)}</span>
          </div>
        ))}
        <div className="grid grid-cols-[22px_1fr_auto] items-center px-3 py-2.5 border-t border-white/15 bg-white/[0.06]">
          <span className="text-sm font-bold text-slate-200">=</span>
          <span className="text-xs font-extrabold text-white uppercase tracking-wide">Saldo</span>
          <span className={`text-sm font-extrabold font-mono ${saldo >= 0 ? 'text-emerald-300' : 'text-red-400'}`}>
            {saldo < 0 ? '-' : ''}{fmt(Math.abs(saldo))}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        <div className="bg-white/[0.04] rounded-xl px-2.5 py-2 text-center">
          <p className="text-[8px] font-semibold text-slate-500 uppercase tracking-wide">Comisión</p>
          <p className="text-xs text-violet-300 font-bold mt-0.5">{fmt(comision)}</p>
        </div>
        <div className="bg-white/[0.04] rounded-xl px-2.5 py-2 text-center">
          <p className="text-[8px] font-semibold text-slate-500 uppercase tracking-wide">Saldo + Comisión</p>
          <p className={`text-xs font-bold mt-0.5 ${(saldo + comision) >= 0 ? 'text-emerald-300' : 'text-red-400'}`}>
            {(saldo + comision) < 0 ? '-' : ''}{fmt(Math.abs(saldo + comision))}
          </p>
        </div>
      </div>

      {/* Líneas de gastos */}
      {r.gastos?.length > 0 && (
        <div className="space-y-0.5">
          <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">Gastos</p>
          {r.gastos.map((g, i) => (
            <div key={i} className="flex justify-between text-[10px]">
              <span className="text-slate-400">{g.tipo}{g.descripcion ? ` — ${g.descripcion}` : ''}</span>
              <span className="text-red-300 font-mono">{fmt(g.monto)}</span>
            </div>
          ))}
        </div>
      )}
      {r.diesels?.length > 0 && (
        <div className="space-y-0.5">
          <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">Diésel</p>
          {r.diesels.map((d, i) => (
            <div key={i} className="flex justify-between text-[10px]">
              <span className="text-slate-400">{d.litros ? `${d.litros}L` : ''} {d.metodo_pago}</span>
              <span className="text-orange-300 font-mono">{fmt(d.monto)}</span>
            </div>
          ))}
        </div>
      )}
      {r.abonos?.length > 0 && (
        <div className="space-y-0.5">
          <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">Abonos</p>
          {r.abonos.map((a, i) => (
            <div key={i} className="flex justify-between text-[10px]">
              <span className="text-slate-400">{a.metodo}</span>
              <span className="text-emerald-300 font-mono">{fmt(a.monto)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Observación previa */}
      {r.observaciones && (
        <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg px-3 py-2">
          <p className="text-[9px] font-semibold text-amber-400 uppercase tracking-wide mb-0.5">Observación anterior</p>
          <p className="text-xs text-amber-200">{r.observaciones}</p>
        </div>
      )}
    </div>
  )
}

/* ─── Modal objetar ───────────────────────────────────────────── */
function ObjetarModal({ flete, publicUrl, onConfirm, onClose, loading }) {
  const [obs, setObs] = useState('')
  const phone  = flete.conductor_phone?.replace(/\D/g, '') ?? ''
  const url    = publicUrl ?? `${window.location.origin}/conductor/servicios`
  const waHref = phone
    ? `https://wa.me/56${phone}?text=${buildWaObjetar(flete, url, obs)}`
    : null
  const emailHref = buildEmailObjetar(flete, url, obs)

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0a1628] border border-white/15 rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-red-400 uppercase tracking-widest mb-1">Objetar rendición</p>
            <h3 className="text-base font-bold text-white">
              Flete #{flete.id} — {flete.destino?.nombre ?? ''}
            </h3>
            <p className="text-xs text-slate-400">{flete.conductor?.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
            Observación (se enviará al conductor)
          </label>
          <textarea
            autoFocus
            value={obs}
            onChange={e => setObs(e.target.value)}
            rows={3}
            placeholder="Ej: Faltan comprobantes de gastos, el monto de diesel no coincide…"
            className="w-full bg-white/[0.05] border border-white/10 rounded-lg text-sm text-white px-3 py-2 focus:outline-none focus:border-amber-400/40 placeholder-slate-600 resize-none"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onConfirm(flete.id, obs)}
            disabled={!obs.trim() || loading}
            className="flex-1 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/25 text-amber-300 text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Devolviendo…' : 'Devolver para corrección'}
          </button>
        </div>

        {obs.trim() && (
          <div className="flex gap-2 pt-1 border-t border-white/8">
            <p className="text-[10px] text-slate-500 flex items-center gap-1 mr-auto">Notificar conductor:</p>
            {waHref && (
              <a href={waHref} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-green-500/15 text-green-300 border border-green-400/20 hover:bg-green-500/25 transition-colors">
                <ChatBubbleLeftRightIcon className="w-3 h-3" />WhatsApp
              </a>
            )}
            <a href={emailHref}
              className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-colors">
              <EnvelopeIcon className="w-3 h-3" />Email
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function DateFilter({ desde, hasta, onChange }) {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState({
    from: desde ? new Date(desde) : undefined,
    to: hasta ? new Date(hasta) : undefined,
  })

  useEffect(() => {
    setRange({
      from: desde ? new Date(desde) : undefined,
      to: hasta ? new Date(hasta) : undefined,
    })
  }, [desde, hasta])

  const apply = () => {
    const addDay = d => {
      const x = new Date(d)
      x.setDate(x.getDate() + 1)
      return x.toISOString().slice(0, 10)
    }
    onChange({
      desde: range.from ? addDay(range.from) : null,
      hasta: range.to ? addDay(range.to) : null,
    })
    setOpen(false)
  }

  const clear = () => {
    setRange({ from: undefined, to: undefined })
    onChange({ desde: null, hasta: null })
    setOpen(false)
  }

  const hasDate = !!desde || !!hasta
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className={`bg-white/5 border rounded-lg text-xs px-3 py-1.5 focus:outline-none transition-colors ${
          hasDate
            ? 'border-[#0094d9]/35 text-[#38bdf8]'
            : 'border-white/10 text-slate-300 hover:border-white/20'
        }`}
      >
        Fecha
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-[#0a1628]/95 backdrop-blur border border-white/10 rounded-xl shadow-xl p-3">
          <DayPicker
            className="scar-date-picker"
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={1}
            style={{
              '--rdp-accent-color': '#0ea5e9',
              '--rdp-background-color': 'rgba(14,165,233,0.25)',
              '--rdp-day_button-color': '#cbd5e1',
              '--rdp-today-color': '#67e8f9',
              '--rdp-nav_button-color': '#cbd5e1',
              '--rdp-nav_button-disabled-color': '#475569',
              '--rdp-range_middle-background-color': 'rgba(14,165,233,0.22)',
              '--rdp-range_middle-color': '#e2e8f0',
            }}
          />
          <div className="flex justify-between mt-2 pt-2 border-t border-white/10">
            <button onClick={clear} className="text-[10px] text-slate-500 hover:text-red-400 transition-colors">Limpiar</button>
            <button onClick={apply} className="text-[10px] text-[#0094d9] font-semibold hover:text-white transition-colors">Aplicar</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Flete card ──────────────────────────────────────────────── */
function FleteRendicionCard({ flete: initFlete, selected, onSelect, onSolicitar, onAprobar, onPagado, onObjetar, loading }) {
  const [flete, setFlete] = useState(initFlete)
  const [expanded, setExpanded] = useState(false)
  const [publicUrl, setPublicUrl]   = useState(
    initFlete.public_token ? `${window.location.origin}/r/${initFlete.public_token}` : null
  )
  const [generatingUrl, setGeneratingUrl] = useState(false)

  const status = STATUS[flete.estado] ?? STATUS['En curso']
  const isSinRendir = flete.estado === 'En curso'
  const isRendido   = flete.estado === 'Rendido'
  const isAprobado  = flete.estado === 'Aprobado'
  const yaSolicitado = !!flete.rendicion_solicitada_at
  const phone  = flete.conductor_phone?.replace(/\D/g, '') ?? ''

  const getPublicUrl = async () => {
    if (publicUrl) return publicUrl
    setGeneratingUrl(true)
    try {
      const res = await axios.post(`/fletes/${flete.id}/generar-token`)
      const url = res.data.url
      setPublicUrl(url)
      setFlete(p => ({ ...p, public_token: res.data.token }))
      return url
    } finally {
      setGeneratingUrl(false)
    }
  }

  const handleWA = async () => {
    const url = await getPublicUrl()
    const msg = buildWaRendicion(flete, url)
    const href = phone ? `https://wa.me/56${phone}?text=${msg}` : `https://wa.me/?text=${msg}`
    window.open(href, '_blank')
  }

  const handleEmail = async () => {
    const url = await getPublicUrl()
    window.location.href = buildEmailRendicion(flete, url)
  }

  const emailHref = null // dynamic via handleEmail

  return (
    <div className={`bg-white/[0.03] border rounded-2xl overflow-hidden transition-colors ${
      selected ? 'border-[#0094d9]/40 bg-[#0094d9]/[0.04]' : 'border-white/10 hover:border-white/15'
    }`}>
      <div className="p-4 pb-3">
        {/* Top row: checkbox + id/estado + fechas */}
        <div className="flex items-start gap-2">
          {/* Checkbox */}
          {isRendido && (
            <button
              onClick={() => onSelect(flete.id)}
              className={`mt-1 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                selected ? 'bg-[#0094d9] border-[#0094d9]' : 'border-white/20 hover:border-white/40'
              }`}
            >
              {selected && <span className="text-white text-[8px] font-bold">✓</span>}
            </button>
          )}

          <div className="flex-1 min-w-0 overflow-hidden">
            {/* ID + estado + solicitud */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-[10px] font-bold text-slate-500 font-mono shrink-0">#{flete.id}</span>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${status.color}`}>
                {status.label}
              </span>
              {yaSolicitado && isSinRendir && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full border bg-orange-500/10 text-orange-300 border-orange-400/25 shrink-0">
                  Solicitado
                </span>
              )}
              {flete.rendicion?.observaciones && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full border bg-red-500/10 text-red-300 border-red-400/25 shrink-0">
                  Observado
                </span>
              )}
            </div>

            {/* Destino + cliente */}
            <p className="text-sm font-bold text-white truncate leading-tight">{flete.destino?.nombre ?? '—'}</p>
            <p className="text-[11px] text-slate-400 truncate">{flete.cliente_principal?.razon_social ?? '—'}</p>
          </div>

          {/* Fechas */}
          <div className="text-right shrink-0 text-[10px] ml-1">
            <p className="text-slate-500 leading-none">Salida</p>
            <p className="font-semibold text-slate-300 leading-tight">{fmtDate(flete.fecha_salida)}</p>
            {flete.fecha_llegada && (
              <>
                <p className="text-slate-500 mt-1 leading-none">Llegada</p>
                <p className="font-semibold text-slate-300 leading-tight">{fmtDate(flete.fecha_llegada)}</p>
              </>
            )}
          </div>
        </div>

        {/* Info row: conductor, tracto, rampla, guía, KM */}
        <div className="flex flex-wrap gap-1.5 mt-3 text-[10px] items-center">
          <span className="flex items-center gap-1 text-slate-400 max-w-[140px] truncate">
            <TruckIcon className="w-3 h-3 text-[#0094d9] shrink-0" />
            <span className="truncate">{flete.conductor?.name ?? '—'}</span>
          </span>
          {flete.tracto?.patente && (
            <span className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-slate-400 font-mono">{flete.tracto.patente}</span>
          )}
          {flete.rampla?.patente && (
            <span className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-slate-400 font-mono">{flete.rampla.patente}</span>
          )}
          {flete.guiaruta && (
            <span className="text-slate-500">GR: {flete.guiaruta}</span>
          )}
          {flete.kilometraje && (
            <span className="text-slate-500">KM: {Number(flete.kilometraje).toLocaleString('es-CL')}</span>
          )}
          {flete.comision_total > 0 && (
            <span className="text-violet-300 font-semibold">Comisión: {fmt(flete.comision_total)}</span>
          )}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(p => !p)}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 mt-3 transition-colors"
        >
          <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Ocultar detalle' : 'Ver rendición completa'}
        </button>
      </div>

      {/* Rendicion detail */}
      {expanded && (
        <div className="px-4 pb-4">
          <RendicionDetalle flete={flete} />
        </div>
      )}

      {/* Actions footer */}
      <div className="px-4 py-3 border-t border-white/5 flex items-center gap-2 flex-wrap bg-white/[0.015]">

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
            <button
              onClick={handleWA}
              disabled={generatingUrl}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-500/15 hover:bg-green-500/25 text-green-300 border border-green-400/20 transition-colors disabled:opacity-40"
            >
              <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
              {generatingUrl ? '…' : 'WhatsApp'}
            </button>
            <button
              onClick={handleEmail}
              disabled={generatingUrl}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors disabled:opacity-40"
            >
              <EnvelopeIcon className="w-3.5 h-3.5" />Email
            </button>
          </>
        )}

        {isRendido && (
          <>
            <button
              onClick={() => onAprobar(flete.id)}
              disabled={loading === flete.id}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/25 transition-colors disabled:opacity-50"
            >
              <CheckCircleIcon className="w-3.5 h-3.5" />
              {loading === flete.id ? 'Aprobando…' : 'Aprobar'}
            </button>
            <button
              onClick={() => onObjetar({ flete, publicUrl })}
              disabled={loading === flete.id}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-400/20 transition-colors disabled:opacity-50"
            >
              <ExclamationCircleIcon className="w-3.5 h-3.5" />
              Objetar
            </button>
          </>
        )}

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

        {flete.estado === 'Pagado' && (
          <span className="text-xs text-violet-400 font-medium flex items-center gap-1">
            <BanknotesIcon className="w-3.5 h-3.5" />Pagado ✓
          </span>
        )}
      </div>
    </div>
  )
}

/* ─── Main page ───────────────────────────────────────────────── */
export default function SuperRendicionesIndex() {
  const { props } = usePage()
  const { fletes, stats, filtros: initFiltros, conductores } = props

  const [filtros, setFiltros]   = useState(initFiltros ?? {})
  const [loading, setLoading]   = useState(null)
  const [batchLoading, setBatchLoading] = useState(false)
  const [toast, setToast]       = useState(null)
  const [fletesData, setFletes] = useState(fletes)
  const [selected, setSelected] = useState([])          // ids seleccionados
  const [objetarFlete, setObjetarFlete] = useState(null)// flete para modal objetar
  const [search, setSearch]     = useState('')

  // Mantener estado local alineado con los props de Inertia (igual patrón que Fletes)
  useEffect(() => {
    setFiltros(initFiltros ?? {})
  }, [initFiltros])

  useEffect(() => {
    setFletes(fletes)
  }, [fletes])

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Filtros ───────────────────────────────────────────────────
  const handleFiltro = (key, val) => {
    const next = { ...filtros, [key]: val || null }
    setFiltros(next)
    // clean null values for URL
    const params = Object.fromEntries(Object.entries(next).filter(([, v]) => v != null))
    router.get(route('super.rendiciones.index'), params, { preserveState: true, replace: true })
  }

  // ── Data helpers ──────────────────────────────────────────────
  const lista = useMemo(() => {
    const data = fletesData?.data ?? []
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter(f =>
      f.destino?.nombre?.toLowerCase().includes(q) ||
      f.cliente_principal?.razon_social?.toLowerCase().includes(q) ||
      f.conductor?.name?.toLowerCase().includes(q) ||
      String(f.id).includes(q)
    )
  }, [fletesData, search])

  const rendidos = useMemo(() => lista.filter(f => f.estado === 'Rendido'), [lista])
  const allRendidosSelected = rendidos.length > 0 && rendidos.every(f => selected.includes(f.id))

  // ── Actions ───────────────────────────────────────────────────
  const doPost = async (url, fleteId, successMsg) => {
    setLoading(fleteId)
    try {
      const res = await axios.post(url)
      showToast(successMsg)
      setFletes(prev => ({
        ...prev,
        data: prev.data.map(f => f.id === fleteId ? { ...f, ...res.data.flete } : f),
      }))
      setSelected(prev => prev.filter(id => id !== fleteId))
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al procesar.', 'err')
    } finally { setLoading(null) }
  }

  const handleSolicitar = (id) =>
    doPost(route('super.rendiciones.solicitar', id), id, 'Rendición solicitada al conductor.')

  const handleAprobar = (id) =>
    doPost(route('super.rendiciones.aprobar', id), id, 'Rendición aprobada.')

  const handlePagado = (id) =>
    doPost(route('super.rendiciones.pagado', id), id, 'Flete marcado como pagado.')

  const handleObjetar = async (fleteId, observacion) => {
    setLoading(fleteId)
    try {
      const res = await axios.post(route('super.rendiciones.objetar', fleteId), { observacion })
      showToast('Rendición devuelta al conductor para corrección.')
      setFletes(prev => ({
        ...prev,
        data: prev.data.map(f => f.id === fleteId ? { ...f, ...res.data.flete } : f),
      }))
      setObjetarFlete(null)
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al objetar.', 'err')
    } finally { setLoading(null) }
  }

  const handleAprobarBatch = async () => {
    if (selected.length === 0) return
    setBatchLoading(true)
    try {
      const res = await axios.post(route('super.rendiciones.batch.aprobar'), { ids: selected })
      showToast(`${res.data.aprobados} rendición(es) aprobada(s).`)
      // Reload for fresh data
      router.reload({ only: ['fletes', 'stats'] })
      setSelected([])
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al aprobar en batch.', 'err')
    } finally { setBatchLoading(false) }
  }

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const toggleAllRendidos = () => {
    if (allRendidosSelected) {
      setSelected(prev => prev.filter(id => !rendidos.map(f => f.id).includes(id)))
    } else {
      setSelected(prev => [...new Set([...prev, ...rendidos.map(f => f.id)])])
    }
  }

  return (
    <AuthenticatedLayout>
      <Head title="Panel de Rendiciones" />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-5">

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
            <DocumentCheckIcon className="w-3.5 h-3.5" />Superadmin
          </p>
          <h1 className="text-2xl font-extrabold text-white">Panel de Rendiciones</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Gestiona los gastos rendidos por conductores — solicita, aprueba y paga.
          </p>
        </div>

        {/* Stats — filtros clickeables */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <StatCard icon={ExclamationTriangleIcon} label="Sin rendir"  value={stats.sin_rendir}  color="amber"
            active={filtros.estado === 'En curso'}
            onClick={() => handleFiltro('estado', filtros.estado === 'En curso' ? null : 'En curso')} />
          <StatCard icon={DocumentCheckIcon}       label="Rendidos"    value={stats.rendidos}    color="blue"
            active={filtros.estado === 'Rendido'}
            onClick={() => handleFiltro('estado', filtros.estado === 'Rendido' ? null : 'Rendido')} />
          <StatCard icon={CheckCircleIcon}         label="Aprobados"   value={stats.aprobados}   color="emerald"
            active={filtros.estado === 'Aprobado'}
            onClick={() => handleFiltro('estado', filtros.estado === 'Aprobado' ? null : 'Aprobado')} />
          <StatCard icon={BanknotesIcon}           label="Pagados"     value={stats.pagados}     color="violet"
            active={filtros.estado === 'Pagado'}
            onClick={() => handleFiltro('estado', filtros.estado === 'Pagado' ? null : 'Pagado')} />
        </div>

        {/* Filtros + búsqueda */}
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar destino, conductor…"
              className="w-full pl-8 pr-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#0094d9]/40"
            />
          </div>
          <select
            value={filtros.conductor_id ?? ''}
            onChange={e => handleFiltro('conductor_id', e.target.value || null)}
            className="bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300 px-3 py-1.5 focus:outline-none focus:border-[#0094d9]/40"
          >
            <option value="">Todos los conductores</option>
            {conductores.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <DateFilter
            desde={filtros.desde ?? null}
            hasta={filtros.hasta ?? null}
            onChange={({ desde, hasta }) => {
              const next = { ...filtros, desde, hasta }
              setFiltros(next)
              const params = Object.fromEntries(Object.entries(next).filter(([, v]) => v != null && v !== ''))
              router.get(route('super.rendiciones.index'), params, { preserveState: true, replace: true })
            }}
          />
          {(filtros.conductor_id || filtros.estado || filtros.desde || filtros.hasta || search) && (
            <button
              onClick={() => { setSearch(''); setFiltros({}); router.get(route('super.rendiciones.index'), {}, { preserveState: false }) }}
              className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <XMarkIcon className="w-3.5 h-3.5" />Limpiar
            </button>
          )}
        </div>

        {/* Batch bar — aparece cuando hay seleccionados */}
        {selected.length > 0 && (
          <div className="bg-[#0094d9]/10 border border-[#0094d9]/25 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-[#0094d9]">
              {selected.length} rendición{selected.length > 1 ? 'es' : ''} seleccionada{selected.length > 1 ? 's' : ''}
            </span>
            <button
              onClick={handleAprobarBatch}
              disabled={batchLoading}
              className="flex items-center gap-1.5 text-sm font-bold px-4 py-1.5 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-400/30 transition-colors disabled:opacity-50"
            >
              <CheckCircleIcon className="w-4 h-4" />
              {batchLoading ? 'Aprobando…' : `Aprobar ${selected.length}`}
            </button>
            <button onClick={() => setSelected([])} className="text-xs text-slate-500 hover:text-slate-300 transition-colors ml-auto">
              Cancelar selección
            </button>
          </div>
        )}

        {/* Select all rendidos */}
        {rendidos.length > 0 && !filtros.estado && (
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAllRendidos}
              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                allRendidosSelected ? 'bg-[#0094d9] border-[#0094d9]' : 'border-white/20 hover:border-white/40'
              }`}
            >
              {allRendidosSelected && <span className="text-white text-[8px] font-bold">✓</span>}
            </button>
            <span className="text-xs text-slate-500">
              {allRendidosSelected ? 'Deseleccionar' : 'Seleccionar'} todos los rendidos ({rendidos.length})
            </span>
          </div>
        )}

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
          <div className="space-y-3">
            {lista.map(flete => (
              <FleteRendicionCard
                key={flete.id}
                flete={flete}
                selected={selected.includes(flete.id)}
                onSelect={toggleSelect}
                onSolicitar={handleSolicitar}
                onAprobar={handleAprobar}
                onPagado={handlePagado}
                onObjetar={({ flete, publicUrl }) => setObjetarFlete({ flete, publicUrl })}
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

      {/* Modal objetar */}
      {objetarFlete && (
        <ObjetarModal
          flete={objetarFlete.flete}
          publicUrl={objetarFlete.publicUrl}
          onConfirm={handleObjetar}
          onClose={() => setObjetarFlete(null)}
          loading={loading === objetarFlete.flete.id}
        />
      )}
    </AuthenticatedLayout>
  )
}
