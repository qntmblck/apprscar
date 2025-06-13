import {
  ArrowPathIcon,
  CalendarDaysIcon,
  FolderPlusIcon,
  MapPinIcon,
  TruckIcon,
  IdentificationIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/20/solid'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import classNames from 'classnames'
import PortalDropdown from './PortalDropdown'

export default function FiltrosBar({
  data, setData, range, setRange, get,
  activeTab, setActiveTab, suggestions, setSuggestions,
  clientes, conductores, colaboradores, tractos, destinos,
  handleToggleMultiSelect, handleCreateClick, handleClear,
  hasDest, hasClient, tooManyMulti, hasFilters, handleRangeSelect,
  // errorMensaje is now displayed only once (in Index), so we omit it here
}) {
  return (
    <div className="sticky top-[56px] z-20 bg-white border-b border-gray-200 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex-nowrap flex overflow-x-auto items-center gap-x-2">

        {/* Limpiar filtros */}
        <button
          onClick={handleClear}
          className="inline-flex items-center bg-white p-1 border-b-2 border-transparent rounded hover:border-gray-300"
        >
          <ArrowPathIcon
            className={classNames(
              hasFilters ? 'text-red-600' : 'text-gray-300',
              'h-5 w-5 hover:text-gray-600'
            )}
          />
        </button>

        {/* Cliente */}
        <FiltroBoton
          icon={BuildingStorefrontIcon}
          label="Cliente"
          isActive={activeTab === 'Cliente'}
          onClick={() => setActiveTab(activeTab === 'Cliente' ? '' : 'Cliente')}
        >
          <div className="w-44 max-h-[480px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100">
            {clientes.map(c => (
              <CheckboxItem
                key={c.id}
                label={c.razon_social}
                checked={data.cliente_ids.includes(String(c.id))}
                onClick={() => {
                  handleToggleMultiSelect('cliente_ids', c.id)
                  setActiveTab('')
                }}
              />
            ))}
          </div>
        </FiltroBoton>

        {/* Destino */}
        <FiltroBoton
          icon={MapPinIcon}
          label="Destino"
          isActive={activeTab === 'Destino'}
          onClick={() => setActiveTab(activeTab === 'Destino' ? '' : 'Destino')}
        >
          <div className="w-48 max-h-[480px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100">
            <div className="p-2">
              <input
                type="text"
                placeholder="Destino..."
                value={data.destino}
                onChange={e => {
                  setData('destino', e.target.value)
                  setData('destino_id', '')
                  setSuggestions(
                    destinos
                      .filter(d => d.nombre.toLowerCase().includes(e.target.value.toLowerCase()))
                      .slice(0, 10)
                  )
                }}
                className="w-full px-2 py-1 text-base border rounded focus:outline-none"
              />
            </div>
            {suggestions.map(d => (
              <div
                key={d.id}
                onClick={() => {
                  setData('destino', d.nombre)
                  setData('destino_id', d.id)
                  setSuggestions([])
                  get(route('fletes.index'), { preserveState: true, data })
                  setActiveTab('')
                }}
                className="px-3 py-2 text-base text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                {d.nombre}
              </div>
            ))}
          </div>
        </FiltroBoton>

        {/* Crear */}
        <div className="relative flex-shrink-0">
          <button
            onClick={handleCreateClick}
            className={classNames(
              hasDest && hasClient && !tooManyMulti
                ? 'bg-green-700 hover:bg-green-800 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
              'inline-flex items-center p-1 rounded'
            )}
          >
            <FolderPlusIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Fecha */}
        <FiltroBoton
          icon={CalendarDaysIcon}
          label="Fecha"
          isActive={activeTab === 'Fecha'}
          onClick={() => setActiveTab(activeTab === 'Fecha' ? '' : 'Fecha')}
        >
          <div className="w-64 bg-white p-2 shadow-lg rounded z-50 text-xs sm:text-sm">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleRangeSelect}
              numberOfMonths={1}
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setRange({ from: undefined, to: undefined })}
                className="text-[10px] text-gray-600 hover:text-gray-800"
              >
                X
              </button>
              <button
                onClick={() => {
                  const addOneDay = date => {
                    const d = new Date(date)
                    d.setDate(d.getDate() + 1)
                    return d.toISOString().split('T')[0]
                  }
                  const desde = range.from ? addOneDay(range.from) : ''
                  const hasta = range.to ? addOneDay(range.to) : ''
                  setData('fecha_desde', desde)
                  setData('fecha_hasta', hasta)
                  setActiveTab('')
                  get(route('fletes.index'), {
                    preserveState: true,
                    data: { ...data, fecha_desde: desde, fecha_hasta: hasta },
                  })
                }}
                className="text-[10px] text-blue-600 hover:underline"
              >
                OK
              </button>
            </div>
          </div>
        </FiltroBoton>

        {/* Titular */}
        <FiltroBoton
          icon={IdentificationIcon}
          label="Titular"
          isActive={activeTab === 'Titular'}
          onClick={() => setActiveTab(activeTab === 'Titular' ? '' : 'Titular')}
        >
          <div className="w-48 max-h-[580px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100">
            {colaboradores.map(u => {
              const isChecked = data.colaborador_ids.includes(String(u.id))
              return (
                <CheckboxItem
                  key={`col-${u.id}`}
                  label={u.name}
                  checked={isChecked}
                  onClick={() => {
                    handleToggleMultiSelect('colaborador_ids', u.id)
                    setActiveTab('')
                  }}
                  className={classNames(
                    isChecked ? 'bg-indigo-50' : '',
                    'hover:bg-indigo-100'
                  )}
                />
              )
            })}
            {conductores.map(u => (
              <CheckboxItem
                key={`c-${u.id}`}
                label={u.name}
                checked={data.conductor_ids.includes(String(u.id))}
                onClick={() => {
                  handleToggleMultiSelect('conductor_ids', u.id)
                  setActiveTab('')
                }}
              />
            ))}
          </div>
        </FiltroBoton>

        {/* Tracto */}
        <FiltroBoton
          icon={TruckIcon}
          label="Tracto"
          isActive={activeTab === 'Tracto'}
          onClick={() => setActiveTab(activeTab === 'Tracto' ? '' : 'Tracto')}
        >
          <div className="w-44 max-h-[480px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100">
            {tractos.map(t => (
              <CheckboxItem
                key={t.id}
                label={t.patente}
                checked={data.tracto_ids.includes(String(t.id))}
                onClick={() => {
                  handleToggleMultiSelect('tracto_ids', t.id)
                  setActiveTab('')
                }}
              />
            ))}
          </div>
        </FiltroBoton>
      </div>
    </div>
  )
}

function FiltroBoton({ icon: Icon, isActive, onClick, children, label }) {
  return (
    <div className="relative flex-shrink-0">
      <button
        data-toggle-type={label}
        onClick={onClick}
        className={classNames(
          isActive ? 'border-indigo-500' : 'border-transparent hover:border-indigo-300',
          'inline-flex items-center bg-white p-1 border-b-2 rounded'
        )}
      >
        <Icon className={classNames(isActive ? 'text-indigo-600' : 'text-gray-500', 'h-5 w-5')} />
      </button>
      <PortalDropdown isOpen={isActive} type={label}>
        {children}
      </PortalDropdown>
    </div>
  )
}

function CheckboxItem({ label, checked, onClick, className }) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        checked && 'bg-gray-100',
        'flex items-center px-3 py-2 text-xs sm:text-sm text-gray-700 cursor-pointer',
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        readOnly
        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
      />
      <span className="ml-2 truncate">{label}</span>
    </div>
  )
}
