// resources/js/Components/FleteCard/BackTabs.jsx
import React from 'react'
import classNames from 'classnames'
import {
  BanknotesIcon,
  ArrowPathIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid'
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
  // Conteos ajustados según la nueva lógica
  const abonoCount    = flete.rendicion?.abonos?.length ?? 0
  const retornoCount  = flete.retorno > 0 ? 1 : 0
  const comisionCount = (flete.rendicion?.comision ?? 0) > 0 ? 1 : 0

  const tabs = [
    {
      key: 'abono',
      label: 'Abono',
      icon: BanknotesIcon,
      count: abonoCount,
      current: formAbierto === 'abono',
      color: 'text-green-600',
      hoverBg: 'hover:bg-green-50',
      minWidth: 80,
    },
    {
      key: 'retorno',
      label: 'Retorno',
      icon: ArrowPathIcon,
      count: retornoCount,
      current: formAbierto === 'retorno',
      color: 'text-yellow-600',
      hoverBg: 'hover:bg-yellow-50',
      minWidth: 80,
    },
    {
      key: 'comision',
      label: 'Comisión',
      icon: SparklesIcon,
      count: comisionCount,
      current: formAbierto === 'comision',
      color: 'text-violet-600',
      hoverBg: 'hover:bg-violet-50',
      minWidth: 80,
    },
  ]

  return (
    <div className="mt-4">
      <nav className="flex items-center border-b border-gray-200 overflow-x-auto px-4 mb-2">
        {tabs.map(tab => {
          const iconClass = tab.count > 0 || tab.current
            ? tab.color
            : 'text-gray-400 group-hover:text-gray-500'

          return (
            <button
              key={tab.key}
              onClick={() => handleToggleForm(flete.id, tab.key)}
              className={classNames(
                'group inline-flex flex-shrink-0 items-center border-b-2 px-3 py-2 text-xs font-medium transition',
                tab.current
                  ? `border-current ${tab.color} font-semibold`
                  : 'border-transparent text-gray-500 hover:text-gray-700',
                tab.hoverBg
              )}
              style={{ minWidth: tab.minWidth }}
            >
              <tab.icon className={classNames('mr-1 h-4 w-4', iconClass)} />
              <span className="text-xs">{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={classNames(
                    'ml-1 rounded-full px-1 py-0.5 text-[10px] font-semibold',
                    tab.current
                      ? `bg-current/10 ${tab.color}`
                      : `bg-gray-100 ${tab.color}`
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Formularios de respaldo */}
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
                // Solo enviamos flete_id y monto
                await submitForm(
                  '/retornos',
                  { flete_id: flete.id, monto: payload.monto },
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
