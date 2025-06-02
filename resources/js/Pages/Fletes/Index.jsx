import { useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DieselForm from '@/Components/Forms/DieselForm'
import GastoForm from '@/Components/Forms/GastoForm'
import FinalizarForm from '@/Components/Forms/FinalizarForm'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Fletes({ auth, fletes, role, filters, conductores, clientes, tractos }) {
  const { data, setData, get } = useForm({
    conductor_id: filters.conductor_id || '',
    cliente_id: filters.cliente_id || '',
    tracto_id: filters.tracto_id || '',
  })

  const [openForm, setOpenForm] = useState({})
  const [fletesState, setFletesState] = useState(fletes)

  useEffect(() => {
    get(route('fletes.index'), { preserveState: true, data })
  }, [data.conductor_id, data.cliente_id, data.tracto_id])

  const clearFilters = () => {
    const reset = { conductor_id: '', cliente_id: '', tracto_id: '' }
    setData(reset)
    get(route('fletes.index'), { preserveState: true, data: reset })
  }

  const handleToggleForm = (fleteId, tipo) => {
    setOpenForm(prev => ({ ...prev, [fleteId]: prev[fleteId] === tipo ? null : tipo }))
  }

  const handleCloseForm = (fleteId) => {
    setOpenForm(prev => ({ ...prev, [fleteId]: null }))
  }

  const actualizarFleteEnLista = (nuevoFlete) => {
    setFletesState(prev =>
      prev.map(f => (f.id === nuevoFlete.id ? nuevoFlete : f))
    )
  }

  const submitForm = async (url, payload, fleteId) => {
    const formData = new FormData()
    Object.entries(payload).forEach(([key, val]) => formData.append(key, val))

    try {
      const res = await axios.post(url, formData)
      if (res.data?.flete) {
        actualizarFleteEnLista(res.data.flete)
      }
      return res
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Fletes" />
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-6">
        {(role !== 'conductor' && role !== 'cliente') && (
          <div className="mb-6 flex flex-wrap gap-3 items-end">
            <select value={data.conductor_id} onChange={e => setData('conductor_id', e.target.value)} className="border p-2 rounded shadow-sm w-full sm:w-48">
              <option value="">Conductor</option>
              {conductores.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={data.cliente_id} onChange={e => setData('cliente_id', e.target.value)} className="border p-2 rounded shadow-sm w-full sm:w-48">
              <option value="">Cliente</option>
              {clientes.map(cli => <option key={cli.id} value={cli.id}>{cli.razon_social}</option>)}
            </select>
            <select value={data.tracto_id} onChange={e => setData('tracto_id', e.target.value)} className="border p-2 rounded shadow-sm w-full sm:w-48">
              <option value="">Patente</option>
              {tractos.map(t => <option key={t.id} value={t.id}>{t.patente}</option>)}
            </select>
            {(data.conductor_id || data.cliente_id || data.tracto_id) && (
              <button onClick={clearFilters} className="bg-gray-500 text-white px-4 py-2 rounded shadow-sm hover:bg-gray-600">
                Limpiar
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {fletesState.length > 0 ? (
            fletesState.map(flete => (
              <div key={flete.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-3">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-gray-800">{flete.destino?.nombre || 'Sin destino'}</h2>
                  <p className="text-sm text-gray-600">Cliente: {flete.cliente?.razon_social || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Salida: {flete.fecha_salida || 'No registrada'}</p>
                  <p className="text-sm font-semibold text-gray-800">
                    Saldo: <span className="text-green-700">${flete.rendicion?.saldo_temporal?.toLocaleString('es-CL') || 0}</span>
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    Viático: <span className="text-blue-700">
                      ${flete.rendicion?.viatico?.toLocaleString('es-CL') || flete.rendicion?.viatico_calculado?.toLocaleString('es-CL') || 0}
                    </span>
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  <button onClick={() => handleToggleForm(flete.id, 'diesel')} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Diesel</button>
                  <button onClick={() => handleToggleForm(flete.id, 'gasto')} className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700">Gasto</button>
                  <button onClick={() => handleToggleForm(flete.id, 'finalizar')} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">Viático</button>
                </div>

                {openForm[flete.id] === 'diesel' && (
                  <DieselForm
                    fleteId={flete.id}
                    rendicionId={flete.rendicion?.id}
                    onCancel={() => handleCloseForm(flete.id)}
                    onSuccess={actualizarFleteEnLista}
                    onSubmit={(payload) => submitForm('/diesel', payload, flete.id)}
                  />
                )}

                {openForm[flete.id] === 'gasto' && (
                  <GastoForm
                    fleteId={flete.id}
                    rendicionId={flete.rendicion?.id}
                    onCancel={() => handleCloseForm(flete.id)}
                    onSuccess={actualizarFleteEnLista}
                    onSubmit={(payload) => submitForm('/gasto', payload, flete.id)}
                  />
                )}

                {openForm[flete.id] === 'finalizar' && (
                  <FinalizarForm
                    fleteId={flete.id}
                    rendicionId={flete.rendicion?.id}
                    fechaSalida={flete.fecha_salida}
                    onCancel={() => handleCloseForm(flete.id)}
                    onSuccess={actualizarFleteEnLista}
                    onSubmit={(payload) => submitForm(`/rendicion/${flete.rendicion?.id}/viatico`, payload, flete.id)}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No hay fletes disponibles.</p>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
