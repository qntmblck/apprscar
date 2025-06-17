// resources/js/Components/FleteCard/FrontTabs.jsx
import React from 'react'
import classNames from 'classnames'
import {
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ArrowRightEndOnRectangleIcon,
  InboxArrowDownIcon,
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
  setIsSubmitting,
  // Props para selección
  selectedIds = [],
  toggleSelect,
}) {
  const dieselCount    = flete.rendicion?.diesels?.length    ?? 0
  const gastoCount     = flete.rendicion?.gastos?.length     ?? 0
  const viaticoCount   = flete.rendicion?.viaticos?.length   ?? 0
  const adicionalCount = flete.rendicion?.adicionales?.length ?? 0

  const tabs = [
    {
      key: 'adicional',
      icon: InboxArrowDownIcon,
      count: adicionalCount,
      current: formAbierto === 'adicional',
      color: 'text-black font-bold',
      hoverBg: 'hover:bg-green-50',
      label: null,
      minWidth: 36,
    },
    {
      key: 'diesel',
      icon: WrenchScrewdriverIcon,
      count: dieselCount,
      current: formAbierto === 'diesel',
      color: 'text-blue-600',
      hoverBg: 'hover:bg-blue-50',
      label: 'Diésel',
      minWidth: 80,
    },
    {
      key: 'gasto',
      icon: CurrencyDollarIcon,
      count: gastoCount,
      current: formAbierto === 'gasto',
      color: 'text-red-600',
      hoverBg: 'hover:bg-red-50',
      label: 'Gasto',
      minWidth: 80,
    },
    {
      key: 'finalizar',
      icon: ArrowRightEndOnRectangleIcon,
      count: viaticoCount,
      current: formAbierto === 'finalizar',
      color: 'text-yellow-600',
      hoverBg: 'hover:bg-yellow-50',
      label: 'Viático',
      forceIconColor: 'text-yellow-600',
      minWidth: 80,
    },
  ]

  return (
    <div className="mt-4">
      <nav className="flex items-center border-b border-gray-200 h-10">
        {/* Pestañas: scroll horizontal en overflow-x-auto */}
        <div className="flex items-center space-x-1 px-1 flex-1 overflow-x-auto">
          {tabs.map(tab => {
            const iconColorClass = tab.forceIconColor
              ? tab.forceIconColor
              : (tab.count > 0 || tab.current
                  ? tab.color
                  : 'text-gray-400 group-hover:text-gray-500')

            return (
              <button
                key={tab.key}
                onClick={() => handleToggleForm(flete.id, tab.key)}
                className={classNames(
                  'group inline-flex flex-shrink-0 items-center border-b-2 px-3 py-1 transition',
                  tab.current
                    ? `border-current ${tab.color} font-semibold`
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                  tab.hoverBg
                )}
                style={{ minWidth: tab.minWidth }}
              >
                <tab.icon className={classNames('mr-1 h-4 w-4', iconColorClass)} />
                {tab.label && <span className="text-xs">{tab.label}</span>}
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
        </div>

        {/* Checkbox siempre visible al final */}
        <div className="flex-none ml-2 flex items-center pr-2">
          {flete.pagado ? (
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-black text-white ring-1 ring-inset ring-black/20">
              Pagado
            </span>
          ) : (
            <input
              type="checkbox"
              checked={selectedIds.includes(flete.id)}
              onChange={() => toggleSelect(flete.id)}
              className="h-4 w-4 text-green-600 border-gray-300 rounded"
            />
          )}
        </div>
      </nav>

      {/* Formularios desplegables */}
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
