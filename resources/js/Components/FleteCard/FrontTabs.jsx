// resources/js/Components/FleteCard/FrontTabs.jsx
import React from 'react'
import classNames from 'classnames'
import {
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  BanknotesIcon as BankIcon
} from '@heroicons/react/20/solid'
import DieselForm from './Forms/DieselForm'
import GastoForm from './Forms/GastoForm'
import FinalizarForm from './Forms/FinalizarForm'
import AdicionalForm from './Forms/AdicionalForm'

export default function FrontTabs({
  flete,
  formAbierto,
  handleToggleForm,
  handleCloseForm,
  submitForm,
  actualizarFleteEnLista,
  setIsSubmitting
}) {
  const frontTabs = [
    { name: 'Diesel',    key: 'diesel',    icon: WrenchScrewdriverIcon, count: flete.rendicion?.diesels?.length ?? 0,    current: formAbierto === 'diesel' },
    { name: 'Gasto',     key: 'gasto',     icon: CurrencyDollarIcon,       count: flete.rendicion?.gastos?.length  ?? 0,    current: formAbierto === 'gasto' },
    { name: 'Viático',   key: 'finalizar', icon: SparklesIcon,            count: 0,                                       current: formAbierto === 'finalizar' },
    { name: 'Adicional', key: 'adicional', icon: BankIcon,                count: flete.rendicion?.adicionales?.length??0, current: formAbierto === 'adicional' }
  ]

  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <nav className="flex items-center space-x-1 border-b border-gray-200">
          <div className="flex-1 flex space-x-1 overflow-auto">
            {frontTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleToggleForm(flete.id, tab.key)}
                className={classNames(
                  tab.current ? 'border-indigo-500 text-current' : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700',
                  'group inline-flex items-center border-b-2 px-2 py-2 text-sm font-medium transition'
                )}
                style={{ minWidth: 80 }}
              >
                <tab.icon className={classNames(
                  tab.current ? 'text-current' : 'text-gray-400 group-hover:text-gray-500',
                  'mr-1 h-4 w-4'
                )} />
                {tab.name}
                {tab.count > 0 && (
                  <span className={classNames(
                    tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                    'ml-1 rounded-full px-1 py-0.5 text-[10px] font-medium'
                  )}>
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
              <input type="checkbox" className="h-4 w-4 text-green-600 border-gray-300 rounded" />
            )}
          </div>
        </nav>
      </div>

      {/* Formularios */}
      {formAbierto === 'diesel' && (
        <div className="px-2 pt-2">
          <DieselForm
            fleteId={flete.id}
            rendicionId={flete.rendicion?.id}
            onSubmit={async payload => {
              setIsSubmitting(true)
              try {
                await submitForm('/diesel', payload, f => {
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
      {formAbierto === 'gasto' && (
        <div className="px-2 pt-2">
          <GastoForm
            fleteId={flete.id}
            rendicionId={flete.rendicion?.id}
            submitForm={async (ruta, payload) => {
              setIsSubmitting(true)
              try {
                await submitForm(ruta, payload, f => {
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
      {formAbierto === 'finalizar' && (
        <div className="px-2 pt-2">
          <FinalizarForm
            fleteId={flete.id}
            rendicionId={flete.rendicion?.id}
            fechaSalida={flete.fecha_salida}
            onSubmit={async payload => {
              setIsSubmitting(true)
              try {
                await submitForm(`/fletes/${flete.id}/finalizar`, payload, f => {
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
      {formAbierto === 'adicional' && (
        <div className="px-2 pt-2">
          <AdicionalForm
            fleteId={flete.id}
            rendicionId={flete.rendicion?.id}
            onSubmit={async payload => {
              setIsSubmitting(true)
              try {
                await submitForm('/adicionales', payload, f => {
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
