// resources/js/Pages/Fletes/Index.jsx
import React, { useState, useEffect, useCallback } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, usePage } from '@inertiajs/react'
import axios from 'axios'
import { saveAs } from 'file-saver'
import { ArrowPathIcon, DocumentArrowDownIcon, CheckCircleIcon } from '@heroicons/react/20/solid'
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
    if (csrf_token) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token
    }
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

  // Estado de selección de fletes
  const [selectedIds, setSelectedIds]         = useState([])
  const [isLoadingResumen, setIsLoadingResumen] = useState(false)
  const [isLoadingLiquidar, setIsLoadingLiquidar] = useState(false)

  // Flags para UI
  const hasDest    = data.destino.trim() !== ''
  const hasClient  = data.cliente_ids.length === 1
  const tooManyMulti =
    data.cliente_ids.length > 1 ||
    data.tracto_ids.length  > 1 ||
    data.conductor_ids.length > 1 ||
    data.colaborador_ids.length > 1
  const hasFilters =
    hasDest ||
    data.cliente_ids.length > 0 ||
    data.tracto_ids.length > 0 ||
    data.conductor_ids.length > 0 ||
    data.colaborador_ids.length > 0 ||
    data.fecha_desde !== ''

  // Sincronizar lista de fletes
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

  // Cerrar dropdowns al click fuera
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

  // Formularios en tarjetas
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

  // Toggle selección individual
  const toggleSelect = useCallback(id => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }, [])

  // Seleccionar todos los fletes filtrados
  const handleSelectAll = useCallback(() => {
    setSelectedIds(fletesState.map(f => f.id))
  }, [fletesState])

  const handleClearSelection = useCallback(() => {
    setSelectedIds([])
  }, [])

  // Actualizar flete en lista
  const actualizarFleteEnLista = useCallback(f => {
    setFletesState(prev => prev.map(x => (x.id === f.id ? f : x)))
  }, [])

  // Envío de formularios (diésel, gastos, etc.)
  const submitForm = useCallback(
    async (ruta, payload, onSuccess, onError) => {
      try {
        const res = payload instanceof FormData
          ? await axios.post(ruta, payload, { headers: { 'Content-Type': 'multipart/form-data' } })
          : await axios.post(ruta, payload)
        onSuccess?.(res.data.flete)
        return res
      } catch (err) {
        const msg = err.response?.data?.message
          || err.response?.data
          || err.message
          || 'Error procesando formulario'
        setErrorMensaje(msg)
        onError?.()
        throw err
      }
    },
    []
  )

  // Acciones batch
  const handleDownloadSpreadsheet = useCallback(async () => {
    try {
      setErrorMensaje(null)
      const res = await axios.post(
        route('fletes.batch.export'),
        { flete_ids: selectedIds },
        { responseType: 'blob' }
      )
      saveAs(res.data, 'respaldo_fletes.csv')
    } catch (e) {
      console.error('Error exportando planilla:', e.response || e)
      const status = e.response?.status
      const data   = e.response?.data
      const msg = status
        ? `Error ${status}: ${typeof data === 'object'
            ? JSON.stringify(data, null, 2)
            : data}`
        : e.message
      setErrorMensaje(msg)
    }
  }, [selectedIds])

  const handleResumenPdf = useCallback(async () => {
    setErrorMensaje(null)
    setIsLoadingResumen(true)
    try {
      const res = await axios.post(
        route('fletes.batch.resumen'),
        { flete_ids: selectedIds },
        {
          responseType: 'blob',
          headers: { Accept: 'application/json' },
        }
      )
      saveAs(res.data, 'resumen_fletes.pdf')
    } catch (e) {
      console.error('Error generando resumen PDF:', e)
      let msg = 'Error generando resumen.'
      const blob = e.response?.data
      if (blob instanceof Blob) {
        const text = await blob.text()
        try {
          const json = JSON.parse(text)
          msg = json.message || JSON.stringify(json, null, 2)
        } catch {
          msg = text
        }
      } else if (e.response?.data?.message) {
        msg = e.response.data.message
      } else {
        msg = e.message
      }
      setErrorMensaje(msg)
    } finally {
      setIsLoadingResumen(false)
    }
  }, [selectedIds])

  const handleLiquidar = useCallback(async () => {
    setErrorMensaje(null)
    setIsLoadingLiquidar(true)
    try {
      const res = await axios.post(
        route('fletes.batch.liquidar'),
        { flete_ids: selectedIds },
        {
          responseType: 'blob',
          headers: { Accept: 'application/json' },
        }
      )
      saveAs(res.data, 'liquidacion_fletes.pdf')
      handleClearSelection()
      get(route('fletes.index'), { preserveState: true, data })
    } catch (e) {
      console.error('Error liquidando fletes:', e)
      let msg = 'Error liquidando fletes.'
      const blob = e.response?.data
      if (blob instanceof Blob) {
        const text = await blob.text()
        try {
          const json = JSON.parse(text)
          msg = json.message || JSON.stringify(json, null, 2)
        } catch {
          msg = text
        }
      } else if (e.response?.data?.message) {
        msg = e.response.data.message
      } else {
        msg = e.message
      }
      setErrorMensaje(msg)
    } finally {
      setIsLoadingLiquidar(false)
    }
  }, [selectedIds, get, data, handleClearSelection])

  // Eliminar registro
  const eliminarRegistro = useCallback(
    async id => {
      try {
        const res = await axios.delete(`/registro/${id}`)
        if (res.data.flete) actualizarFleteEnLista(res.data.flete)
      } catch (e) {
        console.error('Error al eliminar registro:', e.response || e)
        const msg = e.response?.data?.message
          || JSON.stringify(e.response?.data)
          || 'No se pudo eliminar el registro.'
        setErrorMensaje(msg)
      }
    },
    [actualizarFleteEnLista]
  )

  // Limpiar filtros
  const handleClear = useCallback(() => {
    setData({
      conductor_ids:   [],
      colaborador_ids: [],
      cliente_ids:     [],
      tracto_ids:      [],
      destino:         '',
      fecha_desde:     '',
      fecha_hasta:     '',
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
      setErrorMensaje(null)
      await quickCreateFlete(data, destinos, tractos, setSuccessMensaje, setErrorMensaje)
      get(route('fletes.index'), { preserveState: true, data })
    } catch {
      // ya seteado errorMensaje
    }
  }

  // Toggle mostrar todos
  useEffect(() => {
    const toggle = () => setShowAll(prev => !prev)
    window.addEventListener('toggleShowAll', toggle)
    return () => window.removeEventListener('toggleShowAll', toggle)
  }, [])

  // Handlers DetailsGrid (sin cambios)…
  const onSelectTitular = useCallback(async (id, opt) => { /* … */ }, [actualizarFleteEnLista])
  const onSelectTracto  = useCallback(async (id, opt) => { /* … */ }, [actualizarFleteEnLista])
  const onSelectRampla  = useCallback(async (id, opt) => { /* … */ }, [actualizarFleteEnLista])
  const onSelectGuiaRuta = useCallback(async (id, text) => { /* … */ }, [actualizarFleteEnLista])
  const onSelectFechaSalida  = useCallback(async (id, date) => { /* … */ }, [actualizarFleteEnLista])
  const onSelectFechaLlegada = useCallback(async (id, date) => { /* … */ }, [actualizarFleteEnLista])

  // Paginación
  const { current_page, last_page, prev_page_url, next_page_url } = paginatedFletes

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
            <pre className="whitespace-pre-wrap">{errorMensaje}</pre>
          </div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed top-0 inset-x-0 z-50 flex justify-end py-2 pr-20">
          <div className="bg-transparent shadow-md rounded px-2 py-1 flex items-center space-x-1">
            {/* Seleccionar todos */}
            <button
              onClick={handleSelectAll}
              className="p-2 hover:bg-gray-100 rounded"
              title="Seleccionar todos"
            >
              <CheckCircleIcon className="h-5 w-5 text-blue-600" />
            </button>

            {/* Limpiar selección */}
            <button
              onClick={handleClearSelection}
              className="p-2 hover:bg-gray-100 rounded"
              title="Limpiar selección"
            >
              <ArrowPathIcon className="h-5 w-5 text-red-600" />
            </button>

            {/* Descargar planilla */}
            <button
              onClick={handleDownloadSpreadsheet}
              className="p-2 hover:bg-gray-100 rounded"
              title="Descargar planilla"
            >
              <DocumentArrowDownIcon className="h-5 w-5 text-green-600" />
            </button>

            {/* Resumir PDF */}
            <button
              onClick={handleResumenPdf}
              disabled={isLoadingResumen}
              className={`
                flex items-center px-2 py-1 text-xs text-white rounded transition-colors
                ${isLoadingResumen
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {isLoadingResumen && (
                <svg
                  className="animate-spin h-4 w-4 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {isLoadingResumen ? 'Resumiendo...' : 'Resumir'}
            </button>

            {/* Liquidar */}
            <button
              onClick={handleLiquidar}
              className="px-2 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Liquidar
            </button>
          </div>
        </div>
      )}

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
        conductores={conductores}
        colaboradores={colaboradores}
        clientes={clientes}
        tractos={tractos}
        destinos={destinos}
        ramplas={ramplas}
        guias={guias}
        onSelectTitular={onSelectTitular}
        onSelectTracto={onSelectTracto}
        onSelectRampla={onSelectRampla}
        onSelectGuiaRuta={onSelectGuiaRuta}
        onSelectFechaSalida={onSelectFechaSalida}
        onSelectFechaLlegada={onSelectFechaLlegada}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
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
