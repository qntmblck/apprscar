// resources/js/Pages/Fletes/Index.jsx  (reinventado)
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, usePage, router } from '@inertiajs/react'
import axios from 'axios'
import { saveAs } from 'file-saver'
import {
  TruckIcon, PlusIcon, CheckCircleIcon, XMarkIcon,
  DocumentArrowDownIcon, ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline'
import FiltrosBar from './FiltrosBar'
import FleteRow   from './FleteRow'
import { quickCreateFlete } from './QuickCreate'

/* ─── Status tabs ─────────────────────────────────────────────── */
const ESTADOS = ['Todos', 'En curso', 'Rendido', 'Aprobado', 'Pagado']

const ESTADO_COLORS = {
  'En curso': 'text-[#0094d9] bg-[#0094d9]/10 border-[#0094d9]/25',
  'Rendido':  'text-amber-300 bg-amber-500/10 border-amber-400/25',
  'Aprobado': 'text-emerald-300 bg-emerald-500/10 border-emerald-400/25',
  'Pagado':   'text-violet-300 bg-violet-500/10 border-violet-400/25',
  'Todos':    'text-slate-300 bg-white/5 border-white/10',
}

/* ─── Quick-create drawer ─────────────────────────────────────── */
function CreateDrawer({ conductores, colaboradores, clientes, destinos, tractos, onCreated, onClose }) {
  const [form, setForm] = useState({
    destino_id: '', cliente_principal_id: '', conductor_id: '', colaborador_id: '', tracto_id: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const sel = 'w-full bg-white/[0.04] border border-white/10 rounded-lg text-xs text-slate-300 px-3 py-2 focus:outline-none focus:border-[#0094d9]/50'

  const handleCreate = async () => {
    if (!form.destino_id || !form.conductor_id) {
      setError('Destino y conductor son obligatorios.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await quickCreateFlete(
        form,
        () => {},           // setSuccessMensaje — handled by onCreated
        (msg) => setError(msg)
      )
      onCreated()
    } catch (e) {
      // error already set by quickCreateFlete callback
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-[#060d1b] border-l border-white/10 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <p className="text-[10px] font-semibold text-[#0094d9] uppercase tracking-widest">Nuevo</p>
            <h2 className="text-base font-bold text-white">Crear flete</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {[
            { label: 'Destino *',   key: 'destino_id',          opts: destinos,      getLabel: o => o.nombre },
            { label: 'Conductor *', key: 'conductor_id',          opts: conductores,   getLabel: o => o.name },
            { label: 'Cliente',     key: 'cliente_principal_id',  opts: clientes,      getLabel: o => o.razon_social },
            { label: 'Colaborador', key: 'colaborador_id',        opts: colaboradores, getLabel: o => o.name },
            { label: 'Tracto',      key: 'tracto_id',             opts: tractos,       getLabel: o => o.patente },
          ].map(({ label, key, opts, getLabel }) => (
            <div key={key}>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</label>
              <select value={form[key]} onChange={e => set(key, e.target.value)} className={sel}>
                <option value="">— Seleccionar —</option>
                {opts.map(o => <option key={o.id} value={o.id}>{getLabel(o)}</option>)}
              </select>
            </div>
          ))}

          {error && (
            <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/8">
          <button
            onClick={handleCreate}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0094d9] hover:bg-[#007ab8] text-white font-bold text-sm transition-colors disabled:opacity-60"
          >
            {saving ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PlusIcon className="w-4 h-4" />}
            {saving ? 'Creando…' : 'Crear flete'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main page ───────────────────────────────────────────────── */
export default function Index({
  auth,
  fletes: paginatedFletes,
  filters,
  conductores,
  colaboradores,
  clientes,
  tractos,
  destinos,
  ramplas = [],
  guias   = [],
}) {
  const { csrf_token } = usePage().props
  useEffect(() => {
    if (csrf_token) axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token
  }, [csrf_token])

  // ── Filtros state (ya no useForm — usamos router.get directamente)
  const [data, setDataRaw] = useState({
    conductor_ids:    filters.conductor_ids    || [],
    colaborador_ids:  filters.colaborador_ids  || [],
    cliente_ids:      filters.cliente_ids      || [],
    tracto_ids:       filters.tracto_ids       || [],
    destino_ids:      filters.destino_ids      || [],
    fecha_desde:      filters.fecha_desde      || '',
    fecha_hasta:      filters.fecha_hasta      || '',
    notificar_estado: filters.notificar_estado || '',
  })

  const setData = useCallback((keyOrFn, val) => {
    if (typeof keyOrFn === 'function') {
      setDataRaw(keyOrFn)
    } else {
      setDataRaw(prev => ({ ...prev, [keyOrFn]: val }))
    }
  }, [])

  // Navegar con filtros usando router.get (acepta data como 2do argumento)
  const applyFilters = useCallback((params, opts = {}) => {
    router.get('/fletes', params, { preserveState: true, preserveScroll: false, ...opts })
  }, [])

  // ── Local state ───────────────────────────────────────────────
  const [fletesState, setFletesState]           = useState(paginatedFletes.data ?? [])
  const [expandedId, setExpandedId]             = useState(null)
  const [openForm, setOpenForm]                 = useState({})
  const [selectedIds, setSelectedIds]           = useState([])
  const [search, setSearch]                     = useState('')
  const [createOpen, setCreateOpen]             = useState(false)
  const [isLoadingResumen, setIsLoadingResumen] = useState(false)
  const [isLoadingLiquidar, setIsLoadingLiquidar] = useState(false)
  const [toast, setToast]                       = useState(null)

  // Sync when server sends new data
  useEffect(() => { setFletesState(paginatedFletes.data ?? []) }, [paginatedFletes])

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Estado tab activo ─────────────────────────────────────────
  const activeEstado = data.notificar_estado || 'Todos'

  const setEstado = useCallback((estado) => {
    const val = estado === 'Todos' ? '' : estado
    setData('notificar_estado', val)
    setExpandedId(null)
    setSelectedIds([])
    applyFilters({ ...data, notificar_estado: val, page: 1 }, { preserveState: false })
  }, [data, setData, applyFilters])

  // ── Filtros handlers ──────────────────────────────────────────
  const handleToggleMultiSelect = useCallback((name, id) => {
    const arr = Array.from(data[name] || [])
    const idx = arr.indexOf(String(id))
    if (idx === -1) { arr.push(String(id)) } else { arr.splice(idx, 1) }
    setData(name, arr)
    applyFilters({ ...data, [name]: arr })
  }, [data, setData, applyFilters])

  const handleDateChange = useCallback(({ desde, hasta }) => {
    setData(d => ({ ...d, fecha_desde: desde, fecha_hasta: hasta }))
    applyFilters({ ...data, fecha_desde: desde, fecha_hasta: hasta })
  }, [data, setData, applyFilters])

  const handleClear = useCallback(() => {
    const reset = {
      conductor_ids: [], colaborador_ids: [], cliente_ids: [],
      tracto_ids: [], destino_ids: [], fecha_desde: '', fecha_hasta: '',
      notificar_estado: data.notificar_estado,
    }
    setDataRaw(reset)
    setSearch('')
    applyFilters(reset, { preserveState: false })
  }, [data.notificar_estado, setDataRaw, applyFilters])

  const hasFilters = useMemo(() =>
    data.destino_ids.length > 0 || data.cliente_ids.length > 0 ||
    data.conductor_ids.length > 0 || data.colaborador_ids.length > 0 ||
    data.tracto_ids.length > 0 || !!data.fecha_desde || !!data.fecha_hasta || !!search,
    [data, search]
  )

  // ── Client-side text search ───────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return fletesState
    const q = search.toLowerCase()
    return fletesState.filter(f =>
      f.destino?.nombre?.toLowerCase().includes(q) ||
      f.cliente_principal?.razon_social?.toLowerCase().includes(q) ||
      f.cliente_nombre?.toLowerCase().includes(q) ||
      f.conductor?.name?.toLowerCase().includes(q) ||
      f.tracto?.patente?.toLowerCase().includes(q) ||
      String(f.id).includes(q)
    )
  }, [fletesState, search])

  // ── Flete mutations ───────────────────────────────────────────
  const actualizarFleteEnLista = useCallback(f => {
    setFletesState(prev => prev.map(x => x.id === f.id ? f : x))
  }, [])

  const handleToggleForm = useCallback((fleteId, tipo) =>
    setOpenForm(prev => ({ ...prev, [fleteId]: prev[fleteId] === tipo ? null : tipo })), [])

  const handleCloseForm = useCallback((fleteId) =>
    setOpenForm(prev => ({ ...prev, [fleteId]: null })), [])

  const handleUpdateKilometraje = useCallback(async (fleteId, km) => {
    try {
      const res = await axios.post(`/fletes/${fleteId}/kilometraje`, { kilometraje: km })
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
    } catch (e) { console.error(e) }
  }, [actualizarFleteEnLista])

  const submitForm = useCallback(async (url, payload, fleteId) => {
    const formData = new FormData()
    Object.entries(payload).forEach(([k, v]) => formData.append(k, v))
    try {
      const res = await axios.post(url, formData)
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
      return res
    } catch (err) { console.error(err); throw err }
  }, [actualizarFleteEnLista])

  const eliminarRegistro = useCallback(async (registroId) => {
    if (!confirm('¿Eliminar este registro?')) return
    try {
      const res = await axios.delete(`/registro/${registroId}`)
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
    } catch (e) { console.error(e) }
  }, [actualizarFleteEnLista])

  // ── Edit handlers — devuelven la respuesta para que FleteRow la use ──
  const onSelectDestino = useCallback(async (id, opt) => {
    try {
      const res = await axios.post(`/fletes/${id}/destino`, opt)
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
      return res
    } catch(e) { console.error(e) }
  }, [actualizarFleteEnLista])

  const onSelectCliente = useCallback(async (id, opt) => {
    try {
      const res = await axios.post(`/fletes/${id}/cliente`, opt)
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
      return res
    } catch(e) { console.error(e) }
  }, [actualizarFleteEnLista])

  const onSelectTitular = useCallback(async (id, opt) => {
    try {
      const res = await axios.post(`/fletes/${id}/titular`, opt)
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
      return res
    } catch(e) { console.error(e) }
  }, [actualizarFleteEnLista])

  const onSelectTracto = useCallback(async (id, opt) => {
    try {
      const res = await axios.post(`/fletes/${id}/tracto`, opt)
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
      return res
    } catch(e) { console.error(e) }
  }, [actualizarFleteEnLista])

  const onSelectRampla = useCallback(async (id, opt) => {
    try {
      const res = await axios.post(`/fletes/${id}/rampla`, opt)
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
      return res
    } catch(e) { console.error(e) }
  }, [actualizarFleteEnLista])

  const onSelectGuiaRuta = useCallback(async (id, text) => {
    try {
      const res = await axios.post(`/fletes/${id}/guiaruta`, { guiaruta: text })
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
      return res
    } catch(e) { console.error(e) }
  }, [actualizarFleteEnLista])

  const onSelectFechaSalida = useCallback(async (id, date) => {
    try {
      // date viene como Date object del InlineDate; corregimos zona horaria
      const corrected = new Date(date); corrected.setDate(corrected.getDate() + 1)
      const res = await axios.post(`/fletes/${id}/fecha-salida`, { fecha_salida: corrected.toISOString().slice(0,10) })
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
      return res
    } catch(e) { console.error(e) }
  }, [actualizarFleteEnLista])

  const onSelectFechaLlegada = useCallback(async (id, date) => {
    try {
      const corrected = new Date(date); corrected.setDate(corrected.getDate() + 1)
      const res = await axios.post(`/fletes/${id}/fecha-llegada`, { fecha_llegada: corrected.toISOString().slice(0,10) })
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
      return res
    } catch(e) { console.error(e) }
  }, [actualizarFleteEnLista])

  // ── Selection ─────────────────────────────────────────────────
  const toggleSelect = useCallback((id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }, [])

  const handleSelectAll = () => setSelectedIds(filtered.map(f => f.id))
  const handleClearSel  = () => setSelectedIds([])

  // ── Batch actions ─────────────────────────────────────────────
  const handleDownloadSpreadsheet = useCallback(async () => {
    try {
      const res = await axios.post('/fletes/batch/export', { ids: selectedIds }, { responseType: 'blob' })
      saveAs(res.data, 'fletes.xlsx')
    } catch(e) { showToast('Error al exportar.', 'err') }
  }, [selectedIds])

  const handleResumenPdf = useCallback(async () => {
    setIsLoadingResumen(true)
    try {
      const res = await axios.post('/pagos/resumen', { ids: selectedIds }, { responseType: 'blob' })
      if (res.data.type === 'application/json') {
        const text = await res.data.text()
        showToast(JSON.parse(text).message ?? 'Sin datos', 'err')
      } else {
        saveAs(res.data, 'resumen.pdf')
      }
    } catch(e) { showToast('Error al generar resumen.', 'err') }
    finally { setIsLoadingResumen(false) }
  }, [selectedIds])

  const handleLiquidar = useCallback(async () => {
    setIsLoadingLiquidar(true)
    try {
      const res = await axios.post('/pagos/liquidar', { ids: selectedIds }, { responseType: 'blob' })
      if (res.data.type === 'application/json') {
        const text = await res.data.text()
        showToast(JSON.parse(text).message ?? 'Sin datos', 'err')
      } else {
        saveAs(res.data, 'liquidacion.pdf')
        showToast('Liquidación generada.')
      }
    } catch(e) { showToast('Error al liquidar.', 'err') }
    finally { setIsLoadingLiquidar(false) }
  }, [selectedIds])

  // ── Pagination ────────────────────────────────────────────────
  const { current_page, last_page } = paginatedFletes

  const goPage = (page) => {
    applyFilters({ ...data, page })
    setExpandedId(null)
  }

  // ── Stats from paginated meta ─────────────────────────────────
  const total = paginatedFletes.total ?? filtered.length

  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Fletes" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium transition-all ${
          toast.type === 'ok'
            ? 'bg-emerald-900/90 border-emerald-500/30 text-emerald-300'
            : 'bg-red-900/90 border-red-500/30 text-red-300'
        }`}>
          {toast.type === 'ok' ? <CheckCircleIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Create Drawer */}
      {createOpen && (
        <CreateDrawer
          conductores={conductores}
          colaboradores={colaboradores}
          clientes={clientes}
          destinos={destinos}
          tractos={tractos}
          onCreated={() => {
            setCreateOpen(false)
            applyFilters({ ...data, page: 1 }, { preserveState: false })
          }}
          onClose={() => setCreateOpen(false)}
        />
      )}

      {/* Floating batch bar */}
      {selectedIds.length > 0 && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-1.5 bg-[#0c1e3a]/95 backdrop-blur border border-[#0094d9]/30 shadow-xl rounded-xl px-3 py-1.5">
            <span className="text-[10px] font-semibold text-[#0094d9] mr-1">
              {selectedIds.length} seleccionado{selectedIds.length !== 1 ? 's' : ''}
            </span>
            <button onClick={handleClearSel}  title="Limpiar"        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><XMarkIcon            className="w-4 h-4 text-slate-400" /></button>
            <button onClick={handleSelectAll} title="Seleccionar todo" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><CheckCircleIcon       className="w-4 h-4 text-[#0094d9]" /></button>
            <button onClick={handleDownloadSpreadsheet} title="Exportar Excel" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><DocumentArrowDownIcon className="w-4 h-4 text-emerald-400" /></button>
            <button onClick={handleResumenPdf} disabled={isLoadingResumen}
              className="px-2.5 py-1 text-xs font-semibold bg-[#0094d9]/20 hover:bg-[#0094d9]/40 text-[#0094d9] rounded-lg transition-colors disabled:opacity-50">
              {isLoadingResumen ? 'Resumiendo…' : 'Resumir'}
            </button>
            <button onClick={handleLiquidar} disabled={isLoadingLiquidar}
              className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/25 text-emerald-300 rounded-lg transition-colors disabled:opacity-50">
              {isLoadingLiquidar ? 'Liquidando…' : 'Liquidar'}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-4">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold text-[#0094d9] uppercase tracking-widest mb-0.5 flex items-center gap-1">
              <TruckIcon className="w-3 h-3" /> Operaciones
            </p>
            <h1 className="text-xl font-extrabold text-white">Fletes</h1>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-[#0094d9] hover:bg-[#007ab8] text-white transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Nuevo
          </button>
        </div>

        {/* ── Status tabs ────────────────────────────────────── */}
        <div className="flex gap-1.5 flex-wrap">
          {ESTADOS.map(e => (
            <button
              key={e}
              onClick={() => setEstado(e)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition-colors ${
                activeEstado === e
                  ? ESTADO_COLORS[e]
                  : 'text-slate-500 bg-transparent border-transparent hover:text-slate-300 hover:border-white/10'
              }`}
            >
              {e}
            </button>
          ))}
          <span className="ml-auto text-[10px] text-slate-600 self-center">{total} flete{total !== 1 ? 's' : ''}</span>
        </div>

        {/* ── Filters ────────────────────────────────────────── */}
        <FiltrosBar
          search={search}
          onSearch={setSearch}
          data={data}
          conductores={conductores}
          clientes={clientes}
          destinos={destinos}
          handleToggleMultiSelect={handleToggleMultiSelect}
          onDateChange={handleDateChange}
          hasFilters={hasFilters}
          onClear={handleClear}
        />

        {/* ── Table ──────────────────────────────────────────── */}
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/8 text-[9px] font-semibold text-cyan-300/90 uppercase tracking-wide">
                  {/* Checkbox all */}
                  <th className="w-10 pl-3 py-2.5">
                    <div
                      onClick={selectedIds.length === filtered.length && filtered.length > 0 ? handleClearSel : handleSelectAll}
                      className={`w-3.5 h-3.5 rounded border cursor-pointer flex items-center justify-center transition-colors ${
                        selectedIds.length === filtered.length && filtered.length > 0
                          ? 'bg-[#0094d9] border-[#0094d9]'
                          : 'border-white/15 hover:border-white/30'
                      }`}
                    >
                      {selectedIds.length === filtered.length && filtered.length > 0 && (
                        <span className="text-white text-[8px] font-bold">✓</span>
                      )}
                    </div>
                  </th>
                  <th className="py-2.5 pl-2 pr-2.5">#</th>
                  <th className="py-2.5 pr-2">Destino / Estado</th>
                  <th className="py-2.5 pr-2 w-10" />
                  <th className="py-2.5 pr-2 hidden sm:table-cell">Fechas</th>
                  <th className="py-2.5 pr-2 hidden sm:table-cell">Cliente / Guía</th>
                  <th className="py-2.5 pr-2 hidden lg:table-cell">Tracto / Rampla</th>
                  <th className="py-2.5 pr-2 hidden md:table-cell">Conductor</th>
                  <th className="py-2.5 pr-2 text-right hidden lg:table-cell">Saldo</th>
                  <th className="py-2.5 pr-2 w-6" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-20 text-center">
                      <TruckIcon className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm font-medium">Sin fletes para mostrar</p>
                      <p className="text-slate-700 text-xs mt-1">
                        {hasFilters ? 'Prueba ajustando los filtros.' : 'Crea el primer flete con el botón Nuevo.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map(flete => (
                    <FleteRow
                      key={flete.id}
                      flete={flete}
                      isExpanded={expandedId === flete.id}
                      onToggle={() => setExpandedId(p => p === flete.id ? null : flete.id)}
                      isSelected={selectedIds.includes(flete.id)}
                      onSelect={() => toggleSelect(flete.id)}
                      openForm={openForm}
                      handleToggleForm={handleToggleForm}
                      handleCloseForm={handleCloseForm}
                      actualizarFleteEnLista={actualizarFleteEnLista}
                      submitForm={submitForm}
                      onEliminarRegistro={eliminarRegistro}
                      onUpdateKilometraje={handleUpdateKilometraje}
                      userRoles={auth?.roles ?? []}
                      conductores={conductores}
                      colaboradores={colaboradores}
                      clientes={clientes}
                      tractos={tractos}
                      destinos={destinos}
                      ramplas={ramplas}
                      guias={guias}
                      onSelectDestino={onSelectDestino}
                      onSelectCliente={onSelectCliente}
                      onSelectTitular={onSelectTitular}
                      onSelectTracto={onSelectTracto}
                      onSelectRampla={onSelectRampla}
                      onSelectGuiaRuta={onSelectGuiaRuta}
                      onSelectFechaSalida={onSelectFechaSalida}
                      onSelectFechaLlegada={onSelectFechaLlegada}
                      selectedIds={selectedIds}
                      toggleSelect={toggleSelect}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ─────────────────────────────────── */}
          {last_page > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/8">
              <span className="text-[11px] text-slate-600">
                Página {current_page} de {last_page}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goPage(current_page - 1)}
                  disabled={current_page === 1}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>

                {/* Page numbers (show up to 7) */}
                {Array.from({ length: last_page }, (_, i) => i + 1)
                  .filter(p => Math.abs(p - current_page) <= 3 || p === 1 || p === last_page)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('…')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((item, i) =>
                    item === '…'
                      ? <span key={`dot-${i}`} className="text-slate-600 text-xs px-1">…</span>
                      : <button
                          key={item}
                          onClick={() => goPage(item)}
                          className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                            item === current_page
                              ? 'bg-[#0094d9] text-white'
                              : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                          }`}
                        >
                          {item}
                        </button>
                  )
                }

                <button
                  onClick={() => goPage(current_page + 1)}
                  disabled={current_page === last_page}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-colors"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
