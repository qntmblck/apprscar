// resources/js/Pages/Fletes/FiltrosBar.jsx  (reinventado — compacto)
import React, { useState, useRef, useEffect } from 'react'
import { MagnifyingGlassIcon, XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

/* ── Multi-select dropdown ────────────────────────────────────── */
function MultiDropdown({ label, options, selected, onToggle, getLabel }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const outside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  const hasSelection = selected.length > 0

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
          hasSelection
            ? 'bg-[#0094d9]/15 border-[#0094d9]/30 text-[#0094d9]'
            : 'bg-white/[0.04] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300'
        }`}
      >
        {label}
        {hasSelection && (
          <span className="w-4 h-4 rounded-full bg-[#0094d9] text-white text-[9px] font-bold flex items-center justify-center">
            {selected.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[180px] max-h-56 overflow-y-auto bg-[#0a1628]/95 backdrop-blur border border-white/10 rounded-xl shadow-xl">
          {options.map(opt => {
            const id = String(opt.id)
            const checked = selected.includes(id)
            return (
              <div
                key={id}
                onClick={() => onToggle(id)}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs cursor-pointer transition-colors ${
                  checked ? 'bg-[#0094d9]/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                  checked ? 'bg-[#0094d9] border-[#0094d9]' : 'border-white/20'
                }`}>
                  {checked && <span className="text-white text-[8px] font-bold">✓</span>}
                </div>
                <span className="truncate">{getLabel ? getLabel(opt) : opt.name}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Date range picker ────────────────────────────────────────── */
function DateFilter({ desde, hasta, onChange }) {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState({
    from: desde ? new Date(desde) : undefined,
    to:   hasta ? new Date(hasta) : undefined,
  })
  const ref = useRef(null)

  useEffect(() => {
    const outside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  const hasDate = !!desde || !!hasta
  const label = 'Fecha'

  const apply = () => {
    const addDay = d => {
      const x = new Date(d)
      x.setDate(x.getDate() + 1)
      return x.toISOString().slice(0, 10)
    }
    onChange({
      desde: range.from ? addDay(range.from) : '',
      hasta: range.to   ? addDay(range.to)   : '',
    })
    setOpen(false)
  }

  const clear = () => {
    setRange({ from: undefined, to: undefined })
    onChange({ desde: '', hasta: '' })
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
          hasDate
            ? 'bg-[#0094d9]/15 border-[#0094d9]/30 text-[#0094d9]'
            : 'bg-white/[0.04] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300'
        }`}
      >
        <CalendarDaysIcon className="w-3.5 h-3.5" />
        {label}
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
            <button onClick={clear} className="text-[10px] text-slate-500 hover:text-red-400 transition-colors">
              Limpiar
            </button>
            <button onClick={apply} className="text-[10px] text-[#0094d9] font-semibold hover:text-white transition-colors">
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main FiltrosBar ──────────────────────────────────────────── */
export default function FiltrosBar({
  search,
  onSearch,
  data,
  conductores,
  clientes,
  destinos,
  handleToggleMultiSelect,
  onDateChange,
  hasFilters,
  onClear,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Text search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Buscar destino, cliente…"
          className="w-full pl-8 pr-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#0094d9]/40"
        />
        {search && (
          <button onClick={() => onSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2">
            <XMarkIcon className="w-3 h-3 text-slate-500 hover:text-slate-300" />
          </button>
        )}
      </div>

      {/* Conductor */}
      <MultiDropdown
        label="Conductor"
        options={conductores}
        selected={data.conductor_ids.map(String)}
        onToggle={id => handleToggleMultiSelect('conductor_ids', id)}
        getLabel={o => o.name}
      />

      {/* Cliente */}
      <MultiDropdown
        label="Cliente"
        options={clientes}
        selected={data.cliente_ids.map(String)}
        onToggle={id => handleToggleMultiSelect('cliente_ids', id)}
        getLabel={o => o.razon_social}
      />

      {/* Destino */}
      <MultiDropdown
        label="Destino"
        options={destinos}
        selected={data.destino_ids.map(String)}
        onToggle={id => handleToggleMultiSelect('destino_ids', id)}
        getLabel={o => o.nombre}
      />

      {/* Date range */}
      <DateFilter
        desde={data.fecha_desde}
        hasta={data.fecha_hasta}
        onChange={onDateChange}
      />

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1.5"
        >
          <XMarkIcon className="w-3.5 h-3.5" />
          Limpiar
        </button>
      )}
    </div>
  )
}
