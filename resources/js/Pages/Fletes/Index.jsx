import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import FleteCard from '@/Components/FleteCard'
import axios from 'axios'
import {
  UserCircleIcon,
  TruckIcon,
  BuildingOffice2Icon,
  ArrowPathIcon,
} from '@heroicons/react/20/solid'

export default function Fletes({ auth, fletes, filters, conductores, clientes, tractos }) {
  const { data, setData, get } = useForm({
    conductor_id: filters.conductor_id || '',
    cliente_id: filters.cliente_id || '',
    tracto_id: filters.tracto_id || '',
  })

  const [fletesState, setFletesState] = useState(fletes)
  const [openForm, setOpenForm] = useState({})
  const [errorMensaje, setErrorMensaje] = useState(null)

  useEffect(() => {
    get(route('fletes.index'), { preserveState: true, data })
  }, [data.conductor_id, data.cliente_id, data.tracto_id])

  useEffect(() => {
    setFletesState(fletes)
  }, [fletes])

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
      prev.map(f => (f.id === nuevoFlete.id ? { ...nuevoFlete } : f))
    )
  }

  const submitForm = async (url, payload, fleteId) => {
    const formData = new FormData()
    Object.entries(payload).forEach(([key, val]) => formData.append(key, val))

    try {
      const res = await axios.post(url, formData)
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
      setErrorMensaje(null)
      return res
    } catch (err) {
      console.error(err)
      setErrorMensaje(err.response?.data?.message || 'Error inesperado al enviar el formulario')
    }
  }

  const handleEliminarRegistro = async (registroId) => {
    try {
      const res = await axios.delete(`/registro/${registroId}`)

      if (res.data?.flete) {
        actualizarFleteEnLista(res.data.flete)
        setErrorMensaje(null)
      } else {
        setErrorMensaje('No se devolvió el flete actualizado.')
      }
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        error.message ||
        'Error inesperado al eliminar el registro'
      console.error('❌ Error:', mensaje)
      setErrorMensaje(`❌ ${mensaje}`)
    }
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Gestión de Fletes" />
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-10 space-y-6">
        {errorMensaje && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            ❌ {errorMensaje}
          </div>
        )}

        <div className="flex flex-wrap items-end gap-4 bg-gray-50 p-4 rounded-lg shadow-sm ring-1 ring-gray-200">
          {[
            { label: 'Conductor', name: 'conductor_id', options: conductores, icon: UserCircleIcon, getLabel: o => o.name },
            { label: 'Cliente', name: 'cliente_id', options: clientes, icon: BuildingOffice2Icon, getLabel: o => o.razon_social },
            { label: 'Tracto', name: 'tracto_id', options: tractos, icon: TruckIcon, getLabel: o => o.patente },
          ].map(({ label, name, options, icon: Icon, getLabel }) => (
            <div key={name} className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-gray-500" />
              <select
                value={data[name]}
                onChange={e => setData(name, e.target.value)}
                className="border p-2 rounded w-40 shadow-sm text-sm"
              >
                <option value="">{label}</option>
                {options.map(opt => (
                  <option key={opt.id} value={opt.id}>{getLabel(opt)}</option>
                ))}
              </select>
            </div>
          ))}

          {(data.conductor_id || data.cliente_id || data.tracto_id) && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded text-sm"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Limpiar
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fletesState.length > 0 ? (
            fletesState.map(flete => (
              <FleteCard
                key={flete.id}
                flete={flete}
                openForm={openForm}
                handleToggleForm={handleToggleForm}
                handleCloseForm={handleCloseForm}
                actualizarFleteEnLista={actualizarFleteEnLista}
                submitForm={submitForm}
                onEliminarRegistro={handleEliminarRegistro}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-12">
              No hay fletes con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
