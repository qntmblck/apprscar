// resources/js/Components/FleteCard.jsx
import { formatDateSimple } from '@/helpers/date'
import React, { useState, useMemo, useCallback, memo, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import DieselForm from './Forms/DieselForm'
import GastoForm from './Forms/GastoForm'
import FinalizarForm from './Forms/FinalizarForm'
import AbonoForm from './Forms/AbonoForm'
import RetornoForm from './Forms/RetornoForm'
import ComisionForm from './Forms/ComisionForm'
import AdicionalForm from './Forms/AdicionalForm'
import axios from 'axios'
import {
  CalendarDaysIcon,
  UserIcon,
  TruckIcon,
  BanknotesIcon,
  EyeIcon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  BanknotesIcon as BankIcon,
  DocumentDuplicateIcon,
  ShoppingCartIcon,
  ArrowRightOnRectangleIcon,
  IdentificationIcon
} from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { createPortal } from 'react-dom'
import './FleteCard.css'

// Helper para concatenar clases
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// PortalDropdown idéntico al de Index.jsx
function PortalDropdown({ isOpen, children, type }) {
  if (!isOpen) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-start items-start p-4 pointer-events-none">
      <div data-dropdown-type={type} className="pointer-events-auto">
        {children}
      </div>
    </div>,
    document.body
  )
}

function FleteCard({
  flete,
  openForm,
  handleToggleForm,
  handleCloseForm,
  actualizarFleteEnLista,
  submitForm,
  onEliminarRegistro,
  conductores = [],
  colaboradores = [],
  tractos = [],
  ramplas = [],
  guias = [],
  onSelectTitular,
  onSelectFechaSalida,
  onSelectTracto,
  onSelectRampla,
  onSelectGuiaRuta,
}) {
  const [flipped, setFlipped] = useState(false)
  const [errorCierre, setErrorCierre] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const formAbierto = openForm[flete.id]

  // estado temporal para Guía/Ruta
  const [tempGuia, setTempGuia] = useState(flete.guiaruta || '')

  useEffect(() => {
    if (activeMenu === 'GuiaRuta') {
      setTempGuia(flete.guiaruta || '')
    }
  }, [activeMenu, flete.guiaruta])

  // cerrar dropdown si clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (!activeMenu) return
      if (
        e.target.closest(`[data-toggle-type="${activeMenu}"]`) ||
        e.target.closest(`[data-dropdown-type="${activeMenu}"]`)
      ) return
      setActiveMenu(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeMenu])

  // ─── Memoizados: Fechas y montos ─────────────────────────────────────────────
  const fechaSalidaFormatted = useMemo(
    () =>
      flete.fecha_salida
        ? new Date(flete.fecha_salida).toLocaleDateString('es-CL')
        : '—',
    [flete.fecha_salida]
  )
  const fechaLlegadaFormatted = useMemo(
    () =>
      flete.fecha_llegada
        ? new Date(flete.fecha_llegada).toLocaleDateString('es-CL')
        : 'No registrada',
    [flete.fecha_llegada]
  )
  const viaticoEfec = useMemo(
    () => flete.rendicion?.viatico_efectivo ?? 0,
    [flete.rendicion?.viatico_efectivo]
  )
  const saldoTemporal = useMemo(
    () => flete.rendicion?.saldo_temporal ?? 0,
    [flete.rendicion?.saldo_temporal]
  )

  // ─── Registros recientes ────────────────────────────────────────────────────
  const ultimosRegistros = useMemo(() => {
    const lista = [
      ...(flete.rendicion?.abonos     || []),
      ...(flete.rendicion?.diesels    || []),
      ...(flete.rendicion?.gastos     || []),
      ...(flete.rendicion?.adicionales|| []),
    ]
    lista.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    return lista.slice(-2)
  }, [
    flete.rendicion?.abonos,
    flete.rendicion?.diesels,
    flete.rendicion?.gastos,
    flete.rendicion?.adicionales,
  ])

  const detallesBack = useMemo(() => {
    const lista = [
      ...(flete.rendicion?.abonos || []),
      ...(flete.rendicion?.diesels || []),
      ...(flete.rendicion?.gastos  || []),
    ]
    return lista.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [
    flete.rendicion?.abonos,
    flete.rendicion?.diesels,
    flete.rendicion?.gastos,
  ])

  // ─── Pestañas Front / Back ──────────────────────────────────────────────────
  const frontTabs = useMemo(
    () => [
      { name: 'Diesel',    key: 'diesel',    icon: WrenchScrewdriverIcon, count: flete.rendicion?.diesels?.length ?? 0,    current: formAbierto === 'diesel' },
      { name: 'Gasto',     key: 'gasto',     icon: CurrencyDollarIcon,       count: flete.rendicion?.gastos?.length  ?? 0,    current: formAbierto === 'gasto' },
      { name: 'Viático',   key: 'finalizar', icon: SparklesIcon,            count: 0,                                       current: formAbierto === 'finalizar' },
      { name: 'Adicional', key: 'adicional', icon: BankIcon,                count: flete.rendicion?.adicionales?.length??0, current: formAbierto === 'adicional' },
    ],
    [flete.rendicion, formAbierto]
  )

  const backTabs = useMemo(
    () => [
      { name: 'Abono',    key: 'abono',    icon: BankIcon, count: flete.rendicion?.abonos?.length ?? 0,    current: formAbierto === 'abono' },
      { name: 'Retorno',  key: 'retorno',  icon: BankIcon, count: flete.rendicion?.retorno ? 1 : 0,         current: formAbierto === 'retorno' },
      { name: 'Comisión', key: 'comision', icon: BankIcon, count: flete.rendicion?.comision != null ? 1 : 0, current: formAbierto === 'comision' },
    ],
    [flete.rendicion, formAbierto]
  )

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleFlip = useCallback(() => setFlipped(p => !p), [])
  const cerrarRendicion = useCallback(async fleteId => {
    setErrorCierre(null)
    setIsSubmitting(true)
    try {
      const res = await axios.post(`/fletes/${fleteId}/cerrar`)
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        (e.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join(' ')
          : e.message)
      setErrorCierre('❌ ' + msg)
    } finally {
      setIsSubmitting(false)
    }
  }, [actualizarFleteEnLista])

  const handleEliminarRegistro = useCallback(async registro => {
    if (!confirm('¿Eliminar este registro?')) return
    setIsSubmitting(true)
    try {
      let url
      if ('litros' in registro) url = `/diesels/${registro.id}`
      else if (registro.tipo === 'Comisión') url = `/comisiones/${registro.id}`
      else if (registro.tipo) url = `/gastos/${registro.id}`
      else if (registro.metodo === 'Retorno') url = `/retornos/${registro.id}`
      else url = `/abonos/${registro.id}`

      await axios.delete(url)
      const res = await axios.get(`/fletes/${flete.id}`)
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
    } catch (e) {
      alert('Error eliminando: ' + (e.response?.data?.message || e.message))
    } finally {
      setIsSubmitting(false)
    }
  }, [flete.id, actualizarFleteEnLista])

  return (
    <div className={`flete-card w-full ${formAbierto ? 'expanded' : ''}`}>
      <div className={`flete-card-inner ${flipped ? 'rotate-y-180' : ''}`}>

        {/* ─── Cara Frontal ──────────────────────────────────────────────────── */}
        <div className={`flete-card-front w-full bg-white border border-gray-200 shadow-md rounded-lg p-4 ${!flipped ? 'active' : ''}`}>

          {/* Primera fila: Destino, Cliente y Botones */}
<div className="flex justify-between items-center mb-4">
  <div className="flex space-x-6">
    <div className="text-sm font-semibold text-gray-900">
      {flete.destino?.nombre || 'Sin destino'}
    </div>
    <div className="text-sm font-semibold text-gray-900">
      {flete.cliente_principal?.razon_social || 'Sin cliente'}
    </div>
  </div>
  <div className="flex space-x-2 items-center">

    {/* Notificar / Notificado (iconos invertidos) */}
    {flete.estado === 'Sin Notificar' ? (
      /* mostrar el icono “no notificado” (negro) */
      <span className="p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-black">
          <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
          <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
        </svg>
      </span>
    ) : (
      /* mostrar el icono “notificado” (verde) */
      <button
        onClick={async () => {
          setIsSubmitting(true)
          await submitForm(
            `/fletes/${flete.id}/notificar`,
            { flete_id: flete.id },
            actualizarFleteEnLista
          )
          setIsSubmitting(false)
        }}
        disabled={isSubmitting}
        className={classNames(
          'p-2 rounded-full',
          isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-50'
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-green-600">
          <path d="M19.5 22.5a3 3 0 0 0 3-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 1 1-.712 1.321l-5.683-3.06a1.5 1.5 0 0 0-1.422 0l-5.683 3.06a.75.75 0 0 1-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 0 0 3 3h15Z" />
          <path d="M1.5 9.589v-.745a3 3 0 0 1 1.578-2.642l7.5-4.038a3 3 0 0 1 2.844 0l7.5 4.038A3 3 0 0 1 22.5 8.844v.745l-8.426 4.926-.652-.351a3 3 0 0 0-2.844 0l-.652.351L1.5 9.589Z" />
        </svg>
      </button>
    )}

    {/* Cerrar / Reabrir (iconos invertidos) */}
    {flete.rendicion?.estado === 'Activo' ? (
      /* mostrar “cerrado” (negro) cuando está activo */
      <button
        onClick={() => cerrarRendicion(flete.id)}
        disabled={isSubmitting}
        className={classNames(
          'p-2 rounded-full',
          isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-black/10'
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-black">
          <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
        </svg>
      </button>
    ) : (
      /* mostrar “abierto” (verde) cuando está cerrado */
      <button
        onClick={() => cerrarRendicion(flete.id)}
        disabled={isSubmitting}
        className={classNames(
          'p-2 rounded-full',
          isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-50'
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-green-600">
          <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 0 1-1.5 0V6.75a3.75 3.75 0 1 0-7.5 0v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1-3 3H3.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3h9v-3c0-2.9 2.35-5.25 5.25-5.25Z" />
        </svg>
      </button>
    )}

    {/* Ojo para voltear */}
    <button onClick={handleFlip} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
      <EyeIcon className="h-5 w-5 text-gray-600" />
    </button>


  </div>
</div>



          {/* ─── Grid de detalles ───────────────────────────────────────────── */}
<div className="overflow-x-auto mb-4">
  <div className="grid min-w-0 grid-cols-[1fr_1fr_auto] gap-x-4 gap-y-2 text-sm text-gray-700">

    {/* Titular */}
    <div className="relative min-w-0 overflow-x-auto whitespace-nowrap">
      <button
        data-toggle-type="Titular"
        onClick={() => setActiveMenu(activeMenu === 'Titular' ? null : 'Titular')}
        className="flex items-center gap-x-2 w-full"
      >
        <IdentificationIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <span className="truncate">
          {flete.conductor?.name || flete.colaborador?.name || '—'}
        </span>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </button>
      <PortalDropdown isOpen={activeMenu === 'Titular'} type="Titular">
        <div className="absolute top-0 left-0 mt-2 ml-2 w-44 max-h-[480px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100 p-2">
          {(conductores.length > 0 ? conductores : colaboradores).map(opt => (
            <button
              key={opt.id}
              onClick={() => { onSelectTitular(opt); setActiveMenu(null) }}
              className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
            >
              {opt.name || opt.razon_social}
            </button>
          ))}
        </div>
      </PortalDropdown>
    </div>

    {/* Salida */}
    <div className="relative min-w-0 overflow-x-auto whitespace-nowrap">
      <button
        data-toggle-type="Salida"
        onClick={() => setActiveMenu(activeMenu === 'Salida' ? null : 'Salida')}
        className="flex items-center gap-x-2 w-full"
      >
        <CalendarDaysIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <span className="truncate">{fechaSalidaFormatted}</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </button>
      <PortalDropdown isOpen={activeMenu === 'Salida'} type="Salida">
        <div className="absolute top-0 left-0 mt-2 ml-2 bg-white border border-gray-200 shadow-lg p-2 rounded">
          <DayPicker
            mode="single"
            selected={flete.fecha_salida ? new Date(flete.fecha_salida) : undefined}
            onSelect={date => {
              onSelectFechaSalida(date)
              setActiveMenu(null)
            }}
          />
        </div>
      </PortalDropdown>
    </div>

    {/* Comisión */}
    <div className="flex items-center gap-x-2 justify-end text-green-600 truncate">
      <CurrencyDollarIcon className="h-5 w-5 flex-shrink-0" />
      <span className="truncate">
        ${flete.rendicion?.comision?.toLocaleString('es-CL') || '—'}
      </span>
    </div>

    {/* Tracto */}
    <div className="relative min-w-0 overflow-x-auto whitespace-nowrap">
      <button
        data-toggle-type="Tracto"
        onClick={() => setActiveMenu(activeMenu === 'Tracto' ? null : 'Tracto')}
        className="flex items-center gap-x-2 w-full"
      >
        <TruckIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <span className="truncate">{flete.tracto?.patente || '—'}</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </button>
      <PortalDropdown isOpen={activeMenu === 'Tracto'} type="Tracto">
        <div className="absolute top-0 left-0 mt-2 ml-2 w-44 max-h-[480px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100 p-2">
          {tractos.map(opt => (
            <button
              key={opt.id}
              onClick={() => { onSelectTracto(opt); setActiveMenu(null) }}
              className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
            >
              {opt.patente}
            </button>
          ))}
        </div>
      </PortalDropdown>
    </div>

    {/* Llegada (estática) */}
    <div className="flex items-center gap-x-2 min-w-0 overflow-x-auto whitespace-nowrap">
      <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
      <span className="truncate">{fechaLlegadaFormatted}</span>
    </div>

    {/* Viático */}
    <div className="flex items-center gap-x-2 justify-end text-green-600 truncate">
      <CalendarDaysIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
      <span className="truncate">${viaticoEfec.toLocaleString('es-CL')}</span>
    </div>

    {/* Rampla */}
    <div className="relative min-w-0 overflow-x-auto whitespace-nowrap">
      <button
        data-toggle-type="Rampla"
        onClick={() => setActiveMenu(activeMenu === 'Rampla' ? null : 'Rampla')}
        className="flex items-center gap-x-2 w-full"
      >
        <ShoppingCartIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
        <span className="truncate">{flete.rampla?.patente || '—'}</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </button>
      <PortalDropdown isOpen={activeMenu === 'Rampla'} type="Rampla">
        <div className="absolute top-0 left-0 mt-2 ml-2 w-44 max-h-[480px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100 p-2">
          {ramplas.map(opt => (
            <button
              key={opt.id}
              onClick={() => { onSelectRampla(opt); setActiveMenu(null) }}
              className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
            >
              {opt.patente}
            </button>
          ))}
        </div>
      </PortalDropdown>
    </div>

    {/* Guía/Ruta editable */}
    <div className="relative min-w-0 overflow-x-auto whitespace-nowrap">
      <button
        data-toggle-type="GuiaRuta"
        onClick={() => setActiveMenu(activeMenu === 'GuiaRuta' ? null : 'GuiaRuta')}
        className="flex items-center gap-x-2 w-full"
      >
        <DocumentDuplicateIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
        <span className="truncate">{flete.guiaruta || '—'}</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </button>
      <PortalDropdown isOpen={activeMenu === 'GuiaRuta'} type="GuiaRuta">
        <div className="absolute top-0 left-0 mt-2 ml-2 w-48 bg-white border border-gray-200 shadow-lg p-2 rounded">
          <input
            autoFocus
            type="text"
            value={tempGuia}
            onChange={e => setTempGuia(e.target.value)}
            onBlur={() => { onSelectGuiaRuta(tempGuia); setActiveMenu(null) }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onSelectGuiaRuta(tempGuia)
                setActiveMenu(null)
              }
            }}
            placeholder="Escribe guía/ruta..."
            className="w-full px-2 py-1 text-base border border-gray-300 rounded focus:outline-none"
          />
        </div>
      </PortalDropdown>
    </div>

    {/* Saldo */}
    <div className={classNames(
      'flex items-center gap-x-2 justify-end truncate',
      saldoTemporal >= 0 ? 'text-green-600' : 'text-red-600'
    )}>
      <BanknotesIcon className="h-5 w-5 flex-shrink-0" />
      <span className="truncate">${saldoTemporal.toLocaleString('es-CL')}</span>
    </div>

  </div>
</div>


          {/* Error de cierre */}
          {errorCierre && (
            <div className="text-red-600 text-[11px] bg-red-100 p-2 rounded mb-4">
              {errorCierre}
            </div>
          )}

          {/* Últimos 2 registros */}
          <div className="space-y-1 text-xs">
            {ultimosRegistros.map((r, i) => {
              const esDiesel = 'metodo_pago' in r && 'litros' in r
              const esGasto  = 'tipo' in r && !('litros' in r)
              const tipo = esDiesel ? 'Diesel' : esGasto ? 'Gasto' : 'Abono'
              const textColor = esDiesel ? 'text-blue-700' : esGasto ? 'text-red-700' : 'text-green-700'
              let detalle = esDiesel
                ? r.metodo_pago
                : esGasto
                ? r.tipo === 'Otro'
                  ? `Otros: ${r.descripcion}`
                  : r.tipo
                : r.metodo

              return (
                <div key={i} className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] items-center py-1 gap-x-2 border-b last:border-b-0">
                  <div className={`${textColor} font-medium`}>{tipo}</div>
                  <div className={`${textColor} truncate`}>{detalle}</div>
                  <div className="flex items-center space-x-2">
                    <span className={textColor}>${(r.monto ?? r.total).toLocaleString('es-CL')}</span>
                    <button
                      onClick={() => handleEliminarRegistro(r)}
                      disabled={isSubmitting}
                      className={classNames('ml-2', isSubmitting ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700')}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pestañas front + Pagado */}
          <div className="mt-4">
            <div className="overflow-x-auto">
              <nav className="flex items-center space-x-1 border-b border-gray-200">
                <div className="flex-1 flex space-x-1 overflow-auto">
                  {frontTabs.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => handleToggleForm(flete.id, tab.key)}
                      className={classNames(
                        tab.current ? 'border-indigo-500 text-current' : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700',
                        'group inline-flex items-center border-b-2 px-2 py-2 text-sm font-medium transition'
                      )}
                      style={{ minWidth: 80 }}
                    >
                      <tab.icon className={classNames(
                        tab.current ? 'text-current' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-1 h-4 w-4'
                      )} />
                      {tab.name}
                      {tab.count > 0 && (
                        <span className={classNames(
                          tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                          'ml-1 rounded-full px-1 py-0.5 text-[10px] font-medium'
                        )}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex-shrink-0">
                  {flete.pagado ? (
                    <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded bg-black text-white ring-1 ring-inset ring-black/20">
                      Pagado
                    </span>
                  ) : (
                    <input type="checkbox" className="h-4 w-4 text-green-600 border-gray-300 rounded" />
                  )}
                </div>
              </nav>
            </div>

            {/* Formularios front */}
            {formAbierto === 'diesel' && (
              <div className="px-2 pt-2">
                <DieselForm
                  fleteId={flete.id}
                  rendicionId={flete.rendicion?.id}
                  onSubmit={async payload => {
                    setIsSubmitting(true)
                    try {
                      await submitForm('/diesel', payload, f => {
                        actualizarFleteEnLista(f)
                        handleCloseForm(flete.id)
                      })
                    } finally {
                      setIsSubmitting(false)
                    }
                  }}
                  onCancel={() => handleCloseForm(flete.id)}
                />
              </div>
            )}
            {formAbierto === 'gasto' && (
              <div className="px-2 pt-2">
                <GastoForm
                  fleteId={flete.id}
                  rendicionId={flete.rendicion?.id}
                  submitForm={async (ruta, payload) => {
                    setIsSubmitting(true)
                    try {
                      await submitForm(ruta, payload, f => {
                        actualizarFleteEnLista(f)
                        handleCloseForm(flete.id)
                      })
                    } finally {
                      setIsSubmitting(false)
                    }
                  }}
                  onCancel={() => handleCloseForm(flete.id)}
                />
              </div>
            )}
            {formAbierto === 'finalizar' && (
              <div className="px-2 pt-2">
                <FinalizarForm
                  fleteId={flete.id}
                  rendicionId={flete.rendicion?.id}
                  fechaSalida={flete.fecha_salida}
                  onSubmit={async payload => {
                    setIsSubmitting(true)
                    try {
                      await submitForm(`/fletes/${flete.id}/finalizar`, payload, f => {
                        actualizarFleteEnLista(f)
                        handleCloseForm(flete.id)
                      })
                    } finally {
                      setIsSubmitting(false)
                    }
                  }}
                  onCancel={() => handleCloseForm(flete.id)}
                />
              </div>
            )}
            {formAbierto === 'adicional' && (
              <div className="px-2 pt-2">
                <AdicionalForm
                  fleteId={flete.id}
                  rendicionId={flete.rendicion?.id}
                  onSubmit={async payload => {
                    setIsSubmitting(true)
                    try {
                      await submitForm('/adicionales', payload, f => {
                        actualizarFleteEnLista(f)
                        handleCloseForm(flete.id)
                      })
                    } finally {
                      setIsSubmitting(false)
                    }
                  }}
                  onCancel={() => handleCloseForm(flete.id)}
                />
              </div>
            )}
          </div>
        </div>

        {/* ─── Cara Trasera ──────────────────────────────────────────────────── */}
        <div className={`flete-card-back bg-white border border-gray-200 shadow-md rounded-lg p-4 ${flipped ? 'active' : ''}`}>
          <div className="flex justify-end">
            <button onClick={handleFlip} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Detalle completo</h3>
          <div className="space-y-1 text-xs">
            {detallesBack.map((r, i) => {
              const esDiesel = 'metodo_pago' in r && 'litros' in r
              const esGasto  = 'tipo' in r && !('litros' in r)
              const esAbono  = !esDiesel && !esGasto && 'metodo' in r
              const tipo = esDiesel
                ? 'Diesel'
                : esGasto
                ? 'Gasto'
                : esAbono && r.metodo === 'Retorno'
                ? 'Retorno'
                : esAbono
                ? 'Abono'
                : 'Comisión'
              let detalle = esDiesel
                ? r.metodo_pago
                : esGasto
                ? r.tipo === 'Otro'
                  ? `Otros: ${r.descripcion}`
                  : r.tipo
                : esAbono
                ? r.metodo
                : r.tipo
              const bgColor =
                esDiesel
                  ? 'bg-blue-50 text-blue-700'
                  : esGasto
                  ? 'bg-red-50 text-red-700'
                  : tipo === 'Retorno'
                  ? 'bg-yellow-50 text-yellow-700'
                  : tipo === 'Abono'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-purple-50 text-purple-700'

              return (
                <div
                  key={i}
                  className={classNames(
                    'grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] items-start py-1 gap-x-2 border-b last:border-b-0 px-2 rounded-md',
                    bgColor
                  )}
                >
                  <div className="font-medium">{tipo}</div>
                  <div className="break-words">{detalle}</div>
                  <div className="flex items-center space-x-2">
                    <span>${(r.monto ?? r.total).toLocaleString('es-CL')}</span>
                    <button
                      onClick={() => handleEliminarRegistro(r)}
                      disabled={isSubmitting}
                      className={classNames(
                        'ml-2',
                        isSubmitting ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'
                      )}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Viático */}
            <div className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] items-center text-xs py-1 border-b gap-x-2">
              <div className="font-medium">Viático</div>
              <div />
              <div className="text-gray-700 font-medium text-right">${viaticoEfec.toLocaleString('es-CL')}</div>
            </div>

            {/* Saldo final */}
            <div className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] text-sm font-semibold pt-1 border-t mt-2">
              <div className="col-span-2 text-green-700">Saldo final</div>
              <div className="text-right text-green-700">${saldoTemporal.toLocaleString('es-CL')}</div>
            </div>
          </div>

          {/* Pestañas back */}
          <div className="mt-4">
            <div className="overflow-x-auto border-b border-gray-200 mb-2 px-4">
              <nav className="flex items-center space-x-1">
                {backTabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => handleToggleForm(flete.id, tab.key)}
                    className={classNames(
                      tab.current ? 'border-indigo-500 text-indigo-600' : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700',
                      'group inline-flex items-center border-b-2 px-2 py-2 text-sm font-medium transition'
                    )}
                    style={{ minWidth: 80 }}
                  >
                    <tab.icon className={classNames(
                      tab.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-1 h-5 w-5'
                    )} />
                    {tab.name}
                    {tab.count > 0 && (
                      <span className={classNames(
                        tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                        'ml-1 rounded-full px-1 py-0.5 text-[10px] font-medium'
                      )}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
            {/* Formularios back */}
            {formAbierto === 'abono' && (
              <div className="px-4">
                <AbonoForm
                  fleteId={flete.id}
                  rendicionId={flete.rendicion?.id}
                  onSubmit={async payload => {
                    setIsSubmitting(true)
                    try {
                      await submitForm(
                        '/abonos',
                        { ...payload, flete_id: flete.id, rendicion_id: flete.rendicion.id },
                        f => {
                          actualizarFleteEnLista(f)
                          handleCloseForm(flete.id)
                          handleFlip()
                        }
                      )
                    } finally {
                      setIsSubmitting(false)
                    }
                  }}
                  onCancel={() => handleCloseForm(flete.id)}
                />
              </div>
            )}
            {formAbierto === 'retorno' && (
              <div className="px-4">
                <RetornoForm
                  fleteId={flete.id}
                  onSubmit={async payload => {
                    setIsSubmitting(true)
                    try {
                      await submitForm(
                        '/retornos',
                        { ...payload, flete_id: flete.id, rendicion_id: flete.rendicion.id, tipo: 'Retorno' },
                        f => {
                          actualizarFleteEnLista(f)
                          handleCloseForm(flete.id)
                          handleFlip()
                        }
                      )
                    } finally {
                      setIsSubmitting(false)
                    }
                  }}
                  onCancel={() => handleCloseForm(flete.id)}
                />
              </div>
            )}
            {formAbierto === 'comision' && (
              <div className="px-4">
                <ComisionForm
                  rendicionId={flete.rendicion?.id}
                  onSubmit={async payload => {
                    setIsSubmitting(true)
                    try {
                      await submitForm(
                        '/comisiones',
                        { tipo: 'Comisión', ...payload, flete_id: flete.id, rendicion_id: flete.rendicion.id },
                        f => {
                          actualizarFleteEnLista(f)
                          handleCloseForm(flete.id)
                          handleFlip()
                        }
                      )
                    } finally {
                      setIsSubmitting(false)
                    }
                  }}
                  onCancel={() => handleCloseForm(flete.id)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(FleteCard)
