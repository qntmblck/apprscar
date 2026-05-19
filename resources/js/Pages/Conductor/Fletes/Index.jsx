import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { useState } from 'react'
import FleteCard from '@/Components/FleteCard'
import axios from 'axios'
import { TruckIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#0094d9]/10 border border-[#0094d9]/20 flex items-center justify-center mb-4">
        <TruckIcon className="w-8 h-8 text-[#0094d9]/40" />
      </div>
      <p className="text-slate-300 font-semibold">Sin fletes asignados</p>
      <p className="text-slate-500 text-sm mt-1">Tus fletes aparecerán aquí cuando sean asignados.</p>
    </div>
  )
}

function StatsBar({ fletes }) {
  const activos   = fletes.filter(f => f.estado === 'Activo').length
  const cerrados  = fletes.filter(f => f.estado === 'Cerrado').length
  const pendientes = fletes.filter(f => !['Activo','Cerrado'].includes(f.estado)).length

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { label: 'Activos',   value: activos,   icon: TruckIcon,        color: 'text-[#0094d9] bg-[#0094d9]/10 border-[#0094d9]/20' },
        { label: 'Pendientes',value: pendientes, icon: ClockIcon,        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
        { label: 'Cerrados',  value: cerrados,   icon: CheckCircleIcon,  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      ].map(({ label, value, icon: Icon, color }) => (
        <div key={label} className={`${color} border rounded-xl px-4 py-3 flex items-center gap-3`}>
          <Icon className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-xl font-extrabold text-white leading-none">{value}</p>
            <p className="text-xs mt-0.5 font-medium">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Fletes({ auth, fletes }) {
  const [fletesState, setFletesState] = useState(fletes)
  const [openForm, setOpenForm]       = useState({})

  const handleToggleForm = (fleteId, tipo) =>
    setOpenForm(prev => ({ ...prev, [fleteId]: prev[fleteId] === tipo ? null : tipo }))

  const handleCloseForm = (fleteId) =>
    setOpenForm(prev => ({ ...prev, [fleteId]: null }))

  const actualizarFleteEnLista = (nuevoFlete) =>
    setFletesState(prev => prev.map(f => (f.id === nuevoFlete.id ? nuevoFlete : f)))

  const submitForm = async (url, payload, fleteId) => {
    const formData = new FormData()
    Object.entries(payload).forEach(([key, val]) => formData.append(key, val))
    try {
      const res = await axios.post(url, formData)
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
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
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
    } catch (error) {
      console.error('Error al eliminar registro:', error)
    }
  }

  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Mis fletes" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-[#0094d9] uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <TruckIcon className="w-3.5 h-3.5" />
            Conductor
          </p>
          <h1 className="text-2xl font-extrabold text-white">Mis Fletes</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {fletesState.length} flete{fletesState.length !== 1 ? 's' : ''} asignado{fletesState.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats */}
        {fletesState.length > 0 && <StatsBar fletes={fletesState} />}

        {/* Cards */}
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
            <EmptyState />
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
