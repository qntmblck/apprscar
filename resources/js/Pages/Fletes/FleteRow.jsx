// resources/js/Pages/Fletes/FleteRow.jsx
import React, { useState, useRef, useEffect, memo, useCallback } from 'react'
import FleteDetailPanel from './FleteDetailPanel'
import { ChevronRightIcon, PencilIcon } from '@heroicons/react/24/outline'

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
  tractos,
  destinos,
  ramplas,
  guias,
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

  // ── Inline save handlers ─────────────────────────────────────
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

  return (
    <>
      {/* ── Row ──────────────────────────────────────────────── */}
      <tr
        onClick={onToggle}
        className={`group border-b border-white/[0.04] transition-colors ${
          isExpanded
            ? 'bg-[#0094d9]/[0.07] border-b-[#0094d9]/20'
            : 'hover:bg-white/[0.025] cursor-pointer'
        }`}
      >
        {/* Checkbox */}
        <td className="w-8 pl-4 py-2.5" onClick={e => { e.stopPropagation(); onSelect() }}>
          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
            isSelected ? 'bg-[#0094d9] border-[#0094d9]' : 'border-white/20 group-hover:border-white/40'
          }`}>
            {isSelected && <span className="text-white text-[8px] font-bold">✓</span>}
          </div>
        </td>

        {/* ID */}
        <td className="py-2.5 pl-2 pr-3">
          <span className="text-[11px] font-mono text-slate-600">#{flete.id}</span>
        </td>

        {/* Destino + estado */}
        <td className="py-2.5 pr-3 max-w-[160px]">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
            <span className="text-sm font-semibold text-white truncate">
              {flete.destino?.nombre ?? '—'}
            </span>
          </div>
          <span className={`text-[10px] font-medium ${st.text} ml-3`}>{flete.estado}</span>
        </td>

        {/* Cliente */}
        <td className="py-2.5 pr-3 max-w-[150px] hidden sm:table-cell">
          <span className="text-xs text-slate-400 truncate block">
            {flete.cliente_principal?.razon_social ?? flete.cliente_nombre ?? '—'}
          </span>
        </td>

        {/* Conductor — editable */}
        <td className="py-2.5 pr-3 hidden md:table-cell" onClick={e => e.stopPropagation()}>
          <InlineSelect
            currentId={flete.conductor_id}
            options={conductores}
            getLabel={o => o.name}
            onSave={saveConductor}
            placeholder="Sin conductor"
          />
        </td>

        {/* Tracto — editable */}
        <td className="py-2.5 pr-3 hidden lg:table-cell" onClick={e => e.stopPropagation()}>
          <InlineSelect
            currentId={flete.tracto_id}
            options={tractos}
            getLabel={o => o.patente}
            onSave={saveTracto}
            placeholder="—"
          />
        </td>

        {/* Rampla — editable */}
        <td className="py-2.5 pr-3 hidden xl:table-cell" onClick={e => e.stopPropagation()}>
          <InlineSelect
            currentId={flete.rampla_id}
            options={ramplas}
            getLabel={o => o.patente}
            onSave={saveRampla}
            placeholder="—"
          />
        </td>

        {/* Guía de ruta — editable */}
        <td className="py-2.5 pr-3 hidden xl:table-cell" onClick={e => e.stopPropagation()}>
          <InlineText
            value={flete.guiaruta}
            onSave={saveGuia}
            placeholder="—"
          />
        </td>

        {/* Fecha salida — editable */}
        <td className="py-2.5 pr-3 hidden sm:table-cell" onClick={e => e.stopPropagation()}>
          <InlineDate value={flete.fecha_salida} onSave={saveFechaSalida} placeholder="—" />
        </td>

        {/* Fecha llegada — editable */}
        <td className="py-2.5 pr-3 hidden md:table-cell" onClick={e => e.stopPropagation()}>
          <InlineDate value={flete.fecha_llegada} onSave={saveFechaLlegada} placeholder="—" />
        </td>

        {/* Saldo */}
        <td className="py-2.5 pr-3 text-right hidden lg:table-cell">
          {saldo !== null ? (
            <span className={`text-xs font-bold ${saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {fmt(saldo)}
            </span>
          ) : (
            <span className="text-slate-700 text-xs">—</span>
          )}
        </td>

        {/* Expand */}
        <td className="py-2.5 pr-3 text-right w-6">
          <ChevronRightIcon className={`w-3.5 h-3.5 inline-block transition-all text-slate-700 group-hover:text-slate-500 ${
            isExpanded ? 'rotate-90 !text-[#0094d9]' : ''
          }`} />
        </td>
      </tr>

      {/* ── Detail panel ─────────────────────────────────────── */}
      {isExpanded && (
        <tr className="border-b border-[#0094d9]/10">
          <td colSpan={12} className="p-0 bg-[#040b18]/60">
            <FleteDetailPanel
              flete={flete}
              openForm={openForm}
              handleToggleForm={handleToggleForm}
              handleCloseForm={handleCloseForm}
              actualizarFleteEnLista={update}
              submitForm={submitForm}
              onEliminarRegistro={onEliminarRegistro}
              onUpdateKilometraje={onUpdateKilometraje}
            />
          </td>
        </tr>
      )}
    </>
  )
}

export default memo(FleteRow)
