// resources/js/Components/FleteCard/FrontTabs.jsx
import React from 'react'
import DieselForm from './Forms/DieselForm'
import GastoForm from './Forms/GastoForm'
import FinalizarForm from './Forms/FinalizarForm'
import AdicionalForm from './Forms/AdicionalForm'

// Helper para concatenar clases
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function FrontTabs({
  tabs,
  currentTab,
  onToggle,
  onSubmit,
  isSubmitting,
  setIsSubmitting,
  flete,
  handleCloseForm,
  actualizarFleteEnLista,
}) {
  return (
    <div className="mt-4">
      {/* Navegación de pestañas */}
      <div className="overflow-x-auto">
        <nav className="flex items-center space-x-1 border-b border-gray-200">
          <div className="flex-1 flex space-x-1 overflow-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => onToggle(flete.id, tab.key)}
                className={classNames(
                  tab.current
                    ? 'border-indigo-500 text-current'
                    : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700',
                  'group inline-flex items-center border-b-2 px-2 py-2 text-sm font-medium transition'
                )}
                style={{ minWidth: 80 }}
              >
                <tab.icon
                  className={classNames(
                    tab.current
                      ? 'text-current'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-1 h-4 w-4'
                  )}
                />
                {tab.name}
                {tab.count > 0 && (
                  <span
                    className={classNames(
                      tab.current
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-900',
                      'ml-1 rounded-full px-1 py-0.5 text-[10px] font-medium'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex-shrink-0">
            {flete.pagado ? (
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded bg-black text-white ring-1 ring-inset ring-black/20">
                Pagado
              </span>
            ) : (
              <input
                type="checkbox"
                className="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
            )}
          </div>
        </nav>
      </div>

      {/* Formularios front */}
      {currentTab === 'diesel' && (
        <div className="px-2 pt-2">
          <DieselForm
            fleteId={flete.id}
            rendicionId={flete.rendicion?.id}
            onSubmit={async payload => {
              setIsSubmitting(true)
              try {
                await onSubmit('/diesel', payload, f => {
                  actualizarFleteEnLista(f)
                  handleCloseForm(flete.id)
                })
              } finally {
                setIsSubmitting(false)
              }
            }}
            onCancel={() => handleCloseForm(flete.id)}
          />
        </div>
      )}

      {currentTab === 'gasto' && (
        <div className="px-2 pt-2">
          <GastoForm
            fleteId={flete.id}
            rendicionId={flete.rendicion?.id}
            onSubmit={async payload => {
              setIsSubmitting(true)
              try {
                await onSubmit('/gastos', payload, f => {
                  actualizarFleteEnLista(f)
                  handleCloseForm(flete.id)
                })
              } finally {
                setIsSubmitting(false)
              }
            }}
            onCancel={() => handleCloseForm(flete.id)}
          />
        </div>
      )}

      {currentTab === 'finalizar' && (
        <div className="px-2 pt-2">
          <FinalizarForm
            fleteId={flete.id}
            rendicionId={flete.rendicion?.id}
            fechaSalida={flete.fecha_salida}
            onSubmit={async payload => {
              setIsSubmitting(true)
              try {
                await onSubmit(`/fletes/${flete.id}/finalizar`, payload, f => {
                  actualizarFleteEnLista(f)
                  handleCloseForm(flete.id)
                })
              } finally {
                setIsSubmitting(false)
              }
            }}
            onCancel={() => handleCloseForm(flete.id)}
          />
        </div>
      )}

      {currentTab === 'adicional' && (
        <div className="px-2 pt-2">
          <AdicionalForm
            fleteId={flete.id}
            rendicionId={flete.rendicion?.id}
            onSubmit={async payload => {
              setIsSubmitting(true)
              try {
                await onSubmit('/adicionales', payload, f => {
                  actualizarFleteEnLista(f)
                  handleCloseForm(flete.id)
                })
              } finally {
                setIsSubmitting(false)
              }
            }}
            onCancel={() => handleCloseForm(flete.id)}
          />
        </div>
      )}
    </div>
  )
}
