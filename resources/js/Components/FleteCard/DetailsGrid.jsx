// resources/js/Components/FleteCard/DetailsGrid.jsx
import React from 'react'
import {
  IdentificationIcon,
  CalendarDaysIcon,
  TruckIcon,
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon,
  DocumentDuplicateIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import PortalDropdown from './PortalDropdown'

// Helper para concatenar clases
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DetailsGrid({
  flete,
  fechaSalidaFormatted,
  fechaLlegadaFormatted,
  viaticoEfec,
  saldoTemporal,
  activeMenu,
  setActiveMenu,
  tempGuia,
  setTempGuia,
  conductores,
  colaboradores,
  tractos,
  ramplas,
  onSelectTitular,
  onSelectFechaSalida,
  onSelectTracto,
  onSelectRampla,
  onSelectGuiaRuta,
}) {
  return (
    <div className="overflow-x-auto mb-4">
      <div className="grid min-w-0 grid-cols-[1fr_1fr_auto] gap-x-4 gap-y-2 text-sm text-gray-700">

        {/* Titular */}
        <div className="relative min-w-0 overflow-x-auto whitespace-nowrap">
          <button
            data-toggle-type="Titular"
            onClick={() => setActiveMenu(activeMenu === 'Titular' ? null : 'Titular')}
            className="flex items-center gap-x-2 w-full"
          >
            <IdentificationIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {flete.conductor?.name || flete.colaborador?.name || '—'}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>
          <PortalDropdown isOpen={activeMenu === 'Titular'} type="Titular">
            <div className="absolute top-0 left-0 mt-2 ml-2 w-44 max-h-[480px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100 p-2">
              {(conductores.length > 0 ? conductores : colaboradores).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { onSelectTitular(opt); setActiveMenu(null) }}
                  className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                >
                  {opt.name || opt.razon_social}
                </button>
              ))}
            </div>
          </PortalDropdown>
        </div>

        {/* Salida */}
        <div className="relative min-w-0 overflow-x-auto whitespace-nowrap">
          <button
            data-toggle-type="Salida"
            onClick={() => setActiveMenu(activeMenu === 'Salida' ? null : 'Salida')}
            className="flex items-center gap-x-2 w-full"
          >
            <CalendarDaysIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{fechaSalidaFormatted}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>
          <PortalDropdown isOpen={activeMenu === 'Salida'} type="Salida">
            <div className="absolute top-0 left-0 mt-2 ml-2 bg-white border border-gray-200 shadow-lg p-2 rounded">
              <DayPicker
                mode="single"
                selected={flete.fecha_salida ? new Date(flete.fecha_salida) : undefined}
                onSelect={date => {
                  onSelectFechaSalida(date)
                  setActiveMenu(null)
                }}
              />
            </div>
          </PortalDropdown>
        </div>

        {/* Comisión */}
        <div className="flex items-center gap-x-2 justify-end text-green-600 truncate">
          <CurrencyDollarIcon className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">
            ${flete.rendicion?.comision?.toLocaleString('es-CL') || '—'}
          </span>
        </div>

        {/* Tracto */}
        <div className="relative min-w-0 overflow-x-auto whitespace-nowrap">
          <button
            data-toggle-type="Tracto"
            onClick={() => setActiveMenu(activeMenu === 'Tracto' ? null : 'Tracto')}
            className="flex items-center gap-x-2 w-full"
          >
            <TruckIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{flete.tracto?.patente || '—'}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>
          <PortalDropdown isOpen={activeMenu === 'Tracto'} type="Tracto">
            <div className="absolute top-0 left-0 mt-2 ml-2 w-44 max-h-[480px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100 p-2">
              {tractos.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { onSelectTracto(opt); setActiveMenu(null) }}
                  className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                >
                  {opt.patente}
                </button>
              ))}
            </div>
          </PortalDropdown>
        </div>

        {/* Llegada (estática) */}
        <div className="flex items-center gap-x-2 min-w-0 overflow-x-auto whitespace-nowrap">
          <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
          <span className="truncate">{fechaLlegadaFormatted}</span>
        </div>

        {/* Viático */}
        <div className="flex items-center gap-x-2 justify-end text-green-600 truncate">
          <CalendarDaysIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span className="truncate">${viaticoEfec.toLocaleString('es-CL')}</span>
        </div>

        {/* Rampla */}
        <div className="relative min-w-0 overflow-x-auto whitespace-nowrap">
          <button
            data-toggle-type="Rampla"
            onClick={() => setActiveMenu(activeMenu === 'Rampla' ? null : 'Rampla')}
            className="flex items-center gap-x-2 w-full"
          >
            <ShoppingCartIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
            <span className="truncate">{flete.rampla?.patente || '—'}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>
          <PortalDropdown isOpen={activeMenu === 'Rampla'} type="Rampla">
            <div className="absolute top-0 left-0 mt-2 ml-2 w-44 max-h-[480px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100 p-2">
              {ramplas.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { onSelectRampla(opt); setActiveMenu(null) }}
                  className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                >
                  {opt.patente}
                </button>
              ))}
            </div>
          </PortalDropdown>
        </div>

        {/* Guía/Ruta editable */}
        <div className="relative min-w-0 overflow-x-auto whitespace-nowrap">
          <button
            data-toggle-type="GuiaRuta"
            onClick={() => setActiveMenu(activeMenu === 'GuiaRuta' ? null : 'GuiaRuta')}
            className="flex items-center gap-x-2 w-full"
          >
            <DocumentDuplicateIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
            <span className="truncate">{flete.guiaruta || '—'}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>
          <PortalDropdown isOpen={activeMenu === 'GuiaRuta'} type="GuiaRuta">
            <div className="absolute top-0 left-0 mt-2 ml-2 w-48 bg-white border border-gray-200 shadow-lg p-2 rounded">
              <input
                autoFocus
                type="text"
                value={tempGuia}
                onChange={e => setTempGuia(e.target.value)}
                onBlur={() => { onSelectGuiaRuta(tempGuia); setActiveMenu(null) }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    onSelectGuiaRuta(tempGuia)
                    setActiveMenu(null)
                  }
                }}
                placeholder="Escribe guía/ruta..."
                className="w-full px-2 py-1 text-base border border-gray-300 rounded focus:outline-none"
              />
            </div>
          </PortalDropdown>
        </div>

        {/* Saldo */}
        <div
          className={classNames(
            'flex items-center gap-x-2 justify-end truncate',
            saldoTemporal >= 0 ? 'text-green-600' : 'text-red-600'
          )}
        >
          <BanknotesIcon className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">${saldoTemporal.toLocaleString('es-CL')}</span>
        </div>

      </div>
    </div>
  )
}
