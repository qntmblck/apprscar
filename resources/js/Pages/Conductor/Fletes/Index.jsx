import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { useState } from 'react'
import FleteCard from '@/Components/FleteCard'
import axios from 'axios'

export default function Fletes({ auth, fletes }) {
  const [fletesState, setFletesState] = useState(fletes)
  const [openForm, setOpenForm] = useState({})

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

  const handleEliminarRegistro = async (registroId) => {
    if (!confirm('¿Eliminar este registro?')) return
    try {
      const res = await axios.delete(`/registro/${registroId}`)
      if (res.data?.flete) {
        actualizarFleteEnLista(res.data.flete)
      }
    } catch (error) {
      console.error('Error al eliminar registro:', error)
    }
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Mis Fletes" />
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-min">
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
            <p className="col-span-full text-center text-gray-500">No hay fletes asignados.</p>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
