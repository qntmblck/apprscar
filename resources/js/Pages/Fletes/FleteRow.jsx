// resources/js/Pages/Fletes/FleteRow.jsx
import React, { useState, useRef, useEffect, memo, useCallback } from 'react'
import FleteDetailPanel from './FleteDetailPanel'
import axios from 'axios'
import { ChevronRightIcon, PencilIcon, ChatBubbleLeftRightIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

/* ─── Estado badge ─────────────────────────────────────────────── */
const STATUS = {
  'En curso': { dot: 'bg-[#0094d9]',   text: 'text-[#0094d9]'  },
  'Rendido':  { dot: 'bg-amber-400',   text: 'text-amber-300'  },
  'Aprobado': { dot: 'bg-emerald-400', text: 'text-emerald-300' },
  'Pagado':   { dot: 'bg-violet-400',  text: 'text-violet-300' },
}

const fmtDate = d => d
  ? new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })
  : '—'

const fmt = n => n != null
  ? `$${Math.round(n).toLocaleString('es-CL')}`
  : null

/* ─── Shared input/select styles ───────────────────────────────── */
const CELL_INPUT = 'bg-[#0a1628] border border-[#0094d9]/50 rounded text-xs text-white px-2 py-1 focus:outline-none focus:border-[#0094d9] w-full'
const CELL_SELECT = `${CELL_INPUT} cursor-pointer`

/* ─── InlineSelect — click to open native select ───────────────── */
function InlineSelect({ currentId, options, onSave, getLabel, placeholder = '—', none = '— ninguno —' }) {
  const [editing, setEditing] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (editing) ref.current?.focus()
  }, [editing])

  const current = options.find(o => String(o.id) === String(currentId))

  if (editing) {
    return (
      <select
        ref={ref}
        className={CELL_SELECT}
        defaultValue={currentId ?? ''}
        onChange={e => { onSave(e.target.value || null); setEditing(false) }}
        onBlur={() => setEditing(false)}
        onClick={e => e.stopPropagation()}
      >
        <option value="">{none}</option>
        {options.map(o => (
          <option key={o.id} value={o.id}>{getLabel(o)}</option>
        ))}
      </select>
    )
  }

  return (
    <span
      onClick={e => { e.stopPropagation(); setEditing(true) }}
      className="group flex items-center gap-1 cursor-pointer text-xs"
    >
      {current
        ? <span className="text-slate-300 group-hover:text-white transition-colors">{getLabel(current)}</span>
        : <span className="text-slate-600 italic">{placeholder}</span>
      }
      <PencilIcon className="w-2.5 h-2.5 text-slate-700 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
    </span>
  )
}

/* ─── InlineText — click to edit text ──────────────────────────── */
function InlineText({ value, onSave, placeholder = '—', maxLen = 30 }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(value ?? '')
  const ref = useRef(null)

  useEffect(() => {
    if (editing) { ref.current?.focus(); ref.current?.select() }
  }, [editing])

  const commit = useCallback(() => { onSave(draft.trim()); setEditing(false) }, [draft, onSave])

  const onKey = e => {
    if (e.key === 'Enter')  commit()
    if (e.key === 'Escape') { setDraft(value ?? ''); setEditing(false) }
  }

  if (editing) {
    return (
      <input
        ref={ref}
        value={draft}
        maxLength={maxLen}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKey}
        onClick={e => e.stopPropagation()}
        className={CELL_INPUT}
        style={{ minWidth: 80 }}
      />
    )
  }

  return (
    <span
      onClick={e => { e.stopPropagation(); setDraft(value ?? ''); setEditing(true) }}
      className="group flex items-center gap-1 cursor-pointer text-xs"
    >
      {value
        ? <span className="text-slate-300 group-hover:text-white transition-colors font-mono">{value}</span>
        : <span className="text-slate-600 italic">{placeholder}</span>
      }
      <PencilIcon className="w-2.5 h-2.5 text-slate-700 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
    </span>
  )
}

/* ─── InlineDate ────────────────────────────────────────────────── */
function InlineDate({ value, onSave, placeholder = '—' }) {
  const [editing, setEditing] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (editing) ref.current?.focus()
  }, [editing])

  // value comes as ISO string e.g. "2025-05-15T03:00:00.000Z" or "2025-05-15"
  const isoDate = value ? new Date(value).toISOString().slice(0, 10) : ''

  const commit = (v) => {
    if (v) onSave(new Date(v))   // pass Date to existing handlers
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={ref}
        type="date"
        defaultValue={isoDate}
        onChange={e => { if(e.target.value) commit(e.target.value) }}
        onBlur={() => setEditing(false)}
        onClick={e => e.stopPropagation()}
        className={CELL_INPUT}
        style={{ minWidth: 110 }}
      />
    )
  }

  return (
    <span
      onClick={e => { e.stopPropagation(); setEditing(true) }}
      className="group flex items-center gap-1 cursor-pointer text-xs"
    >
      {value
        ? <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{fmtDate(value)}</span>
        : <span className="text-slate-600 italic">{placeholder}</span>
      }
      <PencilIcon className="w-2.5 h-2.5 text-slate-700 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
    </span>
  )
}

/* ─── FleteRow ──────────────────────────────────────────────────── */
function FleteRow({
  flete: initFlete,
  isExpanded,
  onToggle,
  isSelected,
  onSelect,
  openForm,
  handleToggleForm,
  handleCloseForm,
  actualizarFleteEnLista,
  submitForm,
  onEliminarRegistro,
  onUpdateKilometraje,
  conductores,
  colaboradores,
  clientes,
  tractos,
  destinos,
  ramplas,
  guias,
  userRoles,
  onSelectDestino,
  onSelectCliente,
  onSelectTitular,
  onSelectTracto,
  onSelectRampla,
  onSelectGuiaRuta,
  onSelectFechaSalida,
  onSelectFechaLlegada,
  selectedIds,
  toggleSelect,
}) {
  const [flete, setFlete] = useState(initFlete)
  const [publicUrl, setPublicUrl] = useState(initFlete.public_token ? `${window.location.origin}/r/${initFlete.public_token}` : null)
  const [sharingLoading, setSharingLoading] = useState(false)
  useEffect(() => setFlete(initFlete), [initFlete])

  // Sync parent list after local update
  const update = useCallback(f => {
    setFlete(f)
    actualizarFleteEnLista(f)
  }, [actualizarFleteEnLista])

  const st = STATUS[flete.estado] ?? STATUS['En curso']

  // ── Saldo: usar saldo_temporal del modelo (incluye viático)
  // Rendicion tiene $appends = ['total_gastos','total_diesel','viatico_calculado','saldo_temporal']
  const saldo = flete.rendicion?.saldo_temporal ?? null

  const isConductor = userRoles?.includes('conductor')
  const isEnCurso = flete.estado === 'En curso'

  // ── Inline save handlers ─────────────────────────────────────
  const saveDestino = async (id) => {
    const res = await onSelectDestino(flete.id, { destino_id: id ?? null })
    if (res?.data?.flete) update(res.data.flete)
  }
  const saveCliente = async (id) => {
    const res = await onSelectCliente(flete.id, { cliente_principal_id: id ?? null })
    if (res?.data?.flete) update(res.data.flete)
  }
  const saveConductor = async (id) => {
    const res = await onSelectTitular(flete.id, { conductor_id: id ?? null })
    if (res?.data?.flete) update(res.data.flete)
  }
  const saveTracto = async (id) => {
    const res = await onSelectTracto(flete.id, { tracto_id: id ?? null })
    if (res?.data?.flete) update(res.data.flete)
  }
  const saveRampla = async (id) => {
    const res = await onSelectRampla(flete.id, { rampla_id: id ?? null })
    if (res?.data?.flete) update(res.data.flete)
  }
  const saveGuia = async (txt) => {
    const res = await onSelectGuiaRuta(flete.id, txt)
    if (res?.data?.flete) update(res.data.flete)
  }
  const saveFechaSalida = async (date) => {
    const res = await onSelectFechaSalida(flete.id, date)
    if (res?.data?.flete) update(res.data.flete)
  }
  const saveFechaLlegada = async (date) => {
    const res = await onSelectFechaLlegada(flete.id, date)
    if (res?.data?.flete) update(res.data.flete)
  }

  const getPublicUrl = async () => {
    if (publicUrl) return publicUrl
    setSharingLoading(true)
    try {
      const res = await axios.post(`/fletes/${flete.id}/generar-token`)
      const url = res.data.url
      setPublicUrl(url)
      return url
    } finally {
      setSharingLoading(false)
    }
  }

  const buildRequestMessage = (url) => encodeURIComponent(
    `Hola ${flete.conductor?.name ?? 'conductor'}.\n\n` +
    `Te solicitamos completar la rendición del flete #${flete.id} (${flete.destino?.nombre ?? ''}).\n\n` +
    `Ingresa aquí para registrar avances y finalizar cuando corresponda:\n${url}\n\n` +
    `Puedes usar "Actualizar rendición" para guardar avances y "Finalizar rendición" cuando esté completa.`
  )

  const handleShareWhatsApp = async () => {
    const url = await getPublicUrl()
    const phone = (flete.conductor?.phone || '').replace(/\D/g, '')
    const msg = buildRequestMessage(url)
    const href = phone ? `https://wa.me/56${phone}?text=${msg}` : `https://wa.me/?text=${msg}`
    window.open(href, '_blank')
  }

  const handleShareEmail = async () => {
    const url = await getPublicUrl()
    const subject = encodeURIComponent(`Solicitud de rendición — Flete #${flete.id}`)
    const body = buildRequestMessage(url)
    window.location.href = `mailto:${flete.conductor?.email ?? ''}?subject=${subject}&body=${body}`
  }

  const rowBase = `group border-b border-white/[0.04] transition-colors ${
    isExpanded ? 'bg-[#0094d9]/[0.07] border-b-[#0094d9]/20' : 'hover:bg-white/[0.025] cursor-pointer'
  }`

  const conductorLabel = flete.conductor?.name ?? (flete.colaborador?.name ? `Col: ${flete.colaborador.name}` : null)

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          MOBILE — 2 filas compactas (oculto en sm+)
      ══════════════════════════════════════════════════════ */}
      <tr className={`${rowBase} sm:hidden`} onClick={onToggle}>
        <td colSpan={12} className="px-3 py-2.5">
          {/* Fila 1: check · destino+estado · saldo · expand */}
          <div className="flex items-center gap-2.5">
            <div
              onClick={e => { e.stopPropagation(); onSelect() }}
              className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 cursor-pointer ${
                isSelected ? 'bg-[#0094d9] border-[#0094d9]' : 'border-white/20'
              }`}
            >
              {isSelected && <span className="text-white text-[8px] font-bold">✓</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
                <span className="text-sm font-bold text-white truncate">
                  {flete.destino?.nombre ?? '—'}
                </span>
                <span className={`text-[9px] font-semibold ${st.text} shrink-0`}>{flete.estado}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {flete.cliente_principal?.razon_social && (
                  <span className="text-[10px] text-slate-500 truncate">{flete.cliente_principal.razon_social}</span>
                )}
                {conductorLabel && !isConductor && (
                  <span className="text-[10px] text-slate-500 truncate">{conductorLabel}</span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0 flex items-center gap-1.5">
              {saldo !== null && (
                <span className={`text-xs font-bold ${saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {fmt(saldo)}
                </span>
              )}
              <ChevronRightIcon className={`w-3.5 h-3.5 text-slate-700 transition-all ${isExpanded ? 'rotate-90 !text-[#0094d9]' : ''}`} />
            </div>
          </div>

          {/* Fila 2: chips — tracto, rampla, guía, fechas */}
          <div className="flex flex-wrap gap-1.5 mt-2 pl-6" onClick={e => e.stopPropagation()}>
            {flete.tracto?.patente && (
              <span className="text-[9px] bg-white/[0.05] border border-white/10 rounded px-1.5 py-0.5 text-slate-400 font-mono">
                {flete.tracto.patente}
              </span>
            )}
            {flete.rampla?.patente && (
              <span className="text-[9px] bg-white/[0.05] border border-white/10 rounded px-1.5 py-0.5 text-slate-400 font-mono">
                {flete.rampla.patente}
              </span>
            )}
            {flete.guiaruta && (
              <span className="text-[9px] bg-white/[0.05] border border-white/10 rounded px-1.5 py-0.5 text-slate-400 font-mono">
                {flete.guiaruta}
              </span>
            )}
            {flete.fecha_salida && (
              <span className="text-[9px] text-slate-500">
                {fmtDate(flete.fecha_salida)}{flete.fecha_llegada ? ` → ${fmtDate(flete.fecha_llegada)}` : ''}
              </span>
            )}
          </div>
        </td>
      </tr>

      {/* ══════════════════════════════════════════════════════
          DESKTOP — fila única con todas las columnas (sm+)
      ══════════════════════════════════════════════════════ */}
      <tr className={`${rowBase} hidden sm:table-row`} onClick={onToggle}>
        {/* Checkbox */}
        <td className="w-10 pl-3 py-2.5 align-top" onClick={e => { e.stopPropagation(); onSelect() }}>
          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
            isSelected ? 'bg-[#0094d9] border-[#0094d9]' : 'border-white/20 group-hover:border-white/40'
          }`}>
            {isSelected && <span className="text-white text-[8px] font-bold">✓</span>}
          </div>
          <span className="mt-2 block text-[11px] font-mono text-slate-600">#{flete.id}</span>
        </td>

        {/* ID */}
        <td className="py-2.5 pl-2 pr-2.5">
          <span className="sr-only">#{flete.id}</span>
        </td>

        {/* Destino + estado */}
        <td className="py-2.5 pr-2 max-w-[150px]">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
            {isConductor ? (
              <span className="text-sm font-semibold text-white truncate">{flete.destino?.nombre ?? '—'}</span>
            ) : (
              <InlineSelect currentId={flete.destino_id} options={destinos} getLabel={o => o.nombre} onSave={saveDestino} placeholder="Sin destino" />
            )}
          </div>
          <span className={`text-[10px] font-medium ${st.text} ml-3`}>{flete.estado}</span>
        </td>

        {/* Solicitar rendición (WA/Email) */}
        <td className="py-2.5 pr-2 w-10 align-middle">
          {isEnCurso && (
            <div className="flex flex-col gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); handleShareWhatsApp() }}
                disabled={sharingLoading}
                className="w-6 h-6 rounded-md border border-green-400/25 bg-green-500/15 text-green-300 hover:bg-green-500/25 flex items-center justify-center disabled:opacity-40"
                title="Solicitar rendición por WhatsApp"
              >
                <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleShareEmail() }}
                disabled={sharingLoading}
                className="w-6 h-6 rounded-md border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 flex items-center justify-center disabled:opacity-40"
                title="Solicitar rendición por correo"
              >
                <EnvelopeIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </td>

        {/* Fechas (Salida/Llegada) */}
        <td className="py-2.5 pr-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-600 w-10 shrink-0">Salida</span>
              <InlineDate value={flete.fecha_salida} onSave={saveFechaSalida} placeholder="—" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-600 w-10 shrink-0">Llegada</span>
              <InlineDate value={flete.fecha_llegada} onSave={saveFechaLlegada} placeholder="—" />
            </div>
          </div>
        </td>

        {/* Cliente / Guía de ruta */}
        <td className="py-2.5 pr-2 max-w-[140px]">
          <div className="space-y-1">
            {isConductor ? (
              <span className="text-xs text-slate-400 truncate block">{flete.cliente_principal?.razon_social ?? '—'}</span>
            ) : (
              <InlineSelect currentId={flete.cliente_principal_id} options={clientes} getLabel={o => o.razon_social} onSave={saveCliente} placeholder="Cliente —" none="— sin cliente —" />
            )}
            <InlineText value={flete.guiaruta} onSave={saveGuia} placeholder="Guía —" />
          </div>
        </td>

        {/* Tracto / Rampla */}
        <td className="py-2.5 pr-2">
          <div className="space-y-1">
            <InlineSelect currentId={flete.tracto_id} options={tractos} getLabel={o => o.patente} onSave={saveTracto} placeholder="Tracto —" />
            <InlineSelect currentId={flete.rampla_id} options={ramplas} getLabel={o => o.patente} onSave={saveRampla} placeholder="Rampla —" />
          </div>
        </td>

        {/* Conductor/Colaborador — oculto si es conductor */}
        {!isConductor && (
          <td className="py-2.5 pr-2">
            <InlineSelect currentId={flete.conductor_id} options={conductores} getLabel={o => o.name} onSave={saveConductor} placeholder="—" />
          </td>
        )}

        {/* Saldo */}
        <td className="py-2.5 pr-2 text-right">
          {saldo !== null ? (
            <span className={`text-xs font-bold ${saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmt(saldo)}</span>
          ) : (
            <span className="text-slate-700 text-xs">—</span>
          )}
        </td>

        {/* Expand */}
        <td className="py-2.5 pr-2 text-right w-6">
          <div className="flex items-center justify-end gap-2">
            <ChevronRightIcon className={`w-3.5 h-3.5 inline-block transition-all text-slate-700 group-hover:text-slate-500 ${
            isExpanded ? 'rotate-90 !text-[#0094d9]' : ''
            }`} />
          </div>
        </td>
      </tr>

      {/* ── Detail panel ─────────────────────────────────────── */}
      {isExpanded && (
        <tr className="border-b border-[#0094d9]/10">
          <td colSpan={10} className="p-0 bg-[#040b18]/60">
            <FleteDetailPanel
              flete={flete}
              actualizarFleteEnLista={update}
              userRoles={userRoles}
            />
          </td>
        </tr>
      )}
    </>
  )
}

export default memo(FleteRow)
