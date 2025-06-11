import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, usePage } from '@inertiajs/react'
import FleteCard from '@/Components/FleteCard'
import axios from 'axios'
import {
  UserIcon,
  UserGroupIcon,
  TruckIcon,
  ChevronDownIcon,
  CalendarDaysIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/20/solid'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { createPortal } from 'react-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Render children in a fixed layer above everything
function PortalDropdown({ isOpen, children }) {
  if (!isOpen) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-start items-start p-4 pointer-events-none">
      <div className="pointer-events-auto">{children}</div>
    </div>,
    document.body
  )
}

export default function Index({
  auth,
  fletes: paginatedFletes,
  filters,
  conductores,
  clientes,
  tractos,
  destinos,
}) {
  // CSRF token
  const { csrf_token } = usePage().props
  useEffect(() => {
    if (csrf_token) axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token
  }, [csrf_token])

  // Inertia form
  const { data, setData, get } = useForm({
    conductor_ids: filters.conductor_ids || [],
    cliente_ids:   filters.cliente_ids   || [],
    tracto_ids:    filters.tracto_ids    || [],
    destino:       filters.destino       || '',
    fecha_desde:   filters.fecha_desde   || '',
    fecha_hasta:   filters.fecha_hasta   || '',
  })

  // Autocomplete suggestions for destinos
  const [suggestions, setSuggestions] = useState([])

  // Local date-range state
  const [range, setRange] = useState({
    from: filters.fecha_desde ? new Date(filters.fecha_desde) : undefined,
    to:   filters.fecha_hasta ? new Date(filters.fecha_hasta) : undefined,
  })
  const handleRangeSelect = useCallback(r => {
    if (r?.from && !r.to) setRange({ from: r.from, to: r.from })
    else setRange(r || { from: undefined, to: undefined })
  }, [])

  // UI state
  const [fletesState, setFletesState]   = useState([])
  const [openForm, setOpenForm]         = useState({})
  const [errorMensaje, setErrorMensaje] = useState(null)
  const [activeTab, setActiveTab]       = useState('')
  const [showAll, setShowAll]           = useState(false)
  const calendarToggleRef = useRef(null)
  const calendarRef       = useRef(null)

  // Initialize sorted list
  useEffect(() => {
    const lista = paginatedFletes.data || []
    lista.sort((a, b) => new Date(b.fecha_salida) - new Date(a.fecha_salida))
    setFletesState(lista)
  }, [paginatedFletes])

  // Debounce filters (excluding text & date inputs)
  useEffect(() => {
    const timer = setTimeout(() => {
      get(route('fletes.index'), {
        preserveState: true,
        data: {
          conductor_ids: data.conductor_ids,
          cliente_ids:   data.cliente_ids,
          tracto_ids:    data.tracto_ids,
          destino:       data.destino,
          fecha_desde:   data.fecha_desde,
          fecha_hasta:   data.fecha_hasta,
        },
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [data.conductor_ids, data.cliente_ids, data.tracto_ids, data.destino, get])

  // Close calendar on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (
        activeTab === 'Fecha' &&
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        calendarToggleRef.current &&
        !calendarToggleRef.current.contains(e.target)
      ) {
        setActiveTab('')
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [activeTab])

  // Handlers
  const handleToggleForm = useCallback((id, tipo) => {
    setOpenForm(prev => ({ ...prev, [id]: prev[id] === tipo ? null : tipo }))
  }, [])
  const handleCloseForm = useCallback(id => {
    setOpenForm(prev => ({ ...prev, [id]: null }))
  }, [])
  const handleToggleMultiSelect = useCallback((name, id) => {
    const arr = Array.from(data[name] || [])
    const idx = arr.indexOf(String(id))
    if (idx === -1) arr.push(String(id))
    else arr.splice(idx, 1)
    setData(name, arr)
  }, [data, setData])

  // Update one flete
  const actualizarFleteEnLista = useCallback(f => {
    setFletesState(prev => prev.map(x => (x.id === f.id ? f : x)))
  }, [])

  // Submit forms
  const submitForm = useCallback(async (ruta, payload, onSuccess, onError) => {
    try {
      let res
      if (payload instanceof FormData) {
        res = await axios.post(ruta, payload, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        res = await axios.post(ruta, payload)
      }
      onSuccess?.(res.data.flete)
      return res
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Error al procesar el formulario'
      setErrorMensaje(msg)
      onError?.()
      throw err
    }
  }, [])

  // Delete record
  const eliminarRegistro = useCallback(async id => {
    try {
      const res = await axios.delete(`/registro/${id}`)
      if (res.data.flete) actualizarFleteEnLista(res.data.flete)
    } catch {
      setErrorMensaje('No se pudo eliminar el registro.')
    }
  }, [actualizarFleteEnLista])

  // Cards render
  const allCards = useMemo(
    () =>
      fletesState.map(flete => (
        <div key={flete.id} className="relative">
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
      )),
    [fletesState, openForm, handleToggleForm, handleCloseForm, actualizarFleteEnLista, submitForm, eliminarRegistro]
  )
  const displayCards = showAll ? allCards : allCards.slice(0, 15)

  // Pagination
  const { current_page, last_page, prev_page_url, next_page_url } = paginatedFletes
  const pagesToShow = useMemo(() => {
    if (last_page <= 6) return Array.from({ length: last_page }, (_, i) => i + 1)
    return [1, 2, 3, 'ellipsis', last_page - 2, last_page - 1, last_page]
  }, [last_page])

  // Clear filters
  const handleClear = useCallback(() => {
    setData({
      conductor_ids: [],
      cliente_ids:   [],
      tracto_ids:    [],
      destino:       '',
      fecha_desde:   '',
      fecha_hasta:   '',
    })
    setRange({ from: undefined, to: undefined })
    setShowAll(false)
    get(route('fletes.index'), {
      preserveState: true,
      data: {
        conductor_ids: [],
        cliente_ids:   [],
        tracto_ids:    [],
        destino:       '',
        fecha_desde:   '',
        fecha_hasta:   '',
      },
    })
  }, [setData, get])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Fletes" />

      {/* FILTROS */}
      <div className="sticky top-[56px] z-20 bg-white border-b border-gray-200 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex-nowrap flex overflow-x-auto items-center gap-x-2">

          {/* Limpiar filtros */}
          <button
            onClick={handleClear}
            className="flex-shrink-0 inline-flex items-center bg-white px-2 py-1 border rounded text-xs text-gray-600 hover:text-gray-800"
          >
            <ArrowLongLeftIcon className="h-5 w-5 sm:hidden" />
            <span className="hidden sm:inline">Limpiar filtros</span>
          </button>

          {/* Titular */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setActiveTab(activeTab === 'Titular' ? '' : 'Titular')}
              className={classNames(
                activeTab === 'Titular'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-indigo-300 hover:text-gray-700',
                'inline-flex items-center bg-white px-2 py-1 text-xs sm:text-sm font-medium border-b-2 rounded'
              )}
            >
              Titular <ChevronDownIcon className="h-4 w-4 ml-1" />
            </button>
            <PortalDropdown isOpen={activeTab === 'Titular'}>
              <div className="w-48 max-h-80 overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100">
                {conductores.map(u => (
                  <div
                    key={u.id}
                    onClick={() => {
                      handleToggleMultiSelect('conductor_ids', u.id)
                      setActiveTab('')
                    }}
                    className={classNames(
                      data.conductor_ids.includes(String(u.id)) && 'bg-gray-100',
                      'flex items-center px-3 py-2 text-xs sm:text-sm text-gray-700 cursor-pointer'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={data.conductor_ids.includes(String(u.id))}
                      readOnly
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 truncate">{u.name}</span>
                  </div>
                ))}
              </div>
            </PortalDropdown>
          </div>

          {/* Cliente */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setActiveTab(activeTab === 'Cliente' ? '' : 'Cliente')}
              className={classNames(
                activeTab === 'Cliente'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-indigo-300 hover:text-gray-700',
                'inline-flex items-center bg-white px-2 py-1 text-xs sm:text-sm font-medium border-b-2 rounded'
              )}
            >
              Cliente <ChevronDownIcon className="h-4 w-4 ml-1" />
            </button>
            <PortalDropdown isOpen={activeTab === 'Cliente'}>
              <div className="w-44 max-h-80 overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100">
                {clientes.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      handleToggleMultiSelect('cliente_ids', c.id)
                      setActiveTab('')
                    }}
                    className={classNames(
                      data.cliente_ids.includes(String(c.id)) && 'bg-gray-100',
                      'flex items-center px-3 py-2 text-xs sm:text-sm text-gray-700 cursor-pointer'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={data.cliente_ids.includes(String(c.id))}
                      readOnly
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 truncate">{c.razon_social}</span>
                  </div>
                ))}
              </div>
            </PortalDropdown>
          </div>

          {/* Tracto */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setActiveTab(activeTab === 'Tracto' ? '' : 'Tracto')}
              className={classNames(
                activeTab === 'Tracto'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'inline-flex items-center bg-white px-2 py-1 text-xs sm:text-sm font-medium border-b-2 rounded'
              )}
            >
              Tracto <ChevronDownIcon className="h-4 w-4 ml-1" />
            </button>
            <PortalDropdown isOpen={activeTab === 'Tracto'}>
              <div className="w-44 max-h-80 overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100">
                {tractos.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      handleToggleMultiSelect('tracto_ids', t.id)
                      setActiveTab('')
                    }}
                    className={classNames(
                      data.tracto_ids.includes(String(t.id)) && 'bg-gray-100',
                      'flex items-center px-3 py-2 text-xs sm:text-sm text-gray-700 cursor-pointer'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={data.tracto_ids.includes(String(t.id))}
                      readOnly
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 truncate">{t.patente}</span>
                  </div>
                ))}
              </div>
            </PortalDropdown>
          </div>

          {/* Destino Autocomplete */}
          <div className="relative flex-shrink-0">
            <input
              type="text"
              placeholder="Destino..."
              value={data.destino}
              onChange={e => {
                setData('destino', e.target.value)
                setSuggestions(
                  destinos
                    .filter(d =>
                      d.nombre.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                    .slice(0, 10)
                )
              }}
              className="bg-white px-2 py-1 text-xs sm:text-sm border rounded focus:outline-none"
            />
            <PortalDropdown isOpen={suggestions.length > 0}>
              <div className="w-48 max-h-60 overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100">
                {suggestions.map(d => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setData('destino', d.nombre)
                      setSuggestions([])
                      get(route('fletes.index'), { preserveState: true, data })
                    }}
                    className="px-3 py-2 text-xs sm:text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  >
                    {d.nombre}
                  </div>
                ))}
              </div>
            </PortalDropdown>
          </div>

          {/* Fecha */}
          <div className="relative flex-shrink-0" ref={calendarToggleRef}>
            <button
              onClick={() => setActiveTab(activeTab === 'Fecha' ? '' : 'Fecha')}
              className={classNames(
                activeTab === 'Fecha'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'inline-flex items-center bg-white px-2 py-1 text-xs sm:text-sm font-medium border-b-2 rounded'
              )}
            >
              Fecha <ChevronDownIcon className="h-4 w-4 ml-1 text-gray-400" />
            </button>
            <PortalDropdown isOpen={activeTab === 'Fecha'}>
              <div className="w-64 bg-white p-2 shadow-lg rounded z-50 text-xs sm:text-sm">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={handleRangeSelect}
                  numberOfMonths={1}
                />
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => setRange({ from: undefined, to: undefined })}
                    className="text-[10px] text-gray-600 hover:text-gray-800"
                  >
                    X
                  </button>
                  <button
                    onClick={() => {
                      const desde = range.from?.toISOString().split('T')[0] || ''
                      const hasta = range.to?.toISOString().split('T')[0] || ''
                      setData('fecha_desde', desde)
                      setData('fecha_hasta', hasta)
                      setActiveTab('')
                      get(route('fletes.index'), {
                        preserveState: true,
                        data: {
                          ...data,
                          fecha_desde: desde,
                          fecha_hasta: hasta,
                        },
                      })
                    }}
                    className="text-[10px] text-blue-600 hover:underline"
                  >
                    OK
                  </button>
                </div>
              </div>
            </PortalDropdown>
          </div>
        </div>
      </div>

      {/* GRID DE TARJETAS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayCards}
        </div>
        {allCards.length > 15 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(prev => !prev)}
              className="text-sm text-indigo-600 hover:underline"
            >
              {showAll ? 'Mostrar menos' : `Mostrar más (${allCards.length - 15})`}
            </button>
          </div>
        )}
      </div>

      {/* PAGINACIÓN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <button
            onClick={() =>
              prev_page_url &&
              get(prev_page_url, { preserveState: true, data })
            }
            disabled={!prev_page_url}
            className={classNames(
              'inline-flex items-center border-t-2 border-transparent pr-2 pt-1 text-sm font-medium',
              prev_page_url
                ? 'text-gray-600 hover:text-gray-800 hover:border-gray-300'
                : 'text-gray-300 cursor-not-allowed'
            )}
          >
            <ArrowLongLeftIcon className="mr-2 h-5 w-5 text-gray-400" />
            Anterior
          </button>
          <div className="hidden md:flex space-x-1">
            {pagesToShow.map((p, idx) =>
              p === 'ellipsis' ? (
                <span
                  key={`e${idx}`}
                  className="inline-flex items-center border-t-2 border-transparent px-3 pt-1 text-sm font-medium text-gray-500"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() =>
                    get(route('fletes.index', { page: p }), {
                      preserveState: true,
                      data,
                    })
                  }
                  aria-current={p === current_page ? 'page' : undefined}
                  className={classNames(
                    'inline-flex items-center border-t-2 px-3 pt-1 text-sm font-medium',
                    p === current_page
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  {p}
                </button>
              )
            )}
          </div>
          <button
            onClick={() =>
              next_page_url &&
              get(next_page_url, { preserveState: true, data })
            }
            disabled={!next_page_url}
            className={classNames(
              'inline-flex items-center border-t-2 border-transparent pl-2 pt-1 text-sm font-medium',
              next_page_url
                ? 'text-gray-600 hover:text-gray-800 hover:border-gray-300'
                : 'text-gray-300 cursor-not-allowed'
            )}
          >
            Siguiente
            <ArrowLongRightIcon className="ml-2 h-5 w-5 text-gray-400" />
          </button>
        </nav>
      </div>
    </AuthenticatedLayout>
  )
}
