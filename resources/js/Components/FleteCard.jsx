// resources/js/Components/FleteCard.jsx
import { formatDateSimple } from '@/helpers/date'
import React, { useState, useMemo, useCallback, memo } from 'react'
import DieselForm from './Forms/DieselForm'
import GastoForm from './Forms/GastoForm'
import FinalizarForm from './Forms/FinalizarForm'
import AbonoForm from './Forms/AbonoForm'
import RetornoForm from './Forms/RetornoForm'
import ComisionForm from './Forms/ComisionForm'
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
} from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import './FleteCard.css'

// Helper para concatenar clases
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function FleteCard({
  flete,
  openForm,
  handleToggleForm,
  handleCloseForm,
  actualizarFleteEnLista,
  submitForm,
  onEliminarRegistro,
}) {
  const [flipped, setFlipped] = useState(false)
  const [errorCierre, setErrorCierre] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formAbierto = openForm[flete.id]

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
      ...(flete.rendicion?.abonos || []),
      ...(flete.rendicion?.diesels || []),
      ...(flete.rendicion?.gastos || []),
    ]
    lista.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    return lista.slice(-2)
  }, [
    flete.rendicion?.abonos,
    flete.rendicion?.diesels,
    flete.rendicion?.gastos,
  ])

  const detallesBack = useMemo(() => {
    const lista = [
      ...(flete.rendicion?.abonos || []),
      ...(flete.rendicion?.diesels || []),
      ...(flete.rendicion?.gastos || []),
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
      {
        name: 'Diesel',
        key: 'diesel',
        icon: WrenchScrewdriverIcon,
        count: flete.rendicion?.diesels?.length ?? 0,
        current: formAbierto === 'diesel',
      },
      {
        name: 'Gasto',
        key: 'gasto',
        icon: CurrencyDollarIcon,
        count: flete.rendicion?.gastos?.length ?? 0,
        current: formAbierto === 'gasto',
      },
      {
        name: 'Viático',
        key: 'finalizar',
        icon: SparklesIcon,
        count: 0,
        current: formAbierto === 'finalizar',
      },
    ],
    [flete.rendicion, formAbierto]
  )

  const backTabs = useMemo(
    () => [
      {
        name: 'Abono',
        key: 'abono',
        icon: BankIcon,
        count: flete.rendicion?.abonos?.length ?? 0,
        current: formAbierto === 'abono',
      },
      {
        name: 'Retorno',
        key: 'retorno',
        icon: BankIcon,
        count: flete.rendicion?.retorno ? 1 : 0,
        current: formAbierto === 'retorno',
      },
      {
        name: 'Comisión',
        key: 'comision',
        icon: BankIcon,
        count: flete.rendicion?.comision != null ? 1 : 0,
        current: formAbierto === 'comision',
      },
    ],
    [flete.rendicion, formAbierto]
  )

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleFlip = useCallback(() => setFlipped((p) => !p), [])

  const cerrarRendicion = useCallback(
    async (fleteId) => {
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
    },
    [actualizarFleteEnLista]
  )

  const handleEliminarRegistro = useCallback(
    async (registro) => {
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
    },
    [flete.id, actualizarFleteEnLista]
  )

  // ─── Renderizado ────────────────────────────────────────────────────────────
  return (
    <div className={`flete-card w-full ${formAbierto ? 'expanded' : ''}`}>
      <div className={`flete-card-inner ${flipped ? 'rotate-y-180' : ''}`}>
        {/* ─── Cara Frontal ──────────────────────────────────────────────────── */}
        <div
          className={`
            flete-card-front w-full
            bg-white border border-gray-200
            shadow-md rounded-lg p-4
            ${!flipped ? 'active' : ''}
          `}
        >
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
    {/* Cerrar / Reabrir */}
    {flete.rendicion?.estado === 'Activo' ? (
      <button
        onClick={() => cerrarRendicion(flete.id)}
        disabled={isSubmitting}
        className={classNames(
          'p-2 rounded-full',
          isSubmitting
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-green-50'
        )}
      >
        {/* SVG Activo (verde) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-green-600 flex-shrink-0"
        >
          <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 0 1-1.5 0V6.75a3.75 3.75 0 1 0-7.5 0v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1-3 3H3.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3h9v-3c0-2.9 2.35-5.25 5.25-5.25Z" />
        </svg>
      </button>
    ) : (
      <button
        onClick={() => cerrarRendicion(flete.id)}
        disabled={isSubmitting}
        className={classNames(
          'p-2 rounded-full',
          isSubmitting
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-black/10'
        )}
      >
        {/* SVG Cerrado (negro) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-black flex-shrink-0"
        >
          <path
            fillRule="evenodd"
            d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    )}

    {/* Notificar / Notificado */}
    {flete.estado === 'Sin Notificar' ? (
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
          isSubmitting
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-green-50'
        )}
      >
        {/* SVG Sin Notificar (verde) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-green-600 flex-shrink-0"
        >
          <path d="M19.5 22.5a3 3 0 0 0 3-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 1 1-.712 1.321l-5.683-3.06a1.5 1.5 0 0 0-1.422 0l-5.683 3.06a.75.75 0 0 1-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 0 0 3 3h15Z" />
          <path d="M1.5 9.589v-.745a3 3 0 0 1 1.578-2.642l7.5-4.038a3 3 0 0 1 2.844 0l7.5 4.038A3 3 0 0 1 22.5 8.844v.745l-8.426 4.926-.652-.351a3 3 0 0 0-2.844 0l-.652.351L1.5 9.589Z" />
        </svg>
      </button>
    ) : (
      <span className="p-2 rounded-full">
        {/* SVG Notificado (negro) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-black flex-shrink-0"
        >
          <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
          <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
        </svg>
      </span>
    )}

    {/* Ojo */}
    <button
      onClick={handleFlip}
      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
    >
      <EyeIcon className="h-5 w-5 text-gray-600" />
    </button>
  </div>
</div>


          {/* Grid de detalles */}
<div className="grid grid-cols-3 gap-x-4 gap-y-2 mb-4 text-sm text-gray-700">
  {/* Fila 1: Titular, Salida, Viático */}
  <div className="flex items-center gap-x-2 truncate">
    <UserIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
    <span className="truncate">{flete.conductor?.name || flete.colaborador?.name || '—'}</span>
  </div>
  <div className="flex items-center gap-x-2 truncate">
    {/* SVG Salida */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
         className="h-6 w-6 text-gray-400 flex-shrink-0">
      <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5
        1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5
        0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0
        1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5
        1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75
        0 0 1 1.06 0l3 3a.75.75 0 0 1 0
        1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75
        0 0 1 0-1.5h10.94l-1.72-1.72a.75.75
        0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
    <span className="truncate">{fechaSalidaFormatted}</span>
  </div>
  <div className="flex items-center gap-x-2 text-green-600 truncate">
    <CalendarDaysIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
    <span className="truncate">${viaticoEfec.toLocaleString('es-CL')}</span>
  </div>

  {/* Fila 2: Tracto, Llegada, Saldo */}
  <div className="flex items-center gap-x-2 truncate">
    <TruckIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
    <span className="truncate">{flete.tracto?.patente || '—'}</span>
  </div>
  <div className="flex items-center gap-x-2 truncate">
    {/* SVG Llegada */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
         className="h-6 w-6 text-gray-400 flex-shrink-0">
      <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5
        1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5
        0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5
        0v3.75a3 3 0 0 0 3
        3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3
        -3h-6a3 3 0 0 0-3 3V9A.75.75 0
        1 0 9 9V5.25a1.5 1.5 0 0 1 1.5
        -1.5h6Zm-5.03 4.72a.75.75 0 0 0
        0 1.06l1.72 1.72H2.25a.75.75
        0 0 0 0 1.5h10.94l-1.72
        1.72a.75.75 0 1 0 1.06 1.06l3-3a.75.75
        0 0 0 0-1.06l-3-3a.75.75
        0 0 0-1.06 0Z" clipRule="evenodd" />
    </svg>
    <span className="truncate">{fechaLlegadaFormatted}</span>
  </div>
  <div className={`flex items-center gap-x-2 ${saldoTemporal >= 0 ? 'text-green-600' : 'text-red-600'} truncate`}>
    <BanknotesIcon className="h-5 w-5 flex-shrink-0" />
    <span className="truncate">${saldoTemporal.toLocaleString('es-CL')}</span>
  </div>

  {/* Fila 3: Rampla, Guía/Ruta, Comisión */}
  <div className="flex items-center gap-x-2 truncate">
    {/* SVG Rampla */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
         className="h-6 w-6 text-gray-400 flex-shrink-0">
      <path d="M2.25 2.25a.75.75 0 0 0 0
        1.5h1.386c.17 0 .318.114.362.278l2.558
        9.592a3.752 3.752 0 0 0-2.806 3.63c0
        .414.336.75.75.75h15.75a.75.75 0
        0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5
        15h11.218a.75.75 0 0 0 .674-.421
        60.358 60.358 0 0 0 2.96-7.228.75.75
        0 0 0-.525-.965A60.864 60.864 0 0 0
        5.68 4.509l-.232-.867A1.875 1.875 0
        0 0 3.636 2.25H2.25ZM3.75 20.25a1.5
        1.5 0 1 1 3 0 1.5 1.5 0 0 1-3
        0ZM16.5 20.25a1.5 1.5 0 1 1 3 0
        1.5 1.5 0 0 1-3 0Z" />
    </svg>
    <span className="truncate">{flete.rampla?.patente || '—'}</span>
  </div>
  <div className="flex items-center gap-x-2 truncate">
    {/* SVG Guía/Ruta */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
         className="h-6 w-6 text-gray-400 flex-shrink-0">
      <path fillRule="evenodd" d="M7.491 5.992a.75.75
        0 0 1 .75-.75h12a.75.75 0 1
        1 0 1.5h-12a.75.75 0 0
        1-.75-.75ZM7.49 11.995a.75.75 0
        0 1 .75-.75h12a.75.75 0 0 1 0
        1.5h-12a.75.75 0 0 1-.75-.75ZM7.491
        17.994a.75.75 0 0 1 .75-.75h12a.75.75
        0 1 1 0 1.5h-12a.75.75 0 0
        1-.75-.75ZM2.24 3.745a.75.75
        0 0 1 .75-.75h1.125a.75.75 0
        0 1 .75.75v3h.375a.75.75 0 0 1
        0 1.5H2.99a.75.75 0 0 1 0-1.5h.375v-2.25H2.99a.75.75
        0 0 1-.75-.75ZM2.79 10.602a.75.75
        0 0 1 0-1.06 1.875 1.875 0 1
        1 2.652 2.651l-.55.55h.35a.75.75
        0 0 1 0 1.5h-2.16a.75.75 0 0
        1-.53-1.281l1.83-1.83a.375.375 0
        0 0-.53-.53.75.75 0 0 1-1.062
        0ZM2.24 15.745a.75.75 0 0
        1 .75-.75h1.125a1.875 1.875 0 0 1
        1.501 2.999 1.875 1.875 0 0
        1-1.501 3H2.99a.75.75 0 0
        1 0-1.501h1.125a.375.375 0 0
        0 .036-.748H3.74a.75.75 0 0
        1-.75-.75v-.002a.75.75 0 0
        1 .75-.75h.411a.375.375 0 0
        0-.036-.748H2.99a.75.75 0 0
        1-.75-.75Z" clipRule="evenodd" />
    </svg>
    <span className="truncate">{flete.guiaRuta || '—'}</span>
  </div>
  <div className="flex items-center gap-x-2 text-green-600 truncate">
    <CurrencyDollarIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
    <span className="truncate">${flete.rendicion?.comision?.toLocaleString('es-CL') || '—'}</span>
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
              const esGasto = 'tipo' in r && !('litros' in r)
              const tipo = esDiesel ? 'Diesel' : esGasto ? 'Gasto' : 'Abono'
              const textColor = esDiesel
                ? 'text-blue-700'
                : esGasto
                ? 'text-red-700'
                : 'text-green-700'
              let detalle = esDiesel
                ? r.metodo_pago
                : esGasto
                ? r.tipo === 'Otro'
                  ? `Otros: ${r.descripcion}`
                  : r.tipo
                : r.metodo

              return (
                <div
                  key={i}
                  className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] items-center py-1 gap-x-2 border-b last:border-b-0"
                >
                  <div className={`${textColor} font-medium`}>{tipo}</div>
                  <div className={`${textColor} truncate`}>{detalle}</div>
                  <div className="flex items-center space-x-2">
                    <span className={textColor}>
                      ${(r.monto ?? r.total).toLocaleString('es-CL')}
                    </span>
                    <button
                      onClick={() => handleEliminarRegistro(r)}
                      disabled={isSubmitting}
                      className={classNames(
                        'ml-2',
                        isSubmitting
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-red-500 hover:text-red-700'
                      )}
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
                  {frontTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => handleToggleForm(flete.id, tab.key)}
                      className={classNames(
                        tab.current
                          ? `border-indigo-500 text-current`
                          : `border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700`,
                        'group inline-flex items-center border-b-2 px-2 py-2 text-sm font-medium transition'
                      )}
                      style={{ minWidth: 80 }}
                    >
                      <tab.icon
                        className={classNames(
                          tab.current ? 'text-current' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-1 h-4 w-4'
                        )}
                      />
                      {tab.name}
                      {tab.count > 0 && (
                        <span
                          className={classNames(
                            tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                            'ml-1 rounded-full px-1 py-0.5 text-[10px] font-medium'
                          )}
                        >
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
                  onSubmit={async (payload) => {
                    setIsSubmitting(true)
                    try {
                      await submitForm('/diesel', payload, (f) => {
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
                      await submitForm(ruta, payload, (f) => {
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
                  onSubmit={async (payload) => {
                    setIsSubmitting(true)
                    try {
                      await submitForm(`/fletes/${flete.id}/finalizar`, payload, (f) => {
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
        <div
          className={`
            flete-card-back
            bg-white border border-gray-200
            shadow-md rounded-lg p-4
            ${flipped ? 'active' : ''}
          `}
        >
          <div className="flex justify-end">
            <button onClick={handleFlip} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Detalle completo</h3>

          <div className="space-y-1 text-xs">
            {detallesBack.map((r, i) => {
              const esDiesel = 'metodo_pago' in r && 'litros' in r
              const esGasto = 'tipo' in r && !('litros' in r)
              const esAbono = !esDiesel && !esGasto && 'metodo' in r
              const tipo = esDiesel
                ? 'Diesel'
                : esGasto
                ? 'Gasto'
                : esAbono
                ? r.metodo === 'Retorno'
                  ? 'Retorno'
                  : 'Abono'
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

              const bgColor = esDiesel
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
                  className={`
                    grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)]
                    items-start py-1 gap-x-2 border-b last:border-b-0
                    ${bgColor} px-2 rounded-md
                  `}
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
                        isSubmitting
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-red-500 hover:text-red-700'
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
              <div></div>
              <div className="text-gray-700 font-medium text-right">
                ${viaticoEfec.toLocaleString('es-CL')}
              </div>
            </div>
            {/* Saldo final */}
            <div className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] text-sm font-semibold pt-1 border-t mt-2">
              <div className="col-span-2 text-green-700">Saldo final</div>
              <div className="text-right text-green-700">
                ${saldoTemporal.toLocaleString('es-CL')}
              </div>
            </div>
          </div>

          {/* Pestañas back */}
          <div className="mt-4">
            <div className="sm:hidden mb-2 px-4">
              <select
                defaultValue={backTabs.find((t) => t.current)?.name || ''}
                onChange={(e) => {
                  const sel = backTabs.find((t) => t.name === e.target.value)
                  handleToggleForm(flete.id, sel?.key || null)
                }}
                className="w-full rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-indigo-600"
              >
                <option value="">Selecciona</option>
                {backTabs.map((tab) => (
                  <option key={tab.key}>
                    {tab.name} {tab.count > 0 && `(${tab.count})`}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-4 top-3 h-5 w-5 text-gray-500" />
            </div>
            <div className="hidden sm:block border-b border-gray-200 mb-2 px-4">
              <nav className="flex justify-center space-x-4">
                {backTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleToggleForm(flete.id, tab.key)}
                    className={classNames(
                      tab.current
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'inline-flex items-center border-b-2 px-2 py-3 text-sm font-medium'
                    )}
                  >
                    <tab.icon
                      className={classNames(
                        tab.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-1 h-5 w-5'
                      )}
                    />
                    {tab.name}
                    {tab.count > 0 && (
                      <span
                        className={classNames(
                          tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                          'ml-2 rounded-full px-2 py-0.5 text-xs font-medium'
                        )}
                      >
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
                  onSubmit={async (payload) => {
                    setIsSubmitting(true)
                    try {
                      await submitForm(
                        '/abonos',
                        { ...payload, flete_id: flete.id, rendicion_id: flete.rendicion.id },
                        (f) => {
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
                  onSubmit={async (payload) => {
                    setIsSubmitting(true)
                    try {
                      await submitForm(
                        '/retornos',
                        { ...payload, flete_id: flete.id, rendicion_id: flete.rendicion.id, tipo: 'Retorno' },
                        (f) => {
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
                  onSubmit={async (payload) => {
                    setIsSubmitting(true)
                    try {
                      await submitForm(
                        '/comisiones',
                        { tipo: 'Comisión', ...payload, flete_id: flete.id, rendicion_id: flete.rendicion.id },
                        (f) => {
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
