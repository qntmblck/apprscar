import { useState, useRef } from 'react'
import { Head, usePage } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import axios from 'axios'
import {
  TruckIcon, DocumentCheckIcon, BanknotesIcon,
  CheckCircleIcon, ExclamationTriangleIcon, PlusIcon,
  TrashIcon, ChevronDownIcon, ArrowPathIcon,
  FuelPumpIcon, ReceiptPercentIcon, ArrowDownTrayIcon,
  CurrencyDollarIcon, XMarkIcon,
} from '@heroicons/react/24/outline'

/* ─── Helpers ─────────────────────────────────────────────────── */
const fmt = (n) => n != null ? `$${Number(n).toLocaleString('es-CL')}` : '—'

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'

const STATUS = {
  'En curso': { label: 'En curso',  dot: 'bg-[#0094d9]',      pill: 'bg-[#0094d9]/15 text-[#0094d9] border-[#0094d9]/30' },
  'Rendido':  { label: 'Rendido',   dot: 'bg-amber-400',       pill: 'bg-amber-500/15 text-amber-300 border-amber-400/30' },
  'Aprobado': { label: 'Aprobado',  dot: 'bg-emerald-400',     pill: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' },
  'Pagado':   { label: 'Pagado',    dot: 'bg-violet-400',      pill: 'bg-violet-500/15 text-violet-300 border-violet-400/30' },
}

/* ─── Stats bar ───────────────────────────────────────────────── */
function StatsBar({ totales }) {
  const items = [
    { label: 'En curso',   value: totales.en_curso,  color: 'text-[#0094d9] bg-[#0094d9]/10 border-[#0094d9]/20' },
    { label: 'Sin rendir', value: totales.pendiente,  color: 'text-amber-300 bg-amber-500/10 border-amber-500/20' },
    { label: 'Rendidos',   value: totales.rendidos,  color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Aprobados',  value: totales.aprobados, color: 'text-emerald-400 bg-emerald-600/10 border-emerald-600/20' },
    { label: 'Pagados',    value: totales.pagados,   color: 'text-violet-300 bg-violet-500/10 border-violet-500/20' },
  ]
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {items.map(({ label, value, color }) => (
        <div key={label} className={`${color} border rounded-xl px-3 py-2.5 text-center`}>
          <p className="text-lg font-extrabold text-white">{value}</p>
          <p className="text-[10px] font-medium mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}

/* ─── Mini form row ───────────────────────────────────────────── */
function FormRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white px-3 py-2 focus:outline-none focus:border-[#0094d9]/50 placeholder-slate-600'
const selectCls = `${inputCls} cursor-pointer`

/* ─── Rendicion inline form ───────────────────────────────────── */
function RendicionForm({ flete, onRendicionSubmitted }) {
  const [gastos, setGastos]   = useState([])
  const [diesels, setDiesels] = useState([])
  const [abonos, setAbonos]   = useState([])
  const [obs, setObs]         = useState('')
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)
  const [success, setSuccess] = useState(false)

  /* --- gastos --- */
  const addGasto = () => setGastos(g => [...g, { tipo: 'Combustible', descripcion: '', monto: '' }])
  const removeGasto = (i) => setGastos(g => g.filter((_, idx) => idx !== i))
  const updateGasto = (i, k, v) => setGastos(g => g.map((x, idx) => idx === i ? { ...x, [k]: v } : x))

  /* --- diesels --- */
  const addDiesel = () => setDiesels(d => [...d, { litros: '', metodo_pago: 'Efectivo', monto: '' }])
  const removeDiesel = (i) => setDiesels(d => d.filter((_, idx) => idx !== i))
  const updateDiesel = (i, k, v) => setDiesels(d => d.map((x, idx) => idx === i ? { ...x, [k]: v } : x))

  /* --- abonos --- */
  const addAbono = () => setAbonos(a => [...a, { metodo: 'Efectivo', monto: '' }])
  const removeAbono = (i) => setAbonos(a => a.filter((_, idx) => idx !== i))
  const updateAbono = (i, k, v) => setAbonos(a => a.map((x, idx) => idx === i ? { ...x, [k]: v } : x))

  /* --- totals --- */
  const totalGastos = gastos.reduce((s, g) => s + (Number(g.monto) || 0), 0)
  const totalDiesel = diesels.reduce((s, d) => s + (Number(d.monto) || 0), 0)
  const totalAbonos = abonos.reduce((s, a) => s + (Number(a.monto) || 0), 0)
  const saldo = totalAbonos - totalGastos - totalDiesel

  const handleSubmit = async () => {
    const rendicionId = flete.rendicion?.id
    if (!rendicionId) {
      setError('Este flete no tiene rendición asociada. Contacta a administración.')
      return
    }

    setSaving(true)
    setError(null)
    try {
      // 1) Register each gasto
      for (const g of gastos) {
        if (!g.monto || Number(g.monto) <= 0) continue
        await axios.post('/gastos', {
          rendicion_id: rendicionId,
          flete_id: flete.id,
          tipo: g.tipo,
          descripcion: g.descripcion || '',
          monto: Number(g.monto),
        })
      }
      // 2) Register each diesel
      for (const d of diesels) {
        if (!d.monto || Number(d.monto) <= 0) continue
        await axios.post('/diesel', {
          rendicion_id: rendicionId,
          flete_id: flete.id,
          litros: Number(d.litros) || 0,
          metodo_pago: d.metodo_pago,
          monto: Number(d.monto),
        })
      }
      // 3) Register each abono (field name is 'tipo' per AbonoController)
      for (const a of abonos) {
        if (!a.monto || Number(a.monto) <= 0) continue
        await axios.post('/abonos', {
          rendicion_id: rendicionId,
          flete_id: flete.id,
          tipo: a.metodo,   // AbonoController validates 'tipo', stores as 'metodo'
          monto: Number(a.monto),
        })
      }
      // 4) Finalizar: cierra la rendición → estado Rendido
      const today = new Date().toISOString().split('T')[0]
      const res = await axios.post(`/fletes/${flete.id}/finalizar`, {
        flete_id:      flete.id,
        rendicion_id:  rendicionId,
        fecha_termino: flete.fecha_llegada
          ? new Date(flete.fecha_llegada).toISOString().split('T')[0]
          : today,
      })
      setSuccess(true)
      onRendicionSubmitted(res.data?.flete ?? { ...flete, estado: 'Rendido' })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al enviar rendición.')
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center mb-3">
          <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
        </div>
        <p className="text-white font-bold">¡Rendición enviada!</p>
        <p className="text-slate-400 text-sm mt-1">El administrador revisará y aprobará tu rendición.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5 pt-4 border-t border-white/5">
      {/* Flete resumen header */}
      <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Datos del servicio</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <p className="text-slate-500">Destino</p>
            <p className="text-white font-semibold">{flete.destino?.nombre ?? '—'}</p>
          </div>
          <div>
            <p className="text-slate-500">Cliente</p>
            <p className="text-white font-semibold truncate">{flete.cliente_principal?.razon_social ?? flete.cliente_nombre ?? '—'}</p>
          </div>
          <div>
            <p className="text-slate-500">Tracto</p>
            <p className="text-white font-mono font-semibold">{flete.tracto?.patente ?? '—'}</p>
          </div>
          <div>
            <p className="text-slate-500">Salida</p>
            <p className="text-white font-semibold">{fmtDate(flete.fecha_salida)}</p>
          </div>
          <div>
            <p className="text-slate-500">Llegada</p>
            <p className="text-white font-semibold">{fmtDate(flete.fecha_llegada)}</p>
          </div>
          {flete.guiaruta && (
            <div>
              <p className="text-slate-500">Guía de ruta</p>
              <p className="text-white font-semibold">{flete.guiaruta}</p>
            </div>
          )}
        </div>
      </div>

      {/* GASTOS */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-white flex items-center gap-1.5">
            <ReceiptPercentIcon className="w-4 h-4 text-red-400" />
            Gastos
          </p>
          <button onClick={addGasto} className="flex items-center gap-1 text-xs font-semibold text-[#0094d9] hover:text-white transition-colors">
            <PlusIcon className="w-3.5 h-3.5" />
            Agregar
          </button>
        </div>
        <div className="space-y-2">
          {gastos.map((g, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl p-3 grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4">
                <FormRow label="Tipo">
                  <select value={g.tipo} onChange={e => updateGasto(i, 'tipo', e.target.value)} className={selectCls}>
                    {['Combustible','Peaje','Mantención','Alimentación','Hospedaje','Otro'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </FormRow>
              </div>
              <div className="col-span-5">
                <FormRow label="Descripción">
                  <input
                    value={g.descripcion}
                    onChange={e => updateGasto(i, 'descripcion', e.target.value)}
                    placeholder="Descripción…"
                    className={inputCls}
                  />
                </FormRow>
              </div>
              <div className="col-span-2">
                <FormRow label="Monto">
                  <input
                    type="number"
                    value={g.monto}
                    onChange={e => updateGasto(i, 'monto', e.target.value)}
                    placeholder="0"
                    className={inputCls}
                  />
                </FormRow>
              </div>
              <div className="col-span-1 flex justify-end pb-0.5">
                <button onClick={() => removeGasto(i)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {gastos.length === 0 && (
            <p className="text-xs text-slate-600 italic text-center py-3">Sin gastos registrados. Pulsa Agregar.</p>
          )}
        </div>
        {gastos.length > 0 && (
          <div className="text-right mt-1">
            <span className="text-xs text-red-300 font-semibold">Total gastos: {fmt(totalGastos)}</span>
          </div>
        )}
      </div>

      {/* DIESEL */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-white flex items-center gap-1.5">
            <span className="text-orange-400">⛽</span>
            Diesel
          </p>
          <button onClick={addDiesel} className="flex items-center gap-1 text-xs font-semibold text-[#0094d9] hover:text-white transition-colors">
            <PlusIcon className="w-3.5 h-3.5" />
            Agregar
          </button>
        </div>
        <div className="space-y-2">
          {diesels.map((d, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl p-3 grid grid-cols-12 gap-2 items-end">
              <div className="col-span-3">
                <FormRow label="Litros">
                  <input type="number" value={d.litros} onChange={e => updateDiesel(i, 'litros', e.target.value)} placeholder="0" className={inputCls} />
                </FormRow>
              </div>
              <div className="col-span-4">
                <FormRow label="Método pago">
                  <select value={d.metodo_pago} onChange={e => updateDiesel(i, 'metodo_pago', e.target.value)} className={selectCls}>
                    {['Efectivo','Transferencia','Crédito'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </FormRow>
              </div>
              <div className="col-span-4">
                <FormRow label="Monto ($)">
                  <input type="number" value={d.monto} onChange={e => updateDiesel(i, 'monto', e.target.value)} placeholder="0" className={inputCls} />
                </FormRow>
              </div>
              <div className="col-span-1 flex justify-end pb-0.5">
                <button onClick={() => removeDiesel(i)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {diesels.length === 0 && (
            <p className="text-xs text-slate-600 italic text-center py-3">Sin diesel registrado. Pulsa Agregar.</p>
          )}
        </div>
        {diesels.length > 0 && (
          <div className="text-right mt-1">
            <span className="text-xs text-orange-300 font-semibold">Total diesel: {fmt(totalDiesel)}</span>
          </div>
        )}
      </div>

      {/* ABONOS CAJA */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-white flex items-center gap-1.5">
            <CurrencyDollarIcon className="w-4 h-4 text-emerald-400" />
            Abonos de caja
          </p>
          <button onClick={addAbono} className="flex items-center gap-1 text-xs font-semibold text-[#0094d9] hover:text-white transition-colors">
            <PlusIcon className="w-3.5 h-3.5" />
            Agregar
          </button>
        </div>
        <div className="space-y-2">
          {abonos.map((a, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl p-3 grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <FormRow label="Método">
                  <select value={a.metodo} onChange={e => updateAbono(i, 'metodo', e.target.value)} className={selectCls}>
                    {['Efectivo','Transferencia','Cheque'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </FormRow>
              </div>
              <div className="col-span-6">
                <FormRow label="Monto ($)">
                  <input type="number" value={a.monto} onChange={e => updateAbono(i, 'monto', e.target.value)} placeholder="0" className={inputCls} />
                </FormRow>
              </div>
              <div className="col-span-1 flex justify-end pb-0.5">
                <button onClick={() => removeAbono(i)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {abonos.length === 0 && (
            <p className="text-xs text-slate-600 italic text-center py-3">Sin abonos registrados. Pulsa Agregar.</p>
          )}
        </div>
        {abonos.length > 0 && (
          <div className="text-right mt-1">
            <span className="text-xs text-emerald-300 font-semibold">Total abonos: {fmt(totalAbonos)}</span>
          </div>
        )}
      </div>

      {/* RESUMEN SALDO */}
      {(gastos.length + diesels.length + abonos.length) > 0 && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Resumen</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Abonos recibidos</span>
              <span className="text-emerald-300 font-semibold">{fmt(totalAbonos)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Gastos</span>
              <span className="text-red-300 font-semibold">−{fmt(totalGastos)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Diesel (efectivo)</span>
              <span className="text-orange-300 font-semibold">−{fmt(totalDiesel)}</span>
            </div>
            <div className="border-t border-white/8 pt-2 flex justify-between font-bold">
              <span className="text-white">Saldo</span>
              <span className={saldo >= 0 ? 'text-emerald-300' : 'text-red-400'}>{fmt(saldo)}</span>
            </div>
          </div>
        </div>
      )}

      {/* OBSERVACIONES */}
      <div>
        <FormRow label="Observaciones (opcional)">
          <textarea
            value={obs}
            onChange={e => setObs(e.target.value)}
            rows={2}
            placeholder="Notas adicionales sobre la ruta, incidentes, etc."
            className={`${inputCls} resize-none`}
          />
        </FormRow>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0094d9] hover:bg-[#007ab8] text-white font-bold text-sm transition-colors disabled:opacity-60"
      >
        {saving ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <ArrowDownTrayIcon className="w-4 h-4" />}
        {saving ? 'Enviando rendición…' : 'Enviar rendición de gastos'}
      </button>
    </div>
  )
}

/* ─── Servicio card ───────────────────────────────────────────── */
function ServicioCard({ flete: initFlete }) {
  const [flete, setFlete] = useState(initFlete)
  const [open, setOpen]   = useState(false)
  const st = STATUS[flete.estado] ?? STATUS['En curso']

  const canRendir = flete.estado === 'En curso'
  const yaRendido = ['Rendido','Aprobado','Pagado'].includes(flete.estado)

  const handleRendicionSubmitted = (newFlete) => {
    setFlete(prev => ({ ...prev, ...newFlete }))
    setTimeout(() => setOpen(false), 1500)
  }

  // Rendicion summary for ya-rendido fletes
  const r = flete.rendicion
  const gastoTotal  = r ? (r.total_gastos  ?? r.gastos?.reduce((s, g) => s + g.monto, 0) ?? 0) : null
  const dieselTotal = r ? (r.total_diesel  ?? r.diesels?.reduce((s, d) => s + d.monto, 0) ?? 0) : null
  const abonoTotal  = r?.abonos?.reduce((s, a) => s + a.monto, 0) ?? null
  const saldoRend   = r ? (r.saldo_temporal ?? (abonoTotal - gastoTotal - dieselTotal)) : null

  return (
    <div className={`bg-white/[0.03] border rounded-2xl overflow-hidden transition-colors ${
      open ? 'border-[#0094d9]/30' : 'border-white/10 hover:border-white/15'
    }`}>
      {/* Card header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Estado dot */}
            <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{}} >
              <span className={`block w-2 h-2 rounded-full ${st.dot}`} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs text-slate-500 font-mono">#{flete.id}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${st.pill}`}>
                  {st.label}
                </span>
              </div>
              <p className="text-base font-bold text-white truncate">
                {flete.destino?.nombre ?? '—'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {flete.cliente_principal?.razon_social ?? flete.cliente_nombre ?? '—'}
              </p>
            </div>
          </div>

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

        {/* Meta */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {flete.tracto?.patente && (
            <span className="text-[10px] bg-white/5 border border-white/10 rounded px-2 py-0.5 text-slate-400 font-mono">
              {flete.tracto.patente}
            </span>
          )}
          {flete.rampla?.patente && (
            <span className="text-[10px] text-slate-500">{flete.rampla.patente}</span>
          )}
          {flete.guiaruta && (
            <span className="text-[10px] text-slate-500">GR: {flete.guiaruta}</span>
          )}
        </div>

        {/* Rendicion summary (si ya tiene) */}
        {yaRendido && r && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[
              { label: 'Gastos',  value: gastoTotal,  color: 'text-red-300' },
              { label: 'Diesel',  value: dieselTotal, color: 'text-orange-300' },
              { label: 'Abonos',  value: abonoTotal,  color: 'text-emerald-300' },
              { label: 'Saldo',   value: saldoRend,   color: saldoRend >= 0 ? 'text-emerald-300' : 'text-red-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/[0.03] border border-white/8 rounded-xl px-2 py-1.5 text-center">
                <p className="text-[10px] text-slate-500">{label}</p>
                <p className={`text-xs font-bold ${color}`}>{fmt(value)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Action button */}
        <div className="mt-3 flex items-center gap-2">
          {canRendir && (
            <button
              onClick={() => setOpen(p => !p)}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
                open
                  ? 'bg-white/5 text-slate-400 border border-white/10'
                  : 'bg-[#0094d9] hover:bg-[#007ab8] text-white'
              }`}
            >
              {open ? (
                <><XMarkIcon className="w-3.5 h-3.5" /> Cerrar</>
              ) : (
                <><DocumentCheckIcon className="w-3.5 h-3.5" /> Rendir gastos</>
              )}
            </button>
          )}

          {flete.rendicion_solicitada_at && canRendir && (
            <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
              <ExclamationTriangleIcon className="w-3 h-3" />
              Rendición solicitada por administración
            </span>
          )}
        </div>
      </div>

      {/* Expandable rendicion form */}
      {open && canRendir && (
        <div className="px-4 pb-5 border-t border-white/5">
          <RendicionForm flete={flete} onRendicionSubmitted={handleRendicionSubmitted} />
        </div>
      )}
    </div>
  )
}

/* ─── Main page ───────────────────────────────────────────────── */
export default function ConductorServicios() {
  const { props } = usePage()
  const { fletes, totales } = props
  const lista = fletes?.data ?? fletes ?? []

  return (
    <AuthenticatedLayout>
      <Head title="Mis Fletes" />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold text-[#0094d9] uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <TruckIcon className="w-3.5 h-3.5" />
            Conductor
          </p>
          <h1 className="text-2xl font-extrabold text-white">Mis Fletes</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Historial de fletes asignados. Rinde tus gastos en los servicios activos.
          </p>
        </div>

        {/* Stats */}
        {totales && <StatsBar totales={totales} />}

        {/* Lista */}
        {lista.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0094d9]/10 border border-[#0094d9]/20 flex items-center justify-center mb-4">
              <TruckIcon className="w-8 h-8 text-[#0094d9]/40" />
            </div>
            <p className="text-slate-300 font-semibold">Sin fletes asignados</p>
            <p className="text-slate-500 text-sm mt-1">Tus fletes aparecerán aquí cuando sean asignados.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lista.map(flete => (
              <ServicioCard key={flete.id} flete={flete} />
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
