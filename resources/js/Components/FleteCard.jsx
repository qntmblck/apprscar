import { useState } from 'react'
import DieselForm from './Forms/DieselForm'
import GastoForm from './Forms/GastoForm'
import FinalizarForm from './Forms/FinalizarForm'
import {
  CalendarDaysIcon,
  UserIcon,
  TruckIcon,
  BanknotesIcon,
  EyeIcon,
  XMarkIcon,
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
  const formAbierto = openForm[flete.id]

  const handleFlip = () => setFlipped(!flipped)

  const colorEstadoFlete = flete.estado === 'Notificado'
    ? 'bg-black text-white'
    : 'bg-red-100 text-red-800 ring-red-600/20'

  const colorEstadoRend = flete.rendicion?.estado === 'Cerrado'
    ? 'bg-black text-white'
    : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'

  return (
    <div className={`flete-card ${formAbierto ? 'expanded' : ''}`}>
      <div className={`flete-card-inner ${flipped ? 'rotate-y-180' : ''}`}>

        {/* Cara frontal */}
        <div className={`flete-card-front bg-gray-50 ring-1 ring-gray-900/5 shadow-sm rounded-lg p-4 ${!flipped ? 'active' : ''}`}>
          <div className="flex justify-end">
            <button onClick={handleFlip} className="text-gray-400 hover:text-gray-600">
              <EyeIcon className="w-5 h-5" />
            </button>
          </div>

          <dl className="flex flex-wrap gap-y-1">
            <div className="flex-auto">
              <dt className="text-sm font-semibold text-gray-900">{flete.destino?.nombre || 'Sin destino'}</dt>
              <dd className="mt-1 text-sm text-gray-700">{flete.cliente?.razon_social || '—'}</dd>
            </div>
            <div className="flex-none px-1">
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorEstadoFlete}`}>
                {flete.estado}
              </span>
            </div>
            <div className="flex-none px-1">
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorEstadoRend}`}>
                {flete.rendicion?.estado}
              </span>
            </div>
            <div className="mt-2 flex w-full gap-x-2 items-center text-sm text-gray-700">
              <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
              Salida: {new Date(flete.fecha_salida).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex w-full gap-x-2 items-center text-sm text-gray-700">
  <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
  Llegada: {flete.fecha_llegada
  ? new Date(new Date(flete.fecha_llegada).setDate(new Date(flete.fecha_llegada).getDate() + 1)).toLocaleDateString('es-CL', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
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

          <div className="mt-3 text-sm text-gray-700">
            <p className="font-semibold mb-1">Últimos registros:</p>
            {[...(flete.rendicion?.gastos || []), ...(flete.rendicion?.diesels || [])]
              .slice(0, 2)
              .map((r, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span>{r.tipo || 'Diesel'}{r.descripcion ? ` - ${r.descripcion}` : ''}</span>
                  <span>${(r.monto ?? r.total)?.toLocaleString('es-CL')}</span>
                  <button onClick={() => onEliminarRegistro(r.id)} className="text-red-500 hover:text-red-700 ml-2">✕</button>
                </div>
              ))}
          </div>

          <div className="mt-4 flex justify-between">
            <button onClick={() => handleToggleForm(flete.id, 'diesel')} className="bg-[#44616e] hover:bg-[#3a535e] text-white px-3 py-1 rounded text-xs shadow-sm">Diesel</button>
            <button onClick={() => handleToggleForm(flete.id, 'gasto')} className="bg-[#4a5c46] hover:bg-[#3d4b3a] text-white px-3 py-1 rounded text-xs shadow-sm">Gasto</button>
            <button onClick={() => handleToggleForm(flete.id, 'finalizar')} className="bg-[#5c5040] hover:bg-[#4b4234] text-white px-3 py-1 rounded text-xs shadow-sm">Viático</button>
          </div>

          <div className="mt-2">
            {formAbierto === 'diesel' && (
              <DieselForm
                fleteId={flete.id}
                rendicionId={flete.rendicion?.id}
                onSubmit={(payload) => submitForm('/diesel', payload, flete.id)}
                onCancel={() => handleCloseForm(flete.id)}
                onSuccess={actualizarFleteEnLista}
              />
            )}
            {formAbierto === 'gasto' && (
              <GastoForm
                fleteId={flete.id}
                rendicionId={flete.rendicion?.id}
                onSubmit={(payload) => submitForm('/gasto', payload, flete.id)}
                onCancel={() => handleCloseForm(flete.id)}
                onSuccess={actualizarFleteEnLista}
              />
            )}
            {formAbierto === 'finalizar' && (
              <FinalizarForm
                fleteId={flete.id}
                rendicionId={flete.rendicion?.id}
                fechaSalida={flete.fecha_salida}
                onSubmit={(payload) => submitForm(route('fletes.finalizar'), payload, flete.id)}
                onCancel={() => handleCloseForm(flete.id)}
                onSuccess={actualizarFleteEnLista}
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

          <p className="text-xs font-medium text-gray-500">🧾 Gastos:</p>
          <ul className="text-sm text-gray-700 mb-2 list-disc list-inside">
            {flete.rendicion?.gastos?.length > 0
              ? flete.rendicion.gastos.map(g => (
                <li key={g.id}>
                  ${g.monto?.toLocaleString('es-CL')} — <button onClick={() => onEliminarRegistro(g.id)} className="text-xs text-red-500 ml-2">✕</button>
                </li>
              ))
              : <li>No hay gastos.</li>}
          </ul>

          <p className="text-xs font-medium text-gray-500">⛽ Diesel:</p>
          <ul className="text-sm text-gray-700 list-disc list-inside">
            {flete.rendicion?.diesels?.length > 0
              ? flete.rendicion.diesels.map(d => (
                <li key={d.id}>
                  ${d.monto?.toLocaleString('es-CL')} ({d.metodo_pago}) — <button onClick={() => onEliminarRegistro(d.id)} className="text-xs text-red-500 ml-2">✕</button>
                </li>
              ))
              : <li>No hay registros.</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
