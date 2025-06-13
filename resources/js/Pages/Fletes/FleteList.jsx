// resources/js/Pages/Fletes/FleteList.jsx
import React, { useMemo } from 'react'
import FleteCard from '@/Components/FleteCard'

export default function FleteList({
  fletesState,
  openForm,
  showAll,
  onToggleShowAll,
  handleToggleForm,
  handleCloseForm,
  actualizarFleteEnLista,
  submitForm,
  onEliminarRegistro,
}) {
  // Memoizamos las tarjetas para evitar recrearlas en cada render
  const allCards = useMemo(
    () =>
      fletesState.map(flete => (
        <div key={flete.id} className="relative">
          <FleteCard
            flete={flete}
            openForm={openForm}
            handleToggleForm={handleToggleForm}
            handleCloseForm={handleCloseForm}
            actualizarFleteEnLista={actualizarFleteEnLista}
            submitForm={submitForm}
            onEliminarRegistro={onEliminarRegistro}
          />
        </div>
      )),
    [
      fletesState,
      openForm,
      handleToggleForm,
      handleCloseForm,
      actualizarFleteEnLista,
      submitForm,
      onEliminarRegistro,
    ]
  )

  // Control de cuántas mostrar
  const displayCards = showAll ? allCards : allCards.slice(0, 15)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayCards}
      </div>

      {allCards.length > 15 && (
        <div className="mt-4 text-center">
          <button
            onClick={onToggleShowAll}
            className="text-sm text-indigo-600 hover:underline"
          >
            {showAll
              ? 'Mostrar menos'
              : `Mostrar más (${allCards.length - 15})`}
          </button>
        </div>
      )}
    </div>
  )
}
