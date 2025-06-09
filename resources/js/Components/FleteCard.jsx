// resources/js/Components/FleteCard.jsx

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
  const fechaSalidaFormatted = useMemo(() => {
    return flete.fecha_salida
      ? new Date(flete.fecha_salida).toLocaleDateString('es-CL')
      : '—'
  }, [flete.fecha_salida])

  const fechaLlegadaFormatted = useMemo(() => {
    return flete.fecha_llegada
      ? new Date(flete.fecha_llegada).toLocaleDateString('es-CL')
      : 'No registrada'
  }, [flete.fecha_llegada])

  const viaticoEfec = useMemo(() => {
    return flete.rendicion?.viatico_efectivo ?? 0
  }, [flete.rendicion?.viatico_efectivo])

  const saldoTemporal = useMemo(() => {
    return flete.rendicion?.saldo_temporal ?? 0
  }, [flete.rendicion?.saldo_temporal])

  // ─── Memoizados: Registros recientes y detalle completo ──────────────────────
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

  // ─── Definición de pestañas ───────────────────────────────────────────────────
  const frontTabs = useMemo(() => {
    return [
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
    ]
  }, [flete.rendicion, formAbierto])

  const backTabs = useMemo(() => {
    return [
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
    ]
  }, [flete.rendicion, formAbierto])

  // ─── Handlers ─────────────────────────────────────────────────────────────────
  const handleFlip = useCallback(() => setFlipped((prev) => !prev), [])

  const cerrarRendicion = useCallback(
    async (fleteId) => {
      setErrorCierre(null)
      setIsSubmitting(true)
      try {
        const res = await axios.post(`/fletes/${fleteId}/cerrar`)
        if (res.data?.flete) {
          actualizarFleteEnLista(res.data.flete)
        }
      } catch (e) {
        const mensaje =
          e.response?.data?.message ||
          e.response?.data?.error ||
          (e.response?.data?.errors
            ? Object.values(e.response.data.errors).flat().join(' ')
            : e.message)
        setErrorCierre('❌ ' + mensaje)
      } finally {
        setIsSubmitting(false)
      }
    },
    [actualizarFleteEnLista]
  )

  const handleEliminarRegistro = useCallback(
  async (registro) => {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;

    setIsSubmitting(true);
    try {
      // Debug: ver qué registro llega
      console.log('Eliminando registro:', registro);

      // Determina la URL según el tipo de registro
      let url;
      if ('litros' in registro) {
        url = `/diesels/${registro.id}`;                // Diesel
      } else if (registro.tipo === 'Comisión') {
        url = `/comisiones/${registro.id}`;             // Comisión
      } else if (registro.tipo) {
        url = `/gastos/${registro.id}`;                 // Gasto (incluye otros tipos)
      } else if (registro.metodo === 'Retorno') {
        url = `/retornos/${registro.id}`;               // Retorno
      } else {
        url = `/abonos/${registro.id}`;                 // Abono
      }

      // Debug: ver qué URL usamos
      console.log('URL para DELETE:', url);

      const response = await axios.delete(url);
      console.log('Respuesta DELETE:', response);

      // Después de borrar, refresca el flete
      const res = await axios.get(`/fletes/${flete.id}`);
      console.log('Flete recargado:', res.data?.flete);

      if (res.data?.flete) {
        actualizarFleteEnLista(res.data.flete);
      }
    } catch (e) {
      console.error('Error al eliminar registro:', e.response || e);
      alert('Error eliminando registro: ' + (e.response?.data?.message || e.message));
    } finally {
      setIsSubmitting(false);
    }
  },
  [flete.id, actualizarFleteEnLista]
);



  // ─── Renderizado ──────────────────────────────────────────────────────────────
  return (
    <div className={`flete-card ${formAbierto ? 'expanded' : ''}`}>
      <div className={`flete-card-inner ${flipped ? 'rotate-y-180' : ''}`}>

        {/* ─── Cara Frontal ──────────────────────────────────────────────────── */}
<div
  className={`
    flete-card-front
    bg-gray-50
    ring-1 ring-gray-900/5
    shadow-sm rounded-lg p-4
    ${!flipped ? 'active' : ''}
  `}
>
  {/* Información principal: Destino, cliente, conductor, fechas, montos */}
  <div className="grid grid-cols-[2fr_2fr_min-content] gap-x-4">
    {/* Columna 1: Destino, Salida, Conductor, Viático */}
    <div className="space-y-2">
      <div className="text-sm font-semibold text-gray-900">
        {flete.destino?.nombre || 'Sin destino'}
      </div>
      <div className="flex items-center gap-x-2 text-sm text-gray-700">
        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
        Salida: {fechaSalidaFormatted}
      </div>
      <div className="flex items-center gap-x-2 text-sm text-gray-700">
  <UserIcon className="h-5 w-5 text-gray-400" />
  {flete.conductor?.name || flete.colaborador?.name || '—'}
</div>
      <div className="flex items-center gap-x-2 text-sm text-gray-700">
        <BanknotesIcon className="h-5 w-5 text-gray-400" />
        Viático: ${viaticoEfec.toLocaleString('es-CL')}
      </div>
    </div>

    {/* Columna 2: Cliente, Llegada, Tracto, Saldo */}
    <div className="space-y-2">
      <div className="text-sm font-semibold text-gray-900">
        {flete.cliente_principal?.razon_social || 'Sin cliente'}
      </div>
      <div className="flex items-center gap-x-2 text-sm text-gray-700">
        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
        Llegada: {fechaLlegadaFormatted}
      </div>
      <div className="flex items-center gap-x-2 text-sm text-gray-700">
        <TruckIcon className="h-5 w-5 text-gray-400" />
        Tracto: {flete.tracto?.patente || '—'}
      </div>
      <div className="flex items-center gap-x-2 text-sm text-gray-700">
        <BanknotesIcon className="h-5 w-5 text-gray-400" />
        Saldo: ${saldoTemporal.toLocaleString('es-CL')}
      </div>
    </div>

    {/* Columna 3: Ojo, Cerrar/Cerrado, Notificar/Notificado */}
<div className="flex flex-col items-end space-y-1 text-xs">
  {/* Botón “Ojo” */}
  <button
    onClick={handleFlip}
    className="
      inline-flex items-center justify-center
      rounded-md p-1 text-gray-400 hover:text-gray-600
      ring-1 ring-inset ring-gray-300
    "
  >
    <EyeIcon className="w-5 h-5" />
  </button>

  {/* Cerrar / Cerrado (clicable) */}
{(() => {
  const llegada      = Boolean(flete.fecha_llegada);
  const comision     = flete.rendicion?.comision ?? 0;
  const retornoMonto = flete.retorno ?? 0;
  const puedeCerrar  = llegada && (comision > 0 ? retornoMonto > 0 : true);

  // Si está ACTIVO, mostramos “Cerrar”
  if (flete.rendicion?.estado === 'Activo') {
    return (
      <button
        onClick={async () => {
          if (!puedeCerrar) {
            alert('No puedes cerrar: falta retorno o comisión.');
            return;
          }
          setIsSubmitting(true);
          try {
            const resp = await axios.post(route('fletes.finalizar'), {
              flete_id: flete.id,
              rendicion_id: flete.rendicion.id,
              fecha_termino: new Date().toISOString().split('T')[0],
              viatico_efectivo: flete.rendicion.viatico_efectivo,
            });
            // Aquí actualizas solo este flete, sin recargar
            actualizarFleteEnLista(resp.data.flete);
          } catch (e) {
            alert('Error cierre: ' + e.message);
          } finally {
            setIsSubmitting(false);
          }
        }}
        disabled={isSubmitting}
        className={`
          inline-flex items-center justify-center
          rounded px-2 py-0.5 font-medium text-white text-[11px]
          ${isSubmitting
            ? 'bg-green-200 text-green-100 cursor-not-allowed'
            : !puedeCerrar
            ? 'bg-gray-300 text-gray-500'
            : 'bg-green-600 hover:bg-green-700 ring-1 ring-inset ring-green-300'}
        `}
      >
        Cerrar
      </button>
    );
  } else {
    // Si está CERRADO, mostramos “Cerrado” y al click reabrimos
    return (
      <button
        onClick={async () => {
          setIsSubmitting(true);
          try {
            const resp = await axios.post(route('fletes.finalizar'), {
              flete_id: flete.id,
              rendicion_id: flete.rendicion.id,
              fecha_termino: null,  // reabrir
              viatico_efectivo: flete.rendicion.viatico_efectivo,
            });
            actualizarFleteEnLista(resp.data.flete);
          } catch (e) {
            alert('Error reabrir: ' + e.message);
          } finally {
            setIsSubmitting(false);
          }
        }}
        disabled={isSubmitting}
        className={`
          inline-flex items-center justify-center
          rounded px-2 py-0.5 font-medium text-white text-[11px]
          ${isSubmitting
            ? 'bg-black/30 cursor-not-allowed'
            : 'bg-black hover:bg-gray-800 ring-1 ring-inset ring-black/20'}
        `}
      >
        Cerrado
      </button>
    );
  }
})()}






  {/* Notificar / Notificado */}
  {flete.estado === 'Sin Notificar' ? (
    <button
      onClick={async () => {
        setIsSubmitting(true)
        try {
          await submitForm(
            `/fletes/${flete.id}/notificar`,
            { flete_id: flete.id },
            actualizarFleteEnLista
          )
        } finally {
          setIsSubmitting(false)
        }
      }}
      disabled={isSubmitting}
      className={`
        inline-flex items-center justify-center
        rounded px-2 py-0.5 font-medium text-white text-[11px]
        ${
          isSubmitting
            ? 'bg-green-200 text-green-100 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 ring-1 ring-inset ring-green-300'
        }
      `}
    >
      Notificar
    </button>
  ) : (
    <span className="
      inline-flex items-center justify-center
      rounded px-2 py-0.5 font-medium
      bg-black text-white
      ring-1 ring-inset ring-black/20 text-[11px]
    ">
      Notificado
    </span>
  )}
</div>

  </div>



    {/* Mensaje de error al cerrar, si existe */}
  {errorCierre && (
    <div className="text-red-600 text-[11px] bg-red-100 p-2 rounded mt-2">
      {errorCierre}
    </div>
  )}

  {/* ─── Últimos 2 registros (Cara Frontal) ─────────────────────────────────── */}
  <div className="mt-4 space-y-1 text-xs">
    {ultimosRegistros.map((r, i) => {
      const esDiesel = 'metodo_pago' in r && 'litros' in r
      const esGasto = 'tipo' in r && !('litros' in r)
      const tipo = esDiesel ? 'Diesel' : esGasto ? 'Gasto' : 'Abono'

      const textColor = esDiesel
        ? 'text-blue-700'
        : esGasto
        ? 'text-red-700'
        : 'text-green-700'

      let detalle
      if (esDiesel) {
        detalle = r.metodo_pago
      } else if (esGasto) {
        detalle = r.tipo === 'Otro' ? `Otros: ${r.descripcion}` : r.tipo
      } else {
        detalle = r.metodo
      }

      return (
        <div
          key={i}
          className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] items-center py-0.5 gap-x-2 border-b last:border-b-0"
        >
          <div className={`${textColor} font-medium`}>{tipo}</div>
          <div className={`${textColor} truncate`}>{detalle}</div>
          <div className="flex justify-between items-center w-max">
            <span className={`${textColor}`}>
              ${(r.monto ?? r.total).toLocaleString('es-CL')}
            </span>
            <button
  onClick={() => handleEliminarRegistro(r)}
  disabled={isSubmitting}
  className={`
    ml-2
    ${isSubmitting ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}
  `}
>
  ✕
</button>

          </div>
        </div>
      )
    })}
  </div>

  {/* ─── Pestañas + Checkbox/Pagado (última fila) ───────────────────────────────── */}
  <div className="mt-4">
    <div className="overflow-x-auto">
      <nav className="flex items-center space-x-1 border-b border-gray-200">
        {/* Contenedor de pestañas: ocupan todo el ancho y se ajustan */}
        <div className="flex-1 flex space-x-1 overflow-auto">
          {frontTabs.map((tab) => {
            // Asignar color según key
            const textColor =
              tab.key === 'diesel'
                ? formAbierto === 'diesel'
                  ? 'text-blue-700'
                  : 'text-blue-500 hover:text-blue-700'
                : tab.key === 'gasto'
                ? formAbierto === 'gasto'
                  ? 'text-red-700'
                  : 'text-red-500 hover:text-red-700'
                : formAbierto === 'finalizar'
                ? 'text-yellow-800'
                : 'text-yellow-600 hover:text-yellow-800'

            return (
              <button
                key={tab.key}
                onClick={() => handleToggleForm(flete.id, tab.key)}
                className={classNames(
                  formAbierto === tab.key
                    ? `border-indigo-500 ${textColor}`
                    : `border-transparent ${textColor} hover:border-gray-300`,
                  'group flex-shrink-0 inline-flex items-center border-b-2 px-2 py-2 text-sm font-medium transition'
                )}
                style={{ minWidth: '80px' }}
              >
                <tab.icon
                  aria-hidden="true"
                  className={classNames(
                    formAbierto === tab.key
                      ? `text-current`
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-1 h-4 w-4'
                  )}
                />
                {tab.name}
                {tab.count > 0 && (
                  <span
                    className={classNames(
                      formAbierto === tab.key
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-900',
                      'ml-1 rounded-full px-1 py-0.5 text-[10px] font-medium'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Al final de la fila de pestañas: Checkbox o “Pagado” */}
        <div className="flex-shrink-0">
          {flete.pagado ? (
            <span className="
              inline-flex items-center justify-center
              rounded px-2 py-0.5 font-medium
              bg-black text-white
              ring-1 ring-inset ring-black/20 text-[11px]
            ">
              Pagado
            </span>
          ) : (
            <input
              type="checkbox"
              className="h-4 w-4 text-green-600 border-gray-300 rounded"
              onChange={(e) => {
                // lógica adicional si se requiere
              }}
            />
          )}
        </div>
      </nav>
    </div>

    {/* Renderizado condicional de formularios (Cara Frontal) */}
    {formAbierto === 'diesel' && (
      <div className="px-2 pt-2">
        <DieselForm
          fleteId={flete.id}
          rendicionId={flete.rendicion?.id}
          onSubmit={async (payload) => {
            setIsSubmitting(true)
            try {
              return await submitForm('/diesel', payload, (fleteActualizado) => {
                actualizarFleteEnLista(fleteActualizado)
                handleCloseForm(flete.id)
              })
            } finally {
              setIsSubmitting(false)
            }
          }}
          onCancel={() => handleCloseForm(flete.id)}
          onSuccess={(fleteActualizado) => {
            actualizarFleteEnLista(fleteActualizado)
            handleCloseForm(flete.id)
          }}
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
              await submitForm(ruta, payload, (fleteActualizado) => {
                actualizarFleteEnLista(fleteActualizado)
                handleCloseForm(flete.id)
              })
            } finally {
              setIsSubmitting(false)
            }
          }}
          onCancel={() => handleCloseForm(flete.id)}
          onSuccess={actualizarFleteEnLista}
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
              return await submitForm(
                route('fletes.finalizar'),
                payload,
                (fleteActualizado) => {
                  actualizarFleteEnLista(fleteActualizado)
                  handleCloseForm(flete.id)
                }
              )
            } finally {
              setIsSubmitting(false)
            }
          }}
          onCancel={() => handleCloseForm(flete.id)}
          onSuccess={(fleteActualizado) => {
            actualizarFleteEnLista(fleteActualizado)
            handleCloseForm(flete.id)
          }}
        />
      </div>
    )}
  </div>

</div>




        {/* ─── Cara Trasera ─────────────────────────────────────────────────────── */}
<div
  className={`
    flete-card-back
    bg-white border border-gray-200 p-4 shadow-md rounded-xl
    ${flipped ? 'active' : ''}
  `}
>
  <div className="flex justify-end">
    <button onClick={handleFlip} className="text-gray-400 hover:text-gray-600">
      <XMarkIcon className="w-5 h-5" />
    </button>
  </div>
  <h3 className="text-sm font-semibold text-gray-800 mb-2">Detalle</h3>

  {/* Listado completo de registros */}
  <div className="space-y-1 text-xs">
    {detallesBack.map((r, i) => {
      const esDiesel = 'metodo_pago' in r && 'litros' in r
      const esGasto = 'tipo' in r && !('litros' in r)
      // Para diferenciar Abono vs Retorno vs Comisión:
      const esAbono   = !esDiesel && !esGasto && 'metodo' in r
      const tipo =
        esDiesel
          ? 'Diesel'
          : esGasto
            ? 'Gasto'
            : esAbono
              ? (r.metodo === 'Retorno' ? 'Retorno' : 'Abono')
              : 'Comisión'

      let detalle
      if (esDiesel) {
        detalle = r.metodo_pago
      } else if (esGasto) {
        detalle = r.tipo === 'Otro' ? `Otros: ${r.descripcion}` : r.tipo
      } else if (esAbono) {
        detalle = r.metodo
      } else {
        // Comisión (modelo Gasto con tipo='Comisión')
        detalle = r.tipo === 'Comisión' ? 'Comisión' : r.tipo
      }

      const bgColor = esDiesel
        ? 'bg-blue-50 text-blue-700'
        : esGasto
        ? 'bg-red-50 text-red-700'
        : tipo === 'Retorno'
        ? 'bg-yellow-50 text-yellow-700'
        : tipo === 'Abono'
        ? 'bg-green-50 text-green-700'
        : 'bg-purple-50 text-purple-700' // Comisión

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
          <div className="flex justify-between items-center w-max">
            <span>${(r.monto ?? r.total)?.toLocaleString('es-CL')}</span>
            <button
  onClick={() => handleEliminarRegistro(r)}
  disabled={isSubmitting}
  className={`
    ml-2
    ${isSubmitting ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}
  `}
>
  ✕
</button>

          </div>
        </div>
      )
    })}

    {/* Viático fijo */}
    <div className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] text-xs items-start py-1 border-b gap-x-2">
      <div className="w-max font-medium">Viático</div>
      <div className="break-words text-gray-700"></div>
      <div className="flex justify-end items-center w-max text-gray-700 font-medium">
        ${viaticoEfec.toLocaleString('es-CL')}
      </div>
    </div>

    {/* Saldo final */}
    <div className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] font-semibold text-sm pt-1 border-t mt-2">
      <div className="text-green-700 col-span-2">Saldo final</div>
      <div className="text-green-700 text-right w-max">
        ${saldoTemporal.toLocaleString('es-CL')}
      </div>
    </div>
  </div>

  {/* ─── Pestañas y Formularios (Cara Trasera) ───────────────────────────────── */}
  <div className="mt-4">
    {/* SELECT para pantallas pequeñas */}
    <div className="grid grid-cols-1 sm:hidden mb-2 px-4">
      <select
        defaultValue={backTabs.find((tab) => tab.current)?.name || ''}
        aria-label="Select a form"
        className="
          col-start-1 row-start-1 w-full appearance-none
          rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900
          outline outline-1 -outline-offset-1 outline-gray-300
          focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600
        "
        onChange={(e) => {
          const selected = backTabs.find((t) => t.name === e.target.value)
          handleToggleForm(flete.id, selected?.key || null)
        }}
      >
        <option value="">Selecciona formulario</option>
        {backTabs.map((tab) => (
          <option key={tab.name}>
            {tab.name} {tab.count > 0 ? `(${tab.count})` : ''}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="
          pointer-events-none col-start-1 row-start-1 mr-2 size-5
          self-center justify-self-end fill-gray-500
        "
      />
    </div>

    {/* Nav para pantallas grandes */}
    <div className="hidden sm:block border-b border-gray-200 mb-2 px-4">
      <nav aria-label="Forms" className="-mb-px flex justify-center space-x-4">
        {backTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleToggleForm(flete.id, tab.key)}
            className={classNames(
              formAbierto === tab.key
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'group inline-flex items-center border-b-2 px-2 py-3 text-sm font-medium'
            )}
          >
            <tab.icon
              aria-hidden="true"
              className={classNames(
                formAbierto === tab.key
                  ? 'text-indigo-500'
                  : 'text-gray-400 group-hover:text-gray-500',
                'mr-1 h-5 w-5'
              )}
            />
            {tab.name}
            {tab.count > 0 && (
              <span
                className={classNames(
                  formAbierto === tab.key
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-900',
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

    {/* Renderizado condicional de formularios (Cara Trasera) */}

{/* ─── Abono ────────────────────────────────────────────────────────── */}
{formAbierto === 'abono' && flete.rendicion?.id && (
  <div className="px-4">
    <AbonoForm
      fleteId={flete.id}
      rendicionId={flete.rendicion.id}
      onSubmit={async (payload) => {
        setIsSubmitting(true)
        try {
          // payload already has { tipo, monto }
          await submitForm(
            '/abonos',
            {
              ...payload,
              flete_id: flete.id,
              rendicion_id: flete.rendicion.id,
            },
            (fleteActualizado) => {
              actualizarFleteEnLista(fleteActualizado)
              handleCloseForm(flete.id)
              handleFlip()
            }
          )
        } finally {
          setIsSubmitting(false)
        }
      }}
      onCancel={() => handleCloseForm(flete.id)}
      onSuccess={(fleteActualizado) => {
        actualizarFleteEnLista(fleteActualizado)
        handleCloseForm(flete.id)
        handleFlip()
      }}
    />
  </div>
)}

{/* ─── Retorno ───────────────────────────────────────────────────────── */}
{formAbierto === 'retorno' && (
  <div className="px-4">
    <RetornoForm
      fleteId={flete.id}
      onSubmit={async (payload) => {
        setIsSubmitting(true)
        try {
          // payload has { monto } — asumimos que RetornoForm expone monto directamente
          await submitForm(
            '/retornos',
            {
              ...payload,
              flete_id: flete.id,
              rendicion_id: flete.rendicion.id,
              tipo: 'Retorno',
            },
            (fleteActualizado) => {
              actualizarFleteEnLista(fleteActualizado)
              handleCloseForm(flete.id)
              handleFlip()
            }
          )
        } finally {
          setIsSubmitting(false)
        }
      }}
      onCancel={() => handleCloseForm(flete.id)}
      onSuccess={(fleteActualizado) => {
        actualizarFleteEnLista(fleteActualizado)
        handleCloseForm(flete.id)
        handleFlip()
      }}
    />
  </div>
)}

{/* ─── Comisión ──────────────────────────────────────────────────────── */}
{formAbierto === 'comision' && (
  <div className="px-4">
    <ComisionForm
      rendicionId={flete.rendicion?.id}
      onSubmit={async (payload) => {
        setIsSubmitting(true)
        try {
          // payload tiene { monto: comision_manual, descripcion }
          await submitForm(
            '/comisiones',
            {
              tipo: 'Comisión',
              ...payload,
              flete_id: flete.id,
              rendicion_id: flete.rendicion.id,
            },
            (fleteActualizado) => {
              actualizarFleteEnLista(fleteActualizado)
              handleCloseForm(flete.id)
              handleFlip()
            }
          )
        } finally {
          setIsSubmitting(false)
        }
      }}
      onCancel={() => handleCloseForm(flete.id)}
      onSuccess={(fleteActualizado) => {
        actualizarFleteEnLista(fleteActualizado)
        handleCloseForm(flete.id)
        handleFlip()
      }}
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
