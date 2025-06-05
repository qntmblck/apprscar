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

  const handleToggleForm = (fleteId, tipoFormulario) => {
    setOpenForm(prev => ({
      ...prev,
      [fleteId]: prev[fleteId] === tipoFormulario ? null : tipoFormulario,
    }))
  }

  const handleCloseForm = (fleteId) => {
    setOpenForm(prev => ({ ...prev, [fleteId]: null }))
  }

  const actualizarFleteEnLista = (fleteActualizado) => {
    setFletesState(prev =>
      prev.map(f => f.id === fleteActualizado.id ? fleteActualizado : f)
    )
  }

  const handleFilterChange = (e) => {
    setData(e.target.name, e.target.value)
  }

  const submitForm = async (ruta, payload, onSuccess, onError) => {
  try {
    let response
    if (payload?.foto instanceof File) {
      const formData = new FormData()
      for (const key in payload) {
        formData.append(key, payload[key])
      }
      response = await axios.post(ruta, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    } else {
      response = await axios.post(ruta, payload)
    }

    actualizarFleteEnLista(response.data.flete)
    onSuccess && onSuccess(response.data.flete) // ✅ importante para FinalizarForm
    return response // ✅ <--- esto es lo que faltaba
  } catch (error) {
    const mensaje = error.response?.data?.message || 'Error al procesar el formulario'
    setErrorMensaje(mensaje)
    onError && onError()
    throw error // re-lanza para que FinalizarForm lo capture
  }
}


  const eliminarRegistro = async (registroId) => {
    try {
      const response = await axios.delete(`/registro/${registroId}`)
      if (response.data.flete) {
        actualizarFleteEnLista(response.data.flete)
      }
    } catch (error) {
      console.error('Error al eliminar registro:', error)
      setErrorMensaje('No se pudo eliminar el registro.')
    }
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Fletes" />
      <div className="max-w-7xl mx-auto">
        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Conductor</label>
            <select name="conductor_id" value={data.conductor_id} onChange={handleFilterChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option value="">Todos</option>
              {conductores.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Cliente</label>
            <select name="cliente_id" value={data.cliente_id} onChange={handleFilterChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option value="">Todos</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.razon_social}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Tracto</label>
            <select name="tracto_id" value={data.tracto_id} onChange={handleFilterChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option value="">Todos</option>
              {tractos.map(t => (
                <option key={t.id} value={t.id}>{t.patente}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mensaje de error */}
        {errorMensaje && (
          <div className="bg-red-100 text-red-800 text-sm p-2 rounded mb-4">
            ❌ {errorMensaje}
          </div>
        )}

        {/* Lista de Fletes */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {fletesState.map(flete => (
            <FleteCard
              key={flete.id}
              flete={flete}
              openForm={openForm}
              handleToggleForm={handleToggleForm}
              handleCloseForm={handleCloseForm}
              actualizarFleteEnLista={actualizarFleteEnLista}
              submitForm={submitForm}
              onEliminarRegistro={eliminarRegistro}
            />
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
