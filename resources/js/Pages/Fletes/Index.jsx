// resources/js/Pages/Fletes/Index.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, usePage } from '@inertiajs/react'
import axios from 'axios'
import FiltrosBar from './FiltrosBar'
import FleteList from './FleteList'
import Pagination from './Pagination'
import { quickCreateFlete } from './QuickCreate'

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
  guias = [],
}) {
  const { csrf_token } = usePage().props
  useEffect(() => {
    if (csrf_token) axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token
  }, [csrf_token])

  // Form de filtros
  const { data, setData, get } = useForm({
    conductor_ids:   filters.conductor_ids   || [],
    colaborador_ids: filters.colaborador_ids || [],
    cliente_ids:     filters.cliente_ids     || [],
    tracto_ids:      filters.tracto_ids      || [],
    destino:         filters.destino         || '',
    fecha_desde:     filters.fecha_desde     || '',
    fecha_hasta:     filters.fecha_hasta     || '',
  })

  // Estado local
  const [suggestions, setSuggestions]       = useState([])
  const [range, setRange]                   = useState({
    from: filters.fecha_desde ? new Date(filters.fecha_desde) : undefined,
    to:   filters.fecha_hasta ? new Date(filters.fecha_hasta) : undefined,
  })
  const [fletesState, setFletesState]       = useState([])
  const [openForm, setOpenForm]             = useState({})
  const [errorMensaje, setErrorMensaje]     = useState(null)
  const [successMensaje, setSuccessMensaje] = useState(null)
  const [activeTab, setActiveTab]           = useState('')
  const [showAll, setShowAll]               = useState(false)

  // Flags para UI
  const hasDest    = data.destino.trim() !== ''
  const hasClient  = data.cliente_ids.length === 1
  const tooManyMulti =
    data.cliente_ids.length > 1 ||
    data.tracto_ids.length > 1 ||
    data.conductor_ids.length > 1 ||
    data.colaborador_ids.length > 1
  const hasFilters =
    hasDest ||
    data.cliente_ids.length > 0 ||
    data.tracto_ids.length > 0 ||
    data.conductor_ids.length > 0 ||
    data.colaborador_ids.length > 0 ||
    data.fecha_desde !== ''

  // Sincronizar lista de fletes al cargar datos
  useEffect(() => {
    const lista = paginatedFletes.data || []
    lista.sort((a, b) => new Date(b.fecha_salida) - new Date(a.fecha_salida))
    setFletesState(lista)
  }, [paginatedFletes])

  // Refetch al cambiar filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      get(route('fletes.index'), { preserveState: true, data })
    }, 300)
    return () => clearTimeout(timer)
  }, [data, get])

  // Para cerrar dropdowns de filtro al click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (!activeTab) return
      if (
        e.target.closest(`[data-toggle-type="${activeTab}"]`) ||
        e.target.closest(`[data-dropdown-type="${activeTab}"]`)
      ) return
      setActiveTab('')
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeTab])

  // Handler rango fechas
  const handleRangeSelect = useCallback(r => {
    if (r?.from && !r.to) setRange({ from: r.from, to: r.from })
    else setRange(r || { from: undefined, to: undefined })
  }, [])

  // Abrir/cerrar formularios en cada tarjeta
  const handleToggleForm = useCallback((id, tipo) => {
    setOpenForm(prev => ({ ...prev, [id]: prev[id] === tipo ? null : tipo }))
  }, [])
  const handleCloseForm = useCallback(id => {
    setOpenForm(prev => ({ ...prev, [id]: null }))
  }, [])

  // Multi-select en filtros
  const handleToggleMultiSelect = useCallback((name, id) => {
    const arr = Array.from(data[name] || [])
    const idx = arr.indexOf(String(id))
    if (idx === -1) arr.push(String(id))
    else arr.splice(idx, 1)
    setData(name, arr)
  }, [data, setData])

  // Actualizar un flete en la lista tras cambios
  const actualizarFleteEnLista = useCallback(f => {
    setFletesState(prev => prev.map(x => (x.id === f.id ? f : x)))
  }, [])

  // Envío de formularios (diesel, gastos, etc.)
  const submitForm = useCallback(async (ruta, payload, onSuccess, onError) => {
    try {
      const res = payload instanceof FormData
        ? await axios.post(ruta, payload, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await axios.post(ruta, payload)
      onSuccess?.(res.data.flete)
      return res
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Error procesando formulario'
      setErrorMensaje(msg)
      onError?.()
      throw err
    }
  }, [])

  // Eliminar registro (abono/gasto/etc.)
  const eliminarRegistro = useCallback(async id => {
    try {
      const res = await axios.delete(`/registro/${id}`)
      if (res.data.flete) actualizarFleteEnLista(res.data.flete)
    } catch {
      setErrorMensaje('No se pudo eliminar el registro.')
    }
  }, [actualizarFleteEnLista])

  // Limpiar filtros
  const handleClear = useCallback(() => {
    setData({
      conductor_ids: [], colaborador_ids: [], cliente_ids: [],
      tracto_ids: [], destino: '', fecha_desde: '', fecha_hasta: ''
    })
    setRange({ from: undefined, to: undefined })
    setShowAll(false)
    get(route('fletes.index'), { preserveState: true, data: {} })
  }, [setData, get])

  // Crear flete rápido
  const handleCreateClick = async () => {
    if (!(hasDest && hasClient) || tooManyMulti) {
      setErrorMensaje('Seleccione cliente y destino.')
      setSuccessMensaje(null)
      return
    }
    try {
      await quickCreateFlete(data, destinos, tractos, setSuccessMensaje, setErrorMensaje)
      get(route('fletes.index'), { preserveState: true, data })
    } catch {
      // errorMensaje ya viene seteado
    }
  }

  // Toggle mostrar todos
  useEffect(() => {
    const toggle = () => setShowAll(prev => !prev)
    window.addEventListener('toggleShowAll', toggle)
    return () => window.removeEventListener('toggleShowAll', toggle)
  }, [])

  // Handlers para dropdowns internos de FleteCard
  const onSelectTitular     = useCallback(opt => console.log('Titular:', opt), [])
  const onSelectFechaSalida = useCallback(date => console.log('Fecha salida:', date), [])
  const onSelectTracto      = useCallback(opt => console.log('Tracto:', opt), [])
  const onSelectRampla      = useCallback(opt => console.log('Rampla:', opt), [])
  const onSelectGuiaRuta    = useCallback(text => console.log('Guía/Ruta:', text), [])

  // Paginación
  const { current_page, last_page, prev_page_url, next_page_url, per_page } = paginatedFletes

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Fletes" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-2">
        {successMensaje && (
          <div className="text-green-700 bg-green-100 border border-green-200 rounded p-2 text-sm">
            {successMensaje}
          </div>
        )}
        {errorMensaje && (
          <div className="text-red-700 bg-red-100 border border-red-200 rounded p-2 text-sm">
            {errorMensaje}
          </div>
        )}
      </div>

      <FiltrosBar
        data={data}
        setData={setData}
        range={range}
        setRange={setRange}
        get={get}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
        clientes={clientes}
        conductores={conductores}
        colaboradores={colaboradores}
        tractos={tractos}
        destinos={destinos}
        handleToggleMultiSelect={handleToggleMultiSelect}
        handleCreateClick={handleCreateClick}
        handleClear={handleClear}
        errorMensaje={errorMensaje}
        hasDest={hasDest}
        hasClient={hasClient}
        tooManyMulti={tooManyMulti}
        hasFilters={hasFilters}
        handleRangeSelect={handleRangeSelect}
      />

      {/* LISTA DE TARJETAS */}
      <FleteList
        fletesState={fletesState}
        openForm={openForm}
        showAll={showAll}
        onToggleShowAll={() => window.dispatchEvent(new CustomEvent('toggleShowAll'))}
        handleToggleForm={handleToggleForm}
        handleCloseForm={handleCloseForm}
        actualizarFleteEnLista={actualizarFleteEnLista}
        submitForm={submitForm}
        onEliminarRegistro={eliminarRegistro}
      />

      <Pagination
        current_page={current_page}
        last_page={last_page}
        prev_page_url={prev_page_url}
        next_page_url={next_page_url}
        get={get}
        data={data}
      />
    </AuthenticatedLayout>
  )
}
