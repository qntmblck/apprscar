// resources/js/Components/FleteCard/DetailsGrid.jsx
import React from 'react'
import classNames from 'classnames'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import {
  IdentificationIcon,
  CalendarDaysIcon,
  TruckIcon,
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon,
  DocumentDuplicateIcon,
  CurrencyDollarIcon,
  BanknotesIcon
} from '@heroicons/react/20/solid'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import PortalDropdown from './PortalDropdown'

export default function DetailsGrid({
  flete,
  activeMenu,
  setActiveMenu,
  fechaSalidaFormatted,
  fechaLlegadaFormatted,
  viaticoEfec,
  saldoTemporal,
  conductores = [],
  colaboradores = [],
  tractos = [],
  ramplas = [],
  guias = [],
  onSelectTitular,
  onSelectFechaSalida,
  onSelectTracto,
  onSelectRampla,
  onSelectGuiaRuta,
}) {
  return (
    <div className="overflow-x-auto scrollbar-thin mb-4">
      <div className="grid min-w-0 grid-cols-[1fr_1fr_auto] gap-x-4 gap-y-2 text-sm text-gray-700">

        {/* Titular */}
        <div className="relative min-w-0 overflow-x-auto whitespace-nowrap scrollbar-thin">
          <button
            data-toggle-type="Titular"
            onClick={() => setActiveMenu(activeMenu === 'Titular' ? null : 'Titular')}
            className="flex items-center gap-x-2 w-full"
          >
            <IdentificationIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <span className="inline-block px-1">
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
        <div className="relative min-w-0 overflow-x-auto whitespace-nowrap scrollbar-thin">
          <button
            data-toggle-type="Salida"
            onClick={() => setActiveMenu(activeMenu === 'Salida' ? null : 'Salida')}
            className="flex items-center gap-x-2 w-full"
          >
            <CalendarDaysIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <span className="inline-block px-1">{fechaSalidaFormatted}</span>
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
        <div className="flex items-center gap-x-2 justify-end text-green-600">
          <CurrencyDollarIcon className="h-5 w-5 flex-shrink-0" />
          <span className="inline-block px-1">
            ${flete.rendicion?.comision?.toLocaleString('es-CL') || '—'}
          </span>
        </div>

        {/* Tracto */}
        <div className="relative min-w-0 overflow-x-auto whitespace-nowrap scrollbar-thin">
          <button
            data-toggle-type="Tracto"
            onClick={() => setActiveMenu(activeMenu === 'Tracto' ? null : 'Tracto')}
            className="flex items-center gap-x-2 w-full"
          >
            <TruckIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <span className="inline-block px-1">{flete.tracto?.patente || '—'}</span>
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

        {/* Llegada estática */}
        <div className="flex items-center gap-x-2 min-w-0 overflow-x-auto whitespace-nowrap scrollbar-thin">
          <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
          <span className="inline-block px-1">{fechaLlegadaFormatted}</span>
        </div>

        {/* Viático */}
        <div className="flex items-center gap-x-2 justify-end text-green-600">
          <CalendarDaysIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span className="inline-block px-1">${viaticoEfec.toLocaleString('es-CL')}</span>
        </div>

        {/* Rampla */}
        <div className="relative min-w-0 overflow-x-auto whitespace-nowrap scrollbar-thin">
          <button
            data-toggle-type="Rampla"
            onClick={() => setActiveMenu(activeMenu === 'Rampla' ? null : 'Rampla')}
            className="flex items-center gap-x-2 w-full"
          >
            <ShoppingCartIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
            <span className="inline-block px-1">{flete.rampla?.patente || '—'}</span>
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
        <div className="relative min-w-0 overflow-x-auto whitespace-nowrap scrollbar-thin">
          <button
            data-toggle-type="GuiaRuta"
            onClick={() => setActiveMenu(activeMenu === 'GuiaRuta' ? null : 'GuiaRuta')}
            className="flex items-center gap-x-2 w-full"
          >
            <DocumentDuplicateIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
            <span className="inline-block px-1">{flete.guiaruta || '—'}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>
          <PortalDropdown isOpen={activeMenu === 'GuiaRuta'} type="GuiaRuta">
            <div className="absolute top-0 left-0 mt-2 ml-2 w-48 bg-white border border-gray-200 shadow-lg p-2 rounded">
              <input
                autoFocus
                type="text"
                value={flete.guiaruta || ''}
                onChange={e => onSelectGuiaRuta(e.target.value)}
                onBlur={() => setActiveMenu(null)}
                onKeyDown={e => e.key === 'Enter' && setActiveMenu(null)}
                placeholder="Escribe guía/ruta..."
                className="w-full px-2 py-1 text-base border border-gray-300 rounded focus:outline-none"
              />
            </div>
          </PortalDropdown>
        </div>

        {/* Saldo */}
        <div className={classNames(
          'flex items-center gap-x-2 justify-end',
          saldoTemporal >= 0 ? 'text-green-600' : 'text-red-600'
        )}>
          <BanknotesIcon className="h-5 w-5 flex-shrink-0" />
          <span className="inline-block px-1">${saldoTemporal.toLocaleString('es-CL')}</span>
        </div>

      </div>
    </div>
  )
}
