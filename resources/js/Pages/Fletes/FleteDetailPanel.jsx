// resources/js/Pages/Fletes/FleteDetailPanel.jsx — rediseño minimalista
import React, { useState, useMemo, useCallback } from 'react'
import axios from 'axios'
import {
  PlusIcon, XMarkIcon, CheckCircleIcon, TrashIcon,
  ArrowPathIcon, ChevronDownIcon,
} from '@heroicons/react/24/outline'

/* ─── helpers ─────────────────────────────────────────────────── */
const fmt = n => `$${Math.round(Math.abs(n ?? 0)).toLocaleString('es-CL')}`
const fmtDate = d => d
  ? new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' })
  : '—'

/* ─── Saldo bar ────────────────────────────────────────────────── */
function SaldoBar({ flete }) {
  const r = flete.rendicion
  if (!r) return null

  const abonos  = r.abonos?.reduce((s, a) => s + a.monto, 0) ?? 0
  const gastos  = r.total_gastos  ?? r.gastos?.reduce((s, g) => s + g.monto, 0) ?? 0
  const diesel  = r.total_diesel  ?? r.diesels?.filter(d => d.metodo_pago !== 'Crédito').reduce((s, d) => s + d.monto, 0) ?? 0
  const viatico = r.viatico_calculado ?? 0
  const saldo    = r.saldo_temporal ?? (abonos - gastos - diesel - viatico)
  // Comisión = tarifa (destino+cliente) + retorno. Solo de lectura, no editable.
  const comision = flete.comision_total ?? 0

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
      {[
        { label: 'Abonos',  n: abonos,    color: 'text-emerald-300' },
        { label: 'Gastos',  n: -gastos,   color: 'text-red-300' },
        { label: 'Diésel',  n: -diesel,   color: 'text-orange-300' },
        { label: 'Viático', n: -viatico,  color: 'text-amber-300' },
        {
          label: 'Saldo',
          n: saldo,
          color: saldo >= 0 ? 'text-emerald-300' : 'text-red-400',
          bold: true,
          border: true,
        },
        { label: 'Comisión', n: comision, color: 'text-violet-300' },
      ].map(({ label, n, color, bold, border }) => (
        <div key={label} className={`bg-white/[0.04] rounded-xl px-3 py-2 text-center ${border ? 'border border-white/15' : ''}`}>
          <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
          <p className={`text-sm ${color} ${bold ? 'font-extrabold' : 'font-bold'} mt-0.5`}>
            {n < 0 ? '-' : ''}{fmt(n)}
          </p>
        </div>
      ))}
    </div>
  )
}

function OperacionResumen({ flete, isConductor }) {
  const r = flete.rendicion
  if (!r) return null

  const comision = flete.comision_total ?? 0
  const adicionales = isConductor ? 0 : (r.adicionales?.reduce((s, a) => s + (a.monto ?? 0), 0) ?? 0)
  const abonos  = r.abonos?.reduce((s, a) => s + (a.monto ?? 0), 0) ?? 0
  const gastos  = r.total_gastos ?? (r.gastos?.reduce((s, g) => s + (g.monto ?? 0), 0) ?? 0)
  const diesel  = r.total_diesel ?? (r.diesels?.filter(d => d.metodo_pago !== 'Crédito').reduce((s, d) => s + (d.monto ?? 0), 0) ?? 0)
  const viatico = r.viatico_calculado ?? 0

  const rows = [
    { label: 'Comisión',  sign: '+', n: comision,   color: 'text-violet-300' },
    ...(isConductor ? [] : [{ label: 'Adicionales', sign: '-', n: adicionales, color: 'text-blue-300' }]),
    { label: 'Abonos',    sign: '+', n: abonos,     color: 'text-emerald-300' },
    { label: 'Gastos',    sign: '-', n: gastos,     color: 'text-red-300' },
    { label: 'Diésel',    sign: '-', n: diesel,     color: 'text-orange-300' },
    { label: 'Viático',   sign: '-', n: viatico,    color: 'text-amber-300' },
  ]

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      {rows.map((row, i) => (
        <div key={row.label} className={`grid grid-cols-[20px_1fr_auto] items-center px-3 py-2 bg-white/[0.03] ${i > 0 ? 'border-t border-white/8' : ''}`}>
          <span className={`text-sm font-bold ${row.color}`}>{row.sign}</span>
          <span className="text-xs text-slate-300">{row.label}</span>
          <span className={`text-xs font-mono font-bold ${row.color}`}>{fmt(row.n)}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Record row ────────────────────────────────────────────────── */
const TYPE_META = {
  abono:    { label: 'Abono',   color: 'text-emerald-300', dot: 'bg-emerald-400', url: r => `/abonos/${r.id}` },
  diesel:   { label: 'Diésel',  color: 'text-orange-300',  dot: 'bg-orange-400',  url: r => `/diesels/${r.id}` },
  gasto:    { label: 'Gasto',   color: 'text-red-300',     dot: 'bg-red-400',     url: r => `/gastos/${r.id}` },
  retorno:  { label: 'Retorno', color: 'text-yellow-300',  dot: 'bg-yellow-400',  url: r => `/retornos/${r.id}` },
  adicional:{ label: 'Adicional',color:'text-blue-300',    dot: 'bg-blue-400',    url: r => `/adicionales/${r.id}` },
}

function classifyRecord(r) {
  if ('litros' in r) return 'diesel'
  if ('metodo' in r && !('tipo' in r)) return 'abono'
  if (r.tipo === 'Adicional') return 'adicional'
  if (r.metodo === 'Retorno') return 'retorno'
  return 'gasto'
}

function RecordItem({ r, onDelete, deleting }) {
  const kind = classifyRecord(r)
  const meta = TYPE_META[kind]
  const detail = r.descripcion || r.tipo || r.metodo || r.metodo_pago || ''
  const sign = ['abono'].includes(kind) ? '+' : '-'

  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0 group">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />
      <span className={`text-[11px] font-semibold shrink-0 w-16 ${meta.color}`}>{meta.label}</span>
      <span className="text-xs text-slate-400 flex-1 truncate">{detail}</span>
      <span className={`text-xs font-bold shrink-0 ${sign === '+' ? 'text-emerald-300' : 'text-red-300'}`}>
        {sign}{fmt(r.monto ?? r.valor)}
      </span>
      <button
        onClick={() => onDelete(r, kind)}
        disabled={deleting}
        className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all ml-1 shrink-0"
      >
        <TrashIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

/* ─── Inline form section ───────────────────────────────────────── */
const INPUT = 'bg-white/[0.05] border border-white/10 rounded-lg text-xs text-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-[#0094d9]/50 placeholder-slate-600 w-full'
const SEL   = `${INPUT} cursor-pointer`
const BTN_SM = 'flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors'

const GASTO_TIPOS = ['Carga', 'Descarga', 'Camioneta', 'Estacionamiento', 'Peaje', 'Otros']

function AddForm({ type, flete, onAdded, onCancel, isFinalizar }) {
  const rid = flete.rendicion?.id
  const fid = flete.id
  const [saving, setSaving] = useState(false)
  const [err, setErr]       = useState(null)

  /* ── Gasto ── */
  const [gTipo, setGTipo]     = useState('')
  const [gMonto, setGMonto]   = useState('')
  const [gDesc, setGDesc]     = useState('')

  /* ── Diesel ── */
  const [dLitros, setDLitros]   = useState('')
  const [dMetodo, setDMetodo]   = useState('Efectivo')
  const [dMonto, setDMonto]     = useState('')

  /* ── Abono ── */
  const [aMetodo, setAMetodo] = useState('Transferencia')
  const [aMonto, setAMonto]   = useState('')

  /* ── Retorno ── */
  const [rMonto, setRMonto] = useState('')

  /* ── Comisión ── */
  const [cMonto, setCMonto] = useState(flete.rendicion?.comision ?? '')

  /* ── Viático / Finalizar ── */
  const [vMonto, setVMonto]   = useState('')
  const [kmLlegada, setKmLlegada] = useState(flete.kilometraje ?? '')
  const [fFecha, setFFecha]   = useState(
    flete.fecha_llegada
      ? new Date(flete.fecha_llegada).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  )

  const post = async (url, payload) => {
    setSaving(true); setErr(null)
    try {
      const res = await axios.post(url, payload)
      onAdded(res.data?.flete, type === 'finalizar')
    } catch (e) {
      setErr(e.response?.data?.message ?? 'Error al guardar.')
    } finally { setSaving(false) }
  }

  const submit = async () => {
    if (type === 'gasto') {
      if (!gTipo || !gMonto) return setErr('Tipo y monto son obligatorios.')
      await post('/gastos', { flete_id: fid, rendicion_id: rid, tipo: gTipo, monto: Number(gMonto), descripcion: gDesc })
    }
    if (type === 'diesel') {
      if (!dMonto) return setErr('El monto es obligatorio.')
      await post('/diesel', { flete_id: fid, rendicion_id: rid, litros: Number(dLitros) || 0, metodo_pago: dMetodo, monto: Number(dMonto) })
    }
    if (type === 'abono') {
      if (!aMonto) return setErr('El monto es obligatorio.')
      await post('/abonos', { flete_id: fid, rendicion_id: rid, tipo: aMetodo, monto: Number(aMonto) })
    }
    if (type === 'retorno') {
      if (!rMonto) return setErr('El monto es obligatorio.')
      await post('/retornos', { flete_id: fid, monto: Number(rMonto) })
    }
    if (type === 'comision') {
      await post('/comisiones', { flete_id: fid, rendicion_id: rid, monto: Number(cMonto) || 0 })
    }
    if (type === 'finalizar') {
      await post(`/fletes/${fid}/finalizar`, {
        flete_id: fid,
        rendicion_id: rid,
        fecha_termino: fFecha,
        viatico_efectivo: vMonto === '' ? null : Number(vMonto),
      })
    }
    if (type === 'km') {
      if (!kmLlegada) return setErr('KM de llegada es obligatorio.')
      await post(`/fletes/${fid}/kilometraje`, { kilometraje: Number(kmLlegada) })
    }
  }

  return (
    <div className="bg-white/[0.02] border border-white/8 rounded-xl p-3 space-y-2.5">
      {err && <p className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">{err}</p>}

      {type === 'gasto' && (
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4">
            <select value={gTipo} onChange={e => setGTipo(e.target.value)} className={SEL}>
              <option value="">Tipo *</option>
              {GASTO_TIPOS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-span-4">
            <input value={gDesc} onChange={e => setGDesc(e.target.value)} placeholder="Descripción" className={INPUT} />
          </div>
          <div className="col-span-4">
            <input type="number" value={gMonto} onChange={e => setGMonto(e.target.value)} placeholder="Monto $*" className={INPUT} />
          </div>
        </div>
      )}

      {type === 'diesel' && (
        <div className="grid grid-cols-3 gap-2">
          <input type="number" value={dLitros} onChange={e => setDLitros(e.target.value)} placeholder="Litros" className={INPUT} />
          <select value={dMetodo} onChange={e => setDMetodo(e.target.value)} className={SEL}>
            {['Efectivo','Transferencia','Crédito'].map(m => <option key={m}>{m}</option>)}
          </select>
          <input type="number" value={dMonto} onChange={e => setDMonto(e.target.value)} placeholder="Monto $*" className={INPUT} />
        </div>
      )}

      {type === 'abono' && (
        <div className="grid grid-cols-2 gap-2">
          <select value={aMetodo} onChange={e => setAMetodo(e.target.value)} className={SEL}>
            {['Efectivo','Transferencia','Cheque'].map(m => <option key={m}>{m}</option>)}
          </select>
          <input type="number" value={aMonto} onChange={e => setAMonto(e.target.value)} placeholder="Monto $*" className={INPUT} />
        </div>
      )}

      {type === 'retorno' && (
        <input type="number" value={rMonto} onChange={e => setRMonto(e.target.value)} placeholder="Valor retorno $" className={INPUT} />
      )}

      {type === 'comision' && (
        <input type="number" value={cMonto} onChange={e => setCMonto(e.target.value)} placeholder="Comisión manual $" className={INPUT} />
      )}

      {type === 'km' && (
        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 font-medium block">KM de llegada *</label>
          <input type="number" value={kmLlegada} onChange={e => setKmLlegada(e.target.value)} placeholder="Ej: 284500" className={INPUT} />
        </div>
      )}

      {type === 'finalizar' && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-500 font-medium block mb-1">Fecha cierre</label>
              <input type="date" value={fFecha} onChange={e => setFFecha(e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-medium block mb-1">Viático efectivo ($)</label>
              <input type="number" value={vMonto} onChange={e => setVMonto(e.target.value)} placeholder="0" className={INPUT} />
            </div>
          </div>
          <p className="text-[10px] text-slate-600 italic">Al finalizar, el flete pasará a estado «Rendido» para revisión del administrador.</p>
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className={`${BTN_SM} text-slate-500 hover:text-slate-300`}>
          Cancelar
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className={`${BTN_SM} ${
            type === 'finalizar'
              ? 'bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-400/25'
              : 'bg-[#0094d9]/20 hover:bg-[#0094d9]/35 text-[#0094d9] border border-[#0094d9]/25'
          }`}
        >
          {saving ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> : <CheckCircleIcon className="w-3.5 h-3.5" />}
          {saving ? 'Guardando…' : type === 'finalizar' ? 'Finalizar rendición' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}

/* ─── Add tab strip ────────────────────────────────────────────── */
// Comisión = tarifa + retorno (automático) — no se ingresa manualmente
const ADD_TYPES_ADMIN = [
  { key: 'gasto',   label: 'Gasto',  color: 'hover:text-red-300' },
  { key: 'diesel',  label: 'Diésel', color: 'hover:text-orange-300' },
  { key: 'abono',   label: 'Abono',  color: 'hover:text-emerald-300' },
  { key: 'retorno', label: 'Retorno',color: 'hover:text-yellow-300' },
  { key: 'km',      label: 'KM llegada', color: 'hover:text-cyan-300' },
]
const ADD_TYPES_CONDUCTOR = [
  { key: 'gasto',   label: 'Gasto',  color: 'hover:text-red-300' },
  { key: 'diesel',  label: 'Diésel', color: 'hover:text-orange-300' },
  { key: 'abono',   label: 'Abono',  color: 'hover:text-emerald-300' },
  { key: 'retorno', label: 'Retorno',color: 'hover:text-yellow-300' },
  { key: 'km',      label: 'KM llegada', color: 'hover:text-cyan-300' },
]

/* ─── Modal KM ──────────────────────────────────────────────────── */
function KmModal({ fleteId, onDone, onSkip }) {
  const [km, setKm]     = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!km) return onDone()
    setSaving(true)
    try {
      await axios.post(`/fletes/${fleteId}/kilometraje`, { kilometraje: Number(km) })
    } catch(e) { console.error(e) }
    finally { setSaving(false); onDone() }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onSkip} />
      <div className="relative bg-[#0a1628] border border-white/15 rounded-2xl shadow-2xl p-6 w-full max-w-xs space-y-4">
        <div>
          <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest mb-1">Opcional</p>
          <h3 className="text-base font-bold text-white">Kilometraje de llegada</h3>
          <p className="text-xs text-slate-400 mt-0.5">Registra el KM del vehículo al finalizar el viaje.</p>
        </div>
        <input
          type="number"
          autoFocus
          value={km}
          onChange={e => setKm(e.target.value)}
          placeholder="Ej: 284500"
          className="w-full bg-white/[0.05] border border-white/10 rounded-lg text-sm text-white px-3 py-2.5 focus:outline-none focus:border-[#0094d9]/50"
        />
        <div className="flex gap-2">
          <button onClick={onSkip} className="flex-1 py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            Omitir
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/25 text-emerald-300 text-xs font-bold transition-colors"
          >
            {saving ? 'Guardando…' : 'Guardar KM'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main panel ────────────────────────────────────────────────── */
export default function FleteDetailPanel({ flete, actualizarFleteEnLista, userRoles }) {
  const [localFlete, setLocalFlete] = useState(flete)
  const [openAdd, setOpenAdd]       = useState(null)   // key of form open
  const [deleting, setDeleting]     = useState(false)
  const [showFinalizar, setShowFinalizar] = useState(false)
  const [showKm, setShowKm]         = useState(false)

  // Sync when parent sends new flete
  React.useEffect(() => setLocalFlete(flete), [flete])

  const update = useCallback((f, fromFinalizar = false) => {
    if (!f) return
    setLocalFlete(f)
    actualizarFleteEnLista(f)
    setOpenAdd(null)
    if (fromFinalizar) {
      setShowFinalizar(false)
      setShowKm(true)   // mostrar modal KM después de finalizar
    } else {
      setShowFinalizar(false)
    }
  }, [actualizarFleteEnLista])

  const isConductor = userRoles?.includes('conductor')
  const addTypes    = isConductor ? ADD_TYPES_CONDUCTOR : ADD_TYPES_ADMIN

  // Compile all records sorted by date desc
  const records = useMemo(() => {
    const r = localFlete.rendicion
    if (!r) return []
    const list = [
      ...(r.abonos     || []).map(x => ({ ...x, _kind: 'abono' })),
      ...(r.diesels    || []).map(x => ({ ...x, _kind: 'diesel' })),
      ...(r.gastos     || []).map(x => ({ ...x, _kind: 'gasto' })),
      // adicionales: solo para admin/superadmin
      ...(isConductor ? [] : (r.adicionales || []).map(x => ({ ...x, _kind: 'adicional' }))),
    ]
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [localFlete.rendicion, isConductor])

  const handleDelete = async (record) => {
    if (!confirm('¿Eliminar este registro?')) return
    setDeleting(true)
    try {
      const kind = record._kind ?? classifyRecord(record)
      const urlMap = {
        diesel:    `/diesels/${record.id}`,
        abono:     `/abonos/${record.id}`,
        gasto:     `/gastos/${record.id}`,
        adicional: `/adicionales/${record.id}`,
        retorno:   `/retornos/${record.id}`,
      }
      await axios.delete(urlMap[kind] ?? `/gastos/${record.id}`)
      const res = await axios.get(`/fletes/${localFlete.id}`)
      if (res.data?.flete) update(res.data.flete)
    } catch (e) { console.error(e) }
    finally { setDeleting(false) }
  }

  const canFinalizar = localFlete.estado === 'En curso' && !!localFlete.rendicion
  const isRendido    = ['Rendido','Aprobado','Pagado'].includes(localFlete.estado)

  // ── Validación pre-finalizar ──────────────────────────────────
  const camposFaltantes = useMemo(() => {
    const falta = []
    if (!localFlete.destino_id)          falta.push('Destino')
    if (!localFlete.cliente_principal_id) falta.push('Cliente')
    if (!localFlete.tracto_id)           falta.push('Tracto')
    if (!localFlete.rampla_id)           falta.push('Rampla')
    if (!localFlete.guiaruta)            falta.push('Guía de ruta')
    if (!localFlete.fecha_salida)        falta.push('Fecha salida')
    if (!localFlete.fecha_llegada)       falta.push('Fecha llegada')
    if (!localFlete.kilometraje)         falta.push('KM llegada')
    return falta
  }, [localFlete])

  const puedeFinalizarCompleto = camposFaltantes.length === 0

  return (
    <div className="px-4 py-4 max-w-4xl space-y-4">

      {/* ── Saldo bar ──────────────────────────────────────── */}
      <SaldoBar flete={localFlete} />
      <OperacionResumen flete={localFlete} isConductor={isConductor} />

      {/* ── Records ────────────────────────────────────────── */}
      {records.length > 0 && (
        <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-1">
          {records.map((r, i) => (
            <RecordItem key={`${r._kind}-${r.id}-${i}`} r={r} onDelete={handleDelete} deleting={deleting} />
          ))}
          {/* Retorno */}
          {(localFlete.retorno ?? 0) > 0 && (
            <RecordItem
              r={{ ...localFlete, _kind: 'retorno', monto: localFlete.retorno, tipo: 'Retorno' }}
              onDelete={async () => {
                await axios.post('/retornos', { flete_id: localFlete.id, monto: 0 })
                const res = await axios.get(`/fletes/${localFlete.id}`)
                if (res.data?.flete) update(res.data.flete)
              }}
              deleting={deleting}
            />
          )}
          {/* Comisión tarifa (solo lectura) */}
          {(localFlete.comision_total ?? 0) > 0 && (
            <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
              <span className="text-[11px] font-semibold text-violet-300 shrink-0 w-16">Comisión</span>
              <span className="text-xs text-slate-400 flex-1">Tarifa</span>
              <span className="text-xs font-bold text-violet-300">{fmt(localFlete.comision_total)}</span>
            </div>
          )}
        </div>
      )}

      {!localFlete.rendicion && (
        <p className="text-xs text-slate-600 italic text-center py-2">Sin rendición registrada.</p>
      )}

      {/* ── Add section (only if not closed) ───────────────── */}
      {localFlete.rendicion && !isRendido && (
        <div className="space-y-2">
          {/* Tab strip */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mr-1">Agregar</span>
            {addTypes.map(t => (
              <button
                key={t.key}
                onClick={() => setOpenAdd(p => p === t.key ? null : t.key)}
                className={`${BTN_SM} text-slate-500 border border-white/[0.07] bg-white/[0.03] ${t.color} ${
                  openAdd === t.key ? 'border-[#0094d9]/30 bg-[#0094d9]/10 !text-[#0094d9]' : ''
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Active form */}
          {openAdd && (
            <AddForm
              type={openAdd}
              flete={localFlete}
              onAdded={update}
              onCancel={() => setOpenAdd(null)}
            />
          )}
        </div>
      )}

      {/* ── Finalizar ──────────────────────────────────────── */}
      {canFinalizar && (
        <div className="space-y-2">
          {/* Campos faltantes */}
          {!puedeFinalizarCompleto && (
            <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-semibold text-amber-300 uppercase tracking-wide mb-1">
                Completa antes de finalizar:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {camposFaltantes.map(c => (
                  <span key={c} className="text-[10px] bg-amber-500/15 border border-amber-400/25 text-amber-200 rounded px-2 py-0.5">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
          {showFinalizar ? (
            <AddForm
              type="finalizar"
              flete={localFlete}
              onAdded={update}
              onCancel={() => setShowFinalizar(false)}
            />
          ) : (
            <button
              onClick={() => puedeFinalizarCompleto && setShowFinalizar(true)}
              className={`w-full py-2.5 rounded-xl border text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                puedeFinalizarCompleto
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-400/20 text-emerald-300'
                  : 'bg-white/[0.02] border-white/10 text-slate-600 cursor-not-allowed'
              }`}
            >
              <CheckCircleIcon className="w-4 h-4" />
              Finalizar rendición
            </button>
          )}
        </div>
      )}

      {/* Estado final */}
      {isRendido && (
        <div className="text-center text-xs text-slate-600 italic py-1">
          Rendición {localFlete.estado === 'Rendido' ? 'enviada — pendiente de aprobación' :
                     localFlete.estado === 'Aprobado' ? 'aprobada — pendiente de pago' : 'pagada ✓'}
        </div>
      )}

      {/* ── Modal KM ──────────────────────────────────────────── */}
      {showKm && (
        <KmModal
          fleteId={localFlete.id}
          onDone={() => setShowKm(false)}
          onSkip={() => setShowKm(false)}
        />
      )}
    </div>
  )
}
