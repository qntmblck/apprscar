// resources/js/Pages/Publico/FleteRendicion.jsx
// Vista pública para conductores — sin login requerido
import { useState, useMemo } from 'react'
import { Head } from '@inertiajs/react'
import axios from 'axios'
import {
  TruckIcon, CheckCircleIcon, PlusIcon, TrashIcon,
  ExclamationTriangleIcon, BanknotesIcon, XMarkIcon,
} from '@heroicons/react/24/outline'

/* ─── helpers ────────────────────────────────────────────────── */
const fmt = n => n != null ? `$${Math.round(Number(n)).toLocaleString('es-CL')}` : '—'
const fmtDate = d => d
  ? new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—'

const STATUS = {
  'En curso': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  'Rendido':  'bg-amber-500/20 text-amber-300 border-amber-400/30',
  'Aprobado': 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  'Pagado':   'bg-violet-500/20 text-violet-300 border-violet-400/30',
}

const TIPOS_GASTO = ['Peaje', 'Estacionamiento', 'Reparación', 'Alimentación', 'Lavado', 'Otro']
const METODOS_ABONO = ['Efectivo', 'Transferencia', 'Cheque']
const METODOS_DIESEL = ['Efectivo', 'Tarjeta', 'Crédito']

/* ─── KmModal ────────────────────────────────────────────────── */
function KmModal({ onConfirm }) {
  const [km, setKm] = useState('')
  const valid = km && Number(km) > 0
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0a1628] border border-white/15 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0094d9]/20 flex items-center justify-center">
            <TruckIcon className="w-5 h-5 text-[#0094d9]" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Finalizar rendición</p>
            <p className="text-base font-bold text-white">Kilometraje de llegada</p>
          </div>
        </div>
        <div>
          <input
            autoFocus
            type="number"
            value={km}
            onChange={e => setKm(e.target.value)}
            placeholder="Ej: 125430"
            className={`w-full bg-white/[0.05] border rounded-xl text-white text-lg px-4 py-3 focus:outline-none placeholder-slate-600 ${
              valid ? 'border-[#0094d9]/50 focus:border-[#0094d9]' : 'border-white/10'
            }`}
          />
          <p className="text-[10px] text-slate-500 mt-1.5">Obligatorio para finalizar la rendición.</p>
        </div>
        <button
          onClick={() => onConfirm(km)}
          disabled={!valid}
          className="w-full py-2.5 rounded-xl bg-[#0094d9] hover:bg-[#0094d9]/80 text-white font-bold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Finalizar rendición
        </button>
      </div>
    </div>
  )
}

/* ─── AddItemForm ─────────────────────────────────────────────── */
function AddItemForm({ tipo, token, onAdded, onCancel }) {
  const [form, setForm] = useState({
    tipo_gasto: TIPOS_GASTO[0],
    descripcion: '',
    litros: '',
    metodo_pago: METODOS_DIESEL[0],
    metodo: METODOS_ABONO[0],
    monto: '',
    valor: '',
    retorno_desc: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const inputCls = 'w-full bg-white/[0.05] border border-white/10 rounded-lg text-sm text-white px-3 py-2 focus:outline-none focus:border-[#0094d9]/40 placeholder-slate-600'
  const selectCls = `${inputCls} cursor-pointer`

  const submit = async () => {
    setError(null); setLoading(true)
    try {
      let payload = {}
      if (tipo === 'gasto')   payload = { gasto: { tipo: form.tipo_gasto, descripcion: form.descripcion, monto: Number(form.monto) } }
      if (tipo === 'diesel')  payload = { diesel: { litros: form.litros || null, metodo_pago: form.metodo_pago, monto: Number(form.monto) } }
      if (tipo === 'abono')   payload = { abono: { metodo: form.metodo, monto: Number(form.monto) } }
      if (tipo === 'retorno') payload = { retorno: { valor: Number(form.valor), descripcion: form.retorno_desc } }

      const res = await axios.post(`/r/${token}/actualizar`, payload)
      onAdded(res.data.flete)
    } catch (e) {
      setError(e.response?.data?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 space-y-3">
      {tipo === 'gasto' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <select value={form.tipo_gasto} onChange={f('tipo_gasto')} className={selectCls}>
              {TIPOS_GASTO.map(t => <option key={t}>{t}</option>)}
            </select>
            <input type="number" placeholder="Monto $" value={form.monto} onChange={f('monto')} className={inputCls} />
          </div>
          <input type="text" placeholder="Descripción (opcional)" value={form.descripcion} onChange={f('descripcion')} className={inputCls} />
        </>
      )}
      {tipo === 'diesel' && (
        <div className="grid grid-cols-3 gap-2">
          <input type="number" placeholder="Litros" value={form.litros} onChange={f('litros')} className={inputCls} />
          <select value={form.metodo_pago} onChange={f('metodo_pago')} className={selectCls}>
            {METODOS_DIESEL.map(m => <option key={m}>{m}</option>)}
          </select>
          <input type="number" placeholder="Monto $" value={form.monto} onChange={f('monto')} className={inputCls} />
        </div>
      )}
      {tipo === 'abono' && (
        <div className="grid grid-cols-2 gap-2">
          <select value={form.metodo} onChange={f('metodo')} className={selectCls}>
            {METODOS_ABONO.map(m => <option key={m}>{m}</option>)}
          </select>
          <input type="number" placeholder="Monto $" value={form.monto} onChange={f('monto')} className={inputCls} />
        </div>
      )}
      {tipo === 'retorno' && (
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="Valor retorno $" value={form.valor} onChange={f('valor')} className={inputCls} />
          <input type="text" placeholder="Descripción (opcional)" value={form.retorno_desc} onChange={f('retorno_desc')} className={inputCls} />
        </div>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button onClick={submit} disabled={loading}
          className="flex-1 py-2 rounded-lg bg-[#0094d9]/20 hover:bg-[#0094d9]/30 text-[#0094d9] text-sm font-semibold border border-[#0094d9]/25 transition-colors disabled:opacity-40">
          {loading ? 'Guardando…' : 'Guardar'}
        </button>
        <button onClick={onCancel} className="px-3 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  )
}

/* ─── Main Page ───────────────────────────────────────────────── */
export default function FleteRendicion({ flete: initFlete, token }) {
  const [flete, setFlete]     = useState(initFlete)
  const [addTipo, setAddTipo] = useState(null)
  const [showKm, setShowKm]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState(null)

  const r = flete.rendicion
  const enCurso = flete.estado === 'En curso'

  const gastos  = r?.gastos?.reduce((s, g) => s + g.monto, 0) ?? 0
  const diesel  = r?.diesels?.filter(d => d.metodo_pago !== 'Crédito').reduce((s, d) => s + d.monto, 0) ?? 0
  const abonos  = r?.abonos?.reduce((s, a) => s + a.monto, 0) ?? 0
  const viatico = r?.viatico_calculado ?? r?.viatico_efectivo ?? 0
  const saldo   = r?.saldo_temporal ?? (abonos - gastos - diesel - viatico)
  const comision = flete.comision_total ?? 0

  const camposFaltantes = useMemo(() => {
    const f = []
    if (!flete.destino_id)           f.push('Destino')
    if (!flete.cliente_principal_id) f.push('Cliente')
    if (!flete.tracto_id)            f.push('Tracto')
    if (!flete.rampla_id)            f.push('Rampla')
    if (!flete.guiaruta)             f.push('Guía de ruta')
    if (!flete.fecha_salida)         f.push('Fecha salida')
    if (!flete.fecha_llegada)        f.push('Fecha llegada')
    return f
  }, [flete])

  const onAdded = (updatedFlete) => {
    setFlete(updatedFlete)
    setAddTipo(null)
  }

  const eliminar = async (tipo, id) => {
    try {
      const res = await axios.post(`/r/${token}/eliminar`, { tipo, id })
      setFlete(res.data.flete)
    } catch (e) {
      setError('No se pudo eliminar')
    }
  }

  const handleFinalizar = () => {
    if (camposFaltantes.length > 0) return
    setShowKm(true)
  }

  const confirmFinalizar = async (km) => {
    setShowKm(false); setLoading(true); setError(null)
    try {
      await axios.post(`/r/${token}/finalizar`, { kilometraje: km })
      setFlete(p => ({ ...p, estado: 'Rendido' }))
      setSuccess(true)
    } catch (e) {
      setError(e.response?.data?.error || 'Error al finalizar')
    } finally {
      setLoading(false)
    }
  }

  const handleActualizar = async () => {
    setSaving(true); setError(null)
    try {
      const res = await axios.post(`/r/${token}/actualizar`, {})
      if (res.data?.flete) setFlete(res.data.flete)
      setSuccess(true)
    } catch (e) {
      setError(e.response?.data?.message || 'Error al actualizar la rendición')
    } finally {
      setSaving(false)
    }
  }

  const ADD_TYPES = [
    { key: 'gasto',   label: 'Gasto',   color: 'hover:text-red-300',     dot: 'bg-red-400' },
    { key: 'diesel',  label: 'Diésel',  color: 'hover:text-orange-300',  dot: 'bg-orange-400' },
    { key: 'abono',   label: 'Abono',   color: 'hover:text-emerald-300', dot: 'bg-emerald-400' },
    { key: 'retorno', label: 'Retorno', color: 'hover:text-yellow-300',  dot: 'bg-yellow-400' },
  ]

  return (
    <>
      <Head title={`Rendición — Flete #${flete.id}`} />

      {showKm && (
        <KmModal onConfirm={confirmFinalizar} />
      )}

      <div className="min-h-screen text-white" style={{ background: 'linear-gradient(160deg, #060d1b, #0a1628, #080f1e)' }}>
        {/* Header */}
        <header className="border-b border-white/[0.06] px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0094d9]/20 flex items-center justify-center">
            <TruckIcon className="w-4 h-4 text-[#0094d9]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">CAR Transportes</p>
            <p className="text-sm font-bold text-white leading-tight truncate">
              Flete #{flete.id} — {flete.destino?.nombre ?? '—'}
            </p>
          </div>
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${STATUS[flete.estado] ?? ''}`}>
            {flete.estado}
          </span>
        </header>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-5">

          {/* Success banner */}
          {success && (
            <div className="bg-emerald-500/15 border border-emerald-400/25 rounded-2xl px-4 py-4 flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-300">¡Rendición enviada exitosamente!</p>
                <p className="text-xs text-emerald-400/70 mt-0.5">La administración revisará y aprobará tu rendición.</p>
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3 flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-300">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto"><XMarkIcon className="w-4 h-4 text-red-400" /></button>
            </div>
          )}

          {/* Observación previa */}
          {r?.observaciones && (
            <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl px-4 py-3">
              <p className="text-[9px] font-semibold text-amber-400 uppercase tracking-wide mb-1">Observación de administración</p>
              <p className="text-sm text-amber-200">{r.observaciones}</p>
            </div>
          )}

          {/* Info flete */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Información del flete</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {[
                { label: 'Destino',      v: flete.destino?.nombre },
                { label: 'Cliente',      v: flete.cliente_principal?.razon_social },
                { label: 'Conductor',    v: flete.conductor?.name },
                { label: 'Tracto',       v: flete.tracto?.patente },
                { label: 'Rampla',       v: flete.rampla?.patente },
                { label: 'Guía de ruta', v: flete.guiaruta },
                { label: 'Fecha salida', v: fmtDate(flete.fecha_salida) },
                { label: 'Fecha llegada',v: fmtDate(flete.fecha_llegada) },
              ].map(({ label, v }) => (
                <div key={label}>
                  <p className="text-[9px] text-slate-600 uppercase tracking-wide">{label}</p>
                  <p className={`font-medium ${v ? 'text-slate-300' : 'text-amber-400 italic'}`}>{v || 'Faltante'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen financiero */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Abonos',   n: abonos,   color: 'text-emerald-300' },
              { label: 'Gastos',   n: gastos,   color: 'text-red-300', neg: true },
              { label: 'Diésel',   n: diesel,   color: 'text-orange-300', neg: true },
              { label: 'Viático',  n: viatico,  color: 'text-amber-300', neg: true },
              { label: 'Comisión', n: comision, color: 'text-violet-300' },
              { label: 'Saldo',    n: saldo,    color: saldo >= 0 ? 'text-emerald-300' : 'text-red-400', bold: true },
            ].map(({ label, n, color, neg, bold }) => (
              <div key={label} className={`bg-white/[0.04] rounded-xl px-3 py-2.5 text-center ${bold ? 'border border-white/15' : ''}`}>
                <p className="text-[8px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
                <p className={`text-xs ${color} ${bold ? 'font-extrabold' : 'font-semibold'} mt-0.5`}>
                  {neg ? '-' : ''}{fmt(Math.abs(n))}
                </p>
              </div>
            ))}
          </div>

          {/* Lista de registros */}
          {(r?.gastos?.length > 0 || r?.diesels?.length > 0 || r?.abonos?.length > 0 || flete.retorno) && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Registros</p>
              <div className="space-y-1">
                {r?.gastos?.map(g => (
                  <div key={g.id} className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span className="flex-1 text-xs text-slate-400">{g.tipo}{g.descripcion ? ` — ${g.descripcion}` : ''}</span>
                    <span className="text-xs text-red-300 font-mono font-semibold">{fmt(g.monto)}</span>
                    {enCurso && (
                      <button onClick={() => eliminar('gasto', g.id)} className="text-slate-700 hover:text-red-400 transition-colors">
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                {r?.diesels?.map(d => (
                  <div key={d.id} className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                    <span className="flex-1 text-xs text-slate-400">{d.litros ? `${d.litros}L` : ''} Diésel {d.metodo_pago}</span>
                    <span className="text-xs text-orange-300 font-mono font-semibold">{fmt(d.monto)}</span>
                    {enCurso && (
                      <button onClick={() => eliminar('diesel', d.id)} className="text-slate-700 hover:text-red-400 transition-colors">
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                {r?.abonos?.map(a => (
                  <div key={a.id} className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="flex-1 text-xs text-slate-400">{a.metodo}</span>
                    <span className="text-xs text-emerald-300 font-mono font-semibold">{fmt(a.monto)}</span>
                    {enCurso && (
                      <button onClick={() => eliminar('abono', a.id)} className="text-slate-700 hover:text-red-400 transition-colors">
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                {flete.retorno && (
                  <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                    <span className="flex-1 text-xs text-slate-400">Retorno{flete.retorno.descripcion ? ` — ${flete.retorno.descripcion}` : ''}</span>
                    <span className="text-xs text-yellow-300 font-mono font-semibold">{fmt(flete.retorno.valor)}</span>
                    {enCurso && (
                      <button onClick={() => eliminar('retorno', flete.retorno.id)} className="text-slate-700 hover:text-red-400 transition-colors">
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Agregar registros */}
          {enCurso && (
            <div className="space-y-3">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Agregar registro</p>
              {addTipo ? (
                <AddItemForm tipo={addTipo} token={token} onAdded={onAdded} onCancel={() => setAddTipo(null)} />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {ADD_TYPES.map(t => (
                    <button
                      key={t.key}
                      onClick={() => setAddTipo(t.key)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-slate-400 ${t.color} transition-colors`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Campos faltantes warning */}
          {enCurso && camposFaltantes.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl px-4 py-3">
              <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide mb-1.5">
                Campos requeridos para finalizar
              </p>
              <p className="text-xs text-amber-200">
                Pide a la administración que complete: {camposFaltantes.join(', ')}
              </p>
            </div>
          )}

          {/* Botones acción */}
          {enCurso && (
            <div className="flex flex-col gap-2 pb-8">
              <button
                disabled={saving || loading}
                onClick={handleActualizar}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-sm border border-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {saving ? 'Actualizando…' : 'Actualizar rendición'}
              </button>
              <button
                disabled={camposFaltantes.length > 0 || loading}
                onClick={handleFinalizar}
                className="w-full py-3.5 rounded-2xl bg-[#0094d9] hover:bg-[#0094d9]/80 text-white font-bold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando…' : 'Finalizar rendición'}
              </button>
              <p className="text-center text-[10px] text-slate-600">
                Los cambios se guardan automáticamente al agregar cada registro.
              </p>
            </div>
          )}

          {!enCurso && !success && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-6 text-center">
              <CheckCircleIcon className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">Rendición {flete.estado}</p>
              <p className="text-xs text-slate-500 mt-1">Esta rendición ya fue enviada y está siendo procesada.</p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
