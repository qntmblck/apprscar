// resources/js/Pages/Fletes/Index.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, usePage } from '@inertiajs/react'
import FleteCard from '@/Components/FleteCard'
import axios from 'axios'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon, ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Index({ auth, fletes: paginatedFletes, filters, conductores, clientes, tractos }) {
  // ─── CSRF token desde Inertia props ─────────────────────────────────────────────
  const { csrf_token } = usePage().props
  useEffect(() => {
    if (csrf_token) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token
    }
  }, [csrf_token])

  // ─── useForm para filtros ───────────────────────────────────────────────────────
  const { data, setData, get } = useForm({
    conductor_ids: filters.conductor_ids || [],
    cliente_ids:   filters.cliente_ids   || [],
    tracto_ids:    filters.tracto_ids    || [],
    periodo:       filters.periodo       || '',
  })

  // ─── Estados locales ─────────────────────────────────────────────────────────────
  const [fletesState, setFletesState]       = useState(paginatedFletes.data)
  const [openForm, setOpenForm]             = useState({})
  const [errorMensaje, setErrorMensaje]     = useState(null)
  const [activeTab, setActiveTab]           = useState('Conductor')
  const [selectedFletes, setSelectedFletes] = useState([])

  // ─── Sincronizar paginatedFletes → fletesState ────────────────────────────────
  useEffect(() => {
    setFletesState(paginatedFletes.data || [])
  }, [paginatedFletes])

  // ─── Debounce en filtros (300 ms) ───────────────────────────────────────────────
  const [filterTimer, setFilterTimer] = useState(null)
  useEffect(() => {
    if (filterTimer) clearTimeout(filterTimer)
    const timer = setTimeout(() => {
      get(route('fletes.index'), { preserveState: true, data })
    }, 300)
    setFilterTimer(timer)
    return () => clearTimeout(timer)
  }, [data.conductor_ids, data.cliente_ids, data.tracto_ids, data.periodo])

  // ─── Abrir/Cerrar formularios ─────────────────────────────────────────────────
  const handleToggleForm = useCallback((fleteId, tipoFormulario) => {
    setOpenForm(prev => ({
      ...prev,
      [fleteId]: prev[fleteId] === tipoFormulario ? null : tipoFormulario,
    }))
  }, [])

  const handleCloseForm = useCallback((fleteId) => {
    setOpenForm(prev => ({ ...prev, [fleteId]: null }))
  }, [])

  // ─── Actualizar un solo flete en la lista ─────────────────────────────────────
  const actualizarFleteEnLista = useCallback((fleteActualizado) => {
    setFletesState(prev =>
      prev.map(f => (f.id === fleteActualizado.id ? fleteActualizado : f))
    )
  }, [])

  // ─── Función genérica para enviar formularios ───────────────────────────────────
  const submitForm = useCallback(
    async (ruta, payload, onSuccess, onError) => {
      try {
        let response
        if (payload instanceof FormData) {
          response = await axios.post(ruta, payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        } else {
          response = await axios.post(ruta, payload)
        }
        // Callback: recibe el flete actualizado
        onSuccess && onSuccess(response.data.flete)
        return response
      } catch (error) {
        const mensaje =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Error al procesar el formulario'
        setErrorMensaje(mensaje)
        onError && onError()
        throw error
      }
    },
    [actualizarFleteEnLista]
  )

  // ─── Eliminar un registro (Diesel/Gasto/Abono) ─────────────────────────────────
  const eliminarRegistro = useCallback(
    async (registroId) => {
      try {
        const response = await axios.delete(`/registro/${registroId}`)
        if (response.data.flete) {
          actualizarFleteEnLista(response.data.flete)
        }
      } catch {
        setErrorMensaje('No se pudo eliminar el registro.')
      }
    },
    [actualizarFleteEnLista]
  )

  // ─── Toggle multi-select (arrays) y select de periodo ─────────────────────────
  const handleToggleMultiSelect = useCallback(
    (name, id) => {
      const arr = Array.from(data[name])
      const idx = arr.indexOf(String(id))
      if (idx === -1) {
        arr.push(String(id))
      } else {
        arr.splice(idx, 1)
      }
      setData(name, arr)
    },
    [data, setData]
  )

  const handleSelectPeriodo = useCallback(
    (mes) => {
      setData('periodo', mes)
    },
    [setData]
  )

  // ─── “Select All” en pestaña Seleccionar ───────────────────────────────────────
  const toggleSelectAll = useCallback(() => {
    if (selectedFletes.length === fletesState.length) {
      setSelectedFletes([])
    } else {
      setSelectedFletes(fletesState.map(f => f.id))
    }
  }, [selectedFletes.length, fletesState])

  // ─── Generar Resumen ───────────────────────────────────────────────────────────
  const generarResumen = useCallback(() => {
    if (!selectedFletes.length) return
    get(route('fletes.resumen'), {
      preserveState: false,
      data: { flete_ids: selectedFletes },
    })
  }, [selectedFletes, get])

  // ─── Generar Pago ──────────────────────────────────────────────────────────────
  const generarPago = useCallback(() => {
    if (!selectedFletes.length || !data.periodo) return
    get(route('fletes.pago'), {
      preserveState: false,
      data: { flete_ids: selectedFletes, periodo: data.periodo },
    })
  }, [selectedFletes, data.periodo, get])

  // ─── Cambio de pestaña ─────────────────────────────────────────────────────────
  const handleChangeTab = useCallback(
    (tabName) => {
      setActiveTab(tabName)
      if (tabName !== 'Seleccionar') {
        setSelectedFletes([])
      }
    },
    []
  )

  // ─── Memoizar lista de <FleteCard /> ──────────────────────────────────────────
  const fleteCards = useMemo(() => {
    return fletesState.map((flete) => (
      <div key={flete.id} className="relative">
        {activeTab === 'Seleccionar' && (
          <input
            type="checkbox"
            className="absolute top-2 left-2 h-5 w-5 text-indigo-600 border-gray-300 rounded"
            checked={selectedFletes.includes(flete.id)}
            onChange={() => {
              if (selectedFletes.includes(flete.id)) {
                setSelectedFletes(prev => prev.filter(id => id !== flete.id))
              } else {
                setSelectedFletes(prev => [...prev, flete.id])
              }
            }}
          />
        )}
        <FleteCard
          flete={flete}
          openForm={openForm}
          handleToggleForm={handleToggleForm}
          handleCloseForm={handleCloseForm}
          actualizarFleteEnLista={actualizarFleteEnLista}
          submitForm={submitForm}
          onEliminarRegistro={eliminarRegistro}
        />
      </div>
    ))
  }, [
    fletesState,
    openForm,
    activeTab,
    selectedFletes,
    handleToggleForm,
    handleCloseForm,
    actualizarFleteEnLista,
    submitForm,
    eliminarRegistro,
  ])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Fletes" />

      {/* ─── FILTROS (despliegue on hover, desplegar justo debajo) ─────────────────── */}
<div className="sticky top-[56px] z-20 bg-white border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex flex-wrap items-center gap-x-2 gap-y-1">
    {/* Conductores */}
    <div
      className={classNames(
        activeTab === 'Conductor'
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
        'group relative inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1 text-xs font-medium border-b-2'
      )}
      onMouseEnter={() => handleChangeTab('Conductor')}
    >
      {data.conductor_ids.length > 0
        ? `Conductores (${data.conductor_ids.length})`
        : 'Conductores'}
      <ChevronDownIcon aria-hidden="true" className="h-4 w-4 text-gray-400 ml-1" />

      {/* Desplegable: aparece justo debajo (top-full) */}
      <div className="absolute left-0 top-full mt-0 w-44 max-h-48 overflow-auto origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none hidden group-hover:block">
        <div className="py-1">
          {conductores.map((c) => (
            <div
              key={c.id}
              onClick={() => handleToggleMultiSelect('conductor_ids', c.id)}
              className={classNames(
                data.conductor_ids.includes(String(c.id)) ? 'bg-gray-100' : '',
                'flex items-center px-3 py-2 text-xs text-gray-700 cursor-pointer'
              )}
            >
              <input
                type="checkbox"
                checked={data.conductor_ids.includes(String(c.id))}
                readOnly
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="ml-2">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Clientes */}
    <div
      className={classNames(
        activeTab === 'Cliente'
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
        'group relative inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1 text-xs font-medium border-b-2'
      )}
      onMouseEnter={() => handleChangeTab('Cliente')}
    >
      {data.cliente_ids.length > 0
        ? `Clientes (${data.cliente_ids.length})`
        : 'Clientes'}
      <ChevronDownIcon aria-hidden="true" className="h-4 w-4 text-gray-400 ml-1" />

      {/* Desplegable: aparece justo debajo (top-full) */}
      <div className="absolute left-0 top-full mt-0 w-44 max-h-48 overflow-auto origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none hidden group-hover:block">
        <div className="py-1">
          {clientes.map((c) => (
            <div
              key={c.id}
              onClick={() => handleToggleMultiSelect('cliente_ids', c.id)}
              className={classNames(
                data.cliente_ids.includes(String(c.id)) ? 'bg-gray-100' : '',
                'flex items-center px-3 py-2 text-xs text-gray-700 cursor-pointer'
              )}
            >
              <input
                type="checkbox"
                checked={data.cliente_ids.includes(String(c.id))}
                readOnly
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="ml-2">{c.razon_social}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Tractos */}
    <div
      className={classNames(
        activeTab === 'Tracto'
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
        'group relative inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1 text-xs font-medium border-b-2'
      )}
      onMouseEnter={() => handleChangeTab('Tracto')}
    >
      {data.tracto_ids.length > 0
        ? `Tractos (${data.tracto_ids.length})`
        : 'Tractos'}
      <ChevronDownIcon aria-hidden="true" className="h-4 w-4 text-gray-400 ml-1" />

      {/* Desplegable: aparece justo debajo (top-full) */}
      <div className="absolute left-0 top-full mt-0 w-44 max-h-48 overflow-auto origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none hidden group-hover:block">
        <div className="py-1">
          {tractos.map((t) => (
            <div
              key={t.id}
              onClick={() => handleToggleMultiSelect('tracto_ids', t.id)}
              className={classNames(
                data.tracto_ids.includes(String(t.id)) ? 'bg-gray-100' : '',
                'flex items-center px-3 py-2 text-xs text-gray-700 cursor-pointer'
              )}
            >
              <input
                type="checkbox"
                checked={data.tracto_ids.includes(String(t.id))}
                readOnly
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="ml-2">{t.patente}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Período */}
    <div
      className={classNames(
        activeTab === 'Periodo'
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
        'group relative inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1 text-xs font-medium border-b-2'
      )}
      onMouseEnter={() => handleChangeTab('Periodo')}
    >
      {data.periodo ? data.periodo : 'Periodo'}
      <ChevronDownIcon aria-hidden="true" className="h-4 w-4 text-gray-400 ml-1" />

      {/* Desplegable: aparece justo debajo (top-full) */}
      <div className="absolute left-0 top-full mt-0 w-36 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none hidden group-hover:block">
        <div className="py-1">
          {[
            'Enero','Febrero','Marzo','Abril','Mayo','Junio',
            'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
          ].map((mes) => (
            <div
              key={mes}
              onClick={() => handleSelectPeriodo(mes)}
              className={classNames(
                data.periodo === mes ? 'bg-gray-100' : '',
                'flex items-center px-3 py-2 text-xs text-gray-700 cursor-pointer'
              )}
            >
              <span className="flex-1">{mes}</span>
              {data.periodo === mes && (
                <CheckIcon className="h-4 w-4 text-indigo-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Seleccionar pestaña (sin desplegable) */}
    <button
      onClick={() => handleChangeTab('Seleccionar')}
      className={classNames(
        activeTab === 'Seleccionar'
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
        'inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1 text-xs font-medium border-b-2'
      )}
    >
      Seleccionar
    </button>

    {/* Botones Generar Resumen y Get Paid */}
    {activeTab === 'Seleccionar' && (
      <div className="flex items-center gap-x-2 ml-auto">
        <button
          onClick={generarResumen}
          disabled={!selectedFletes.length}
          className={classNames(
            !selectedFletes.length
              ? 'bg-indigo-200 text-indigo-100 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white',
            'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold'
          )}
        >
          Generar Resumen
        </button>

        <button
          onClick={generarPago}
          disabled={!selectedFletes.length || !data.periodo}
          className={classNames(
            !selectedFletes.length || !data.periodo
              ? 'bg-green-200 text-green-100 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white',
            'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold'
          )}
        >
          Get Paid
        </button>
      </div>
    )}
  </div>
</div>


      {/* ─── Grid de FleteCard ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {fleteCards}
        </div>
      </div>

      {/* Paginación */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <nav className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-0">
    <div className="flex justify-between items-center w-full">
      {/* Botón Anterior */}
      <button
        onClick={() => paginatedFletes.prev_page_url && get(paginatedFletes.prev_page_url, { preserveState: true })}
        disabled={!paginatedFletes.prev_page_url}
        className={classNames(
          'inline-flex items-center px-4 py-2 text-sm font-medium rounded',
          paginatedFletes.prev_page_url
            ? 'text-gray-600 hover:text-gray-800'
            : 'text-gray-300 cursor-not-allowed'
        )}
      >
        ← Anterior
      </button>

      {/* Página actual */}
      <span className="text-sm text-gray-500">
        Página {paginatedFletes.current_page} de {paginatedFletes.last_page}
      </span>

      {/* Botón Siguiente */}
      <button
        onClick={() => paginatedFletes.next_page_url && get(paginatedFletes.next_page_url, { preserveState: true })}
        disabled={!paginatedFletes.next_page_url}
        className={classNames(
          'inline-flex items-center px-4 py-2 text-sm font-medium rounded',
          paginatedFletes.next_page_url
            ? 'text-gray-600 hover:text-gray-800'
            : 'text-gray-300 cursor-not-allowed'
        )}
      >
        Siguiente →
      </button>
    </div>
  </nav>
</div>

    </AuthenticatedLayout>
  )
}
