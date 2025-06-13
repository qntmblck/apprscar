// resources/js/Components/FleteCard/BackTabs.jsx
import React from 'react'
import AbonoForm from './Forms/AbonoForm'
import RetornoForm from './Forms/RetornoForm'
import ComisionForm from './Forms/ComisionForm'

// Helper para concatenar clases
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function BackTabs({
  tabs,
  currentTab,
  onToggle,
  onSubmit,
  isSubmitting,
  setIsSubmitting,
  flete,
  handleCloseForm,
  actualizarFleteEnLista,
  onFlip,
}) {
  return (
    <div className="mt-4">
      {/* Navegación de pestañas back */}
      <div className="overflow-x-auto border-b border-gray-200 mb-2 px-4">
        <nav className="flex items-center space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => onToggle(flete.id, tab.key)}
              className={classNames(
                tab.current
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700',
                'group inline-flex items-center border-b-2 px-2 py-2 text-sm font-medium transition'
              )}
              style={{ minWidth: 80 }}
            >
              <tab.icon
                className={classNames(
                  tab.current
                    ? 'text-indigo-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'mr-1 h-5 w-5'
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
        </nav>
      </div>

      {/* Formularios back */}
      {currentTab === 'abono' && (
        <div className="px-4">
          <AbonoForm
            fleteId={flete.id}
            rendicionId={flete.rendicion?.id}
            onSubmit={async payload => {
              setIsSubmitting(true)
              try {
                await onSubmit(
                  '/abonos',
                  { ...payload, flete_id: flete.id, rendicion_id: flete.rendicion.id },
                  f => {
                    actualizarFleteEnLista(f)
                    handleCloseForm(flete.id)
                    onFlip()
                  }
                )
              } finally {
                setIsSubmitting(false)
              }
            }}
            onCancel={() => handleCloseForm(flete.id)}
          />
        </div>
      )}

      {currentTab === 'retorno' && (
        <div className="px-4">
          <RetornoForm
            fleteId={flete.id}
            onSubmit={async payload => {
              setIsSubmitting(true)
              try {
                await onSubmit(
                  '/retornos',
                  { ...payload, flete_id: flete.id, rendicion_id: flete.rendicion.id, tipo: 'Retorno' },
                  f => {
                    actualizarFleteEnLista(f)
                    handleCloseForm(flete.id)
                    onFlip()
                  }
                )
              } finally {
                setIsSubmitting(false)
              }
            }}
            onCancel={() => handleCloseForm(flete.id)}
          />
        </div>
      )}

      {currentTab === 'comision' && (
        <div className="px-4">
          <ComisionForm
            rendicionId={flete.rendicion?.id}
            onSubmit={async payload => {
              setIsSubmitting(true)
              try {
                await onSubmit(
                  '/comisiones',
                  { tipo: 'Comisión', ...payload, flete_id: flete.id, rendicion_id: flete.rendicion.id },
                  f => {
                    actualizarFleteEnLista(f)
                    handleCloseForm(flete.id)
                    onFlip()
                  }
                )
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
