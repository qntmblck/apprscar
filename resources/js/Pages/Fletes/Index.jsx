<?php

import { useForm } from '@inertiajs/react'
import Flashcard from '@/Components/Flashcard'

export default function Fletes({ fletes, role, filters }) {
  const { data, setData, get } = useForm({
    conductor: filters.conductor || '',
    cliente: filters.cliente || '',
    patente: filters.patente || '',
  })

  const handleFilter = () => get(route('fletes.index'))

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          {role === 'admin' || role === 'superadmin' ? 'Gestión de Fletes' : 'Mis Fletes'}
        </h2>

        {/* Filtros Avanzados */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          {(role === 'admin' || role === 'superadmin' || role === 'colaborador') && (
            <>
              <input
                type="text"
                placeholder="Conductor"
                value={data.conductor}
                onChange={e => setData('conductor', e.target.value)}
                className="rounded-lg shadow-sm p-2 border w-full lg:w-auto"
              />
              <input
                type="text"
                placeholder="Cliente"
                value={data.cliente}
                onChange={e => setData('cliente', e.target.value)}
                className="rounded-lg shadow-sm p-2 border w-full lg:w-auto"
              />
              <input
                type="text"
                placeholder="Patente"
                value={data.patente}
                onChange={e => setData('patente', e.target.value)}
                className="rounded-lg shadow-sm p-2 border w-full lg:w-auto"
              />
            </>
          )}
          <button
            onClick={handleFilter}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg w-full lg:w-auto"
          >
            Filtrar
          </button>
        </div>

        {/* Grid de flashcards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {fletes.map(flete => (
            <Flashcard key={flete.id} flete={flete} role={role} />
          ))}
        </div>
      </div>
    </div>
  )
}
