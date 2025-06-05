import { useState } from 'react'
import DieselForm from './Forms/DieselForm'
import GastoForm from './Forms/GastoForm'
import FinalizarForm from './Forms/FinalizarForm'
import AbonoForm from './Forms/AbonoForm'
import axios from 'axios'
import {
  CalendarDaysIcon,
  UserIcon,
  TruckIcon,
  BanknotesIcon,
  EyeIcon,
  XMarkIcon,
  WrenchScrewdriverIcon,     // Diesel (alternativa técnica)
  CurrencyDollarIcon,        // Gasto
  SparklesIcon               // Viático
} from '@heroicons/react/20/solid'

import './FleteCard.css'

export default function FleteCard({
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
  const formAbierto = openForm[flete.id]

  const handleFlip = () => setFlipped(!flipped)

  const cerrarRendicion = async (fleteId) => {
  setErrorCierre(null)
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
  }
}



  const colorEstadoFlete = flete.estado === 'Sin Notificar'
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
    : 'bg-black text-white'

  const colorEstadoRend = flete.rendicion?.estado === 'Activo'
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
    : 'bg-black text-white'

  return (
    <div className={`flete-card ${formAbierto ? 'expanded' : ''}`}>
      <div className={`flete-card-inner ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Frente */}
<div className={`flete-card-front bg-gray-50 ring-1 ring-gray-900/5 shadow-sm rounded-lg p-4 ${!flipped ? 'active' : ''}`}>
  <div className="flex justify-end gap-2">
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorEstadoFlete}`}>
      {flete.estado === 'Sin Notificar' ? 'Notificar' : 'Notificado'}
    </span>
    {flete.rendicion?.estado === 'Activo' ? (
      <button
        onClick={() => cerrarRendicion(flete.id)}
        className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-300 bg-green-50 hover:bg-green-100"
      >
        Cerrar
      </button>
    ) : (
      <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-black text-white">
        Cerrado
      </span>
    )}
    <button onClick={handleFlip} className="text-gray-400 hover:text-gray-600 ml-2">
      <EyeIcon className="w-5 h-5" />
    </button>
  </div>

  {errorCierre && (
    <div className="text-red-600 text-[11px] bg-red-100 p-2 rounded mt-2">
      {errorCierre}
    </div>
  )}

  <dl className="flex flex-wrap gap-y-1 mt-2">
    <div className="flex-auto">
      <dt className="text-sm font-semibold text-gray-900">{flete.destino?.nombre || 'Sin destino'}</dt>
      <dd className="mt-1 text-sm text-gray-700">{flete.cliente?.razon_social || '—'}</dd>
    </div>

    <div className="mt-2 flex w-full gap-x-2 items-center text-sm text-gray-700">
      <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
      Salida: {new Date(flete.fecha_salida).toLocaleDateString('es-CL')}
    </div>
    <div className="flex w-full gap-x-2 items-center text-sm text-gray-700">
      <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
      Llegada: {flete.fecha_llegada
        ? new Date(flete.fecha_llegada).toLocaleDateString('es-CL')
        : 'No registrada'}
    </div>
    <div className="flex w-full gap-x-2 items-center text-sm text-gray-700">
      <UserIcon className="h-5 w-5 text-gray-400" />
      {flete.conductor?.name}
    </div>
    <div className="flex w-full gap-x-2 items-center text-sm text-gray-700">
      <TruckIcon className="h-5 w-5 text-gray-400" />
      Tracto: {flete.tracto?.patente}
    </div>
    <div className="flex w-full gap-x-2 items-center text-sm text-gray-700">
      <BanknotesIcon className="h-5 w-5 text-gray-400" />
      Saldo: ${flete.rendicion?.saldo_temporal?.toLocaleString('es-CL') || 0}
    </div>
    <div className="flex w-full gap-x-2 items-center text-sm text-gray-700">
      <BanknotesIcon className="h-5 w-5 text-gray-400" />
      Viático: ${flete.rendicion?.viatico_efectivo?.toLocaleString('es-CL') || 0}
    </div>
  </dl>

  {/* Últimos 2 registros */}
<div className="mt-3 space-y-1 text-xs text-gray-800">
  {[...(flete.rendicion?.abonos || []), ...(flete.rendicion?.diesels || []), ...(flete.rendicion?.gastos || [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2)
    .map((r, i) => {
      const esDiesel = 'metodo_pago' in r && 'litros' in r
      const esGasto = 'tipo' in r && !('litros' in r)
      const tipo = esDiesel ? 'Diesel' : esGasto ? 'Gasto' : 'Abono'
      const detalle = esDiesel
        ? r.metodo_pago
        : esGasto
        ? r.tipo
        : r.tipo || r.metodo_pago || '—'

      return (
        <div key={i} className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] items-center py-0.5 gap-x-2 border-b last:border-b-0">
          <div>{tipo}</div>
          <div>{detalle}</div>
          <div className="flex justify-between items-center w-max">
            <span>${(r.monto ?? r.total)?.toLocaleString('es-CL')}</span>
            <button
              onClick={() => onEliminarRegistro(r.id)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )
    })}
</div>


  {/* Botones de formularios con íconos tipo contacto */}
<div className="mt-4 -mx-4 flex divide-x divide-gray-200 rounded-lg overflow-hidden text-sm text-white">
  <div className="flex w-0 flex-1">
    <button
      onClick={() => handleToggleForm(flete.id, 'diesel')}
      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-2 bg-[#44616e] hover:bg-[#3a535e] py-3 font-semibold"
    >
      <WrenchScrewdriverIcon className="h-5 w-5 text-white" />
      Diesel
    </button>
  </div>
  <div className="flex w-0 flex-1">
    <button
      onClick={() => handleToggleForm(flete.id, 'gasto')}
      className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-2 bg-[#4a5c46] hover:bg-[#3d4b3a] py-3 font-semibold"
    >
      <CurrencyDollarIcon className="h-5 w-5 text-white" />
      Gasto
    </button>
  </div>
  <div className="flex w-0 flex-1">
    <button
      onClick={() => handleToggleForm(flete.id, 'finalizar')}
      className="relative -ml-px inline-flex w-0 flex-1 items-center justify-center gap-x-2 bg-[#5c5040] hover:bg-[#4b4234] py-3 font-semibold"
    >
      <SparklesIcon className="h-5 w-5 text-white" />
      Viático
    </button>
  </div>
</div>



  <div className="mt-2">
    {formAbierto === 'diesel' && (
      <DieselForm
        fleteId={flete.id}
        rendicionId={flete.rendicion?.id}
        onSubmit={(payload) => axios.post('/diesel', payload)}
        onCancel={() => handleCloseForm(flete.id)}
        onSuccess={(fleteActualizado) => actualizarFleteEnLista(fleteActualizado)}
      />
    )}
    {formAbierto === 'gasto' && (
      <GastoForm
        fleteId={flete.id}
        rendicionId={flete.rendicion?.id}
        submitForm={(ruta, payload) =>
          submitForm(ruta, payload, (fleteActualizado) => {
            actualizarFleteEnLista(fleteActualizado)
            handleCloseForm(flete.id)
          })
        }
        onCancel={() => handleCloseForm(flete.id)}
        onSuccess={actualizarFleteEnLista}
      />
    )}
    {formAbierto === 'finalizar' && (
      <FinalizarForm
        fleteId={flete.id}
        rendicionId={flete.rendicion?.id}
        fechaSalida={flete.fecha_salida}
        onSubmit={(payload) =>
          submitForm(route('fletes.finalizar'), payload, (fleteActualizado) => {
            actualizarFleteEnLista(fleteActualizado)
            handleCloseForm(flete.id)
          })
        }
        onCancel={() => handleCloseForm(flete.id)}
      />
    )}
  </div>
</div>

        {/* Cara trasera */}
        <div className={`flete-card-back bg-white border border-gray-200 p-4 shadow-md rounded-xl ${flipped ? 'active' : ''}`}>
          <div className="flex justify-end">
            <button onClick={handleFlip} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Detalle</h3>

          <div className="space-y-1 text-xs text-gray-800">
            {[...(flete.rendicion?.abonos || []), ...(flete.rendicion?.diesels || []), ...(flete.rendicion?.gastos || [])].map((r, i) => {
              const esDiesel = 'metodo_pago' in r && 'litros' in r
              const esGasto = 'tipo' in r && !('litros' in r)
              const esAbono = !esDiesel && !esGasto

              const tipo = esDiesel ? 'Diesel' : esGasto ? 'Gasto' : 'Abono'
              const detalle = esDiesel ? r.metodo_pago : esGasto ? r.tipo : r.tipo || r.metodo_pago || '—'

              return (
                <div key={i} className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] text-xs items-start py-1 border-b last:border-b-0 gap-x-2">
                  <div className="w-max">{tipo}</div>
                  <div className="break-words">{detalle}</div>
                  <div className="flex justify-between items-center w-max">
                    <span>${(r.monto ?? r.total)?.toLocaleString('es-CL')}</span>
                    <button
                      onClick={() => onEliminarRegistro(r.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}

            <div className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] text-xs items-start py-1 border-b gap-x-2">
              <div className="w-max font-medium">Viático</div>
              <div className="break-words text-gray-700"></div>
              <div className="flex justify-end items-center w-max text-gray-700 font-medium">
                ${flete.rendicion?.viatico_efectivo?.toLocaleString('es-CL') || 0}
              </div>
            </div>

            <div className="grid grid-cols-[minmax(50px,max-content)_1fr_minmax(70px,max-content)] font-semibold text-sm pt-1 border-t mt-2">
              <div className="text-green-700 col-span-2">Saldo final</div>
              <div className="text-green-700 text-right w-max">
                ${flete.rendicion?.saldo_temporal?.toLocaleString('es-CL') || 0}
              </div>
            </div>
          </div>

          <div className="mt-4">
            {flete.rendicion?.id && (
              <AbonoForm
  fleteId={flete.id}
  rendicionId={flete.rendicion.id}
  onSubmit={(ruta, payload) =>
    submitForm(ruta, payload, (fleteActualizado) => {
      actualizarFleteEnLista(fleteActualizado)
      handleCloseForm(flete.id)
    })
  }
  onCancel={() => handleCloseForm(flete.id)}
  onSuccess={actualizarFleteEnLista}
/>

            )}
          </div>
        </div>

      </div>
    </div>
  )
}
