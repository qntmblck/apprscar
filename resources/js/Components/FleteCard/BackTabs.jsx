// resources/js/Components/FleteCard/BackTabs.jsx
import React from 'react'
import classNames from 'classnames'
import AbonoForm from './Forms/AbonoForm'
import RetornoForm from './Forms/RetornoForm'
import ComisionForm from './Forms/ComisionForm'

export default function BackTabs({
  flete,
  formAbierto,
  handleToggleForm = () => {},
  handleCloseForm = () => {},
  submitForm = () => Promise.resolve(),
  actualizarFleteEnLista = () => {},
  toggleFlip = () => {},
  setIsSubmitting = () => {},
}) {
  const backTabs = [
    { name: 'Abono',    key: 'abono',    count: flete.rendicion?.abonos?.length ?? 0 },
    { name: 'Retorno',  key: 'retorno',  count: flete.rendicion?.retorno ? 1 : 0 },
    { name: 'Comisión', key: 'comision', count: flete.rendicion?.comision != null ? 1 : 0 },
  ]

  return (
    <div className="mt-4">
      <div className="overflow-x-auto border-b border-gray-200 mb-2">
        <nav className="flex items-center space-x-1 px-4">
          {backTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleToggleForm(flete.id, tab.key)}
              className={classNames(
                formAbierto === tab.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700',
                'group inline-flex items-center border-b-2 px-2 py-2 text-sm font-medium transition',
                'min-w-[80px]'
              )}
            >
              {tab.name}
              {tab.count > 0 && (
                <span
                  className={classNames(
                    formAbierto === tab.key
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
      {formAbierto === 'abono' && (
        <div className="px-4">
          <AbonoForm
            fleteId={flete.id}
            rendicionId={flete.rendicion?.id}
            onSubmit={async payload => {
              setIsSubmitting(true)
              try {
                await submitForm(
                  '/abonos',
                  { ...payload, flete_id: flete.id, rendicion_id: flete.rendicion.id },
                  f => {
                    actualizarFleteEnLista(f)
                    handleCloseForm(flete.id)
                    toggleFlip()
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

      {formAbierto === 'retorno' && (
        <div className="px-4">
          <RetornoForm
            fleteId={flete.id}
            onSubmit={async payload => {
              setIsSubmitting(true)
              try {
                await submitForm(
                  '/retornos',
                  { ...payload, flete_id: flete.id, rendicion_id: flete.rendicion.id, tipo: 'Retorno' },
                  f => {
                    actualizarFleteEnLista(f)
                    handleCloseForm(flete.id)
                    toggleFlip()
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

      {formAbierto === 'comision' && (
        <div className="px-4">
          <ComisionForm
            rendicionId={flete.rendicion?.id}
            onSubmit={async payload => {
              setIsSubmitting(true)
              try {
                await submitForm(
                  '/comisiones',
                  { tipo: 'Comisión', ...payload, flete_id: flete.id, rendicion_id: flete.rendicion.id },
                  f => {
                    actualizarFleteEnLista(f)
                    handleCloseForm(flete.id)
                    toggleFlip()
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
