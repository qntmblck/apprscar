// resources/js/Pages/Fletes/FiltrosBar.jsx
import React, { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  FolderPlusIcon,
  MapPinIcon,
  TruckIcon,
  IdentificationIcon,
  BuildingStorefrontIcon,
  LockClosedIcon,
  LockOpenIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  XMarkIcon as XIcon,
} from '@heroicons/react/20/solid'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import classNames from 'classnames'
import PortalDropdown from './PortalDropdown'

export default function FiltrosBar({
  data,
  setData,
  range,
  setRange,
  get,
  activeTab,
  setActiveTab,
  clientes,
  conductores,
  colaboradores,
  tractos,
  destinos,
  handleToggleMultiSelect,
  handleCreateClick,
  handleClear,
  hasDest,
  hasClient,
  tooManyMulti,
  hasFilters,
  handleRangeSelect,
  topDestinos = destinos.slice(0, 10),
}) {
  const { props } = usePage()
  const [clientesList, setClientesList] = useState(clientes)
  const [destInput, setDestInput] = useState('')
  const [localSuggestions, setLocalSuggestions] = useState(topDestinos)

  // Sync clientesList si props cambian
  useEffect(() => {
    setClientesList(props.clientes)
  }, [props.clientes])

  // Filtrar sugerencias mientras el usuario escribe
  const handleDestSearch = e => {
    const v = e.target.value
    setDestInput(v)

    if (!v.trim()) {
      setLocalSuggestions(topDestinos)
    } else {
      setLocalSuggestions(
        destinos
          .filter(d => d.nombre.toLowerCase().includes(v.toLowerCase()))
          .slice(0, 10)
      )
    }
  }

  const onCrear = () => {
    if (!hasDest || !hasClient) return

    handleCreateClick({
      destino_id:           data.destino_ids[0],
      cliente_principal_id: data.cliente_ids[0],
      conductor_id:         data.conductor_ids[0]   ?? null,
      colaborador_id:       data.colaborador_ids[0] ?? null,
      tracto_id:            data.tracto_ids[0]      ?? null,
    })
  }

  return (
    <div className="sticky top-[56px] z-20 bg-white border-b border-gray-200 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-x-2 overflow-x-auto">

        {/* Limpiar filtros */}
        <button
          onClick={() => window.location.href = '/fletes'}
          className="inline-flex items-center p-1 bg-white border-b-2 border-transparent rounded hover:border-gray-300"
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
          hasSelection={data.cliente_ids.length > 0}
          onClick={() =>
            setActiveTab(activeTab === 'Cliente' ? '' : 'Cliente')
          }
        >
          <div className="w-44 max-h-[480px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100">
            {clientesList.map(c => (
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
          hasSelection={data.destino_ids.length > 0}
          onClick={() =>
            setActiveTab(activeTab === 'Destino' ? '' : 'Destino')
          }
        >
          <div
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            className="w-48 max-h-[480px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100 z-50"
          >
            <div className="p-2">
              <input
                type="text"
                placeholder="Buscar destino..."
                value={destInput}
                onChange={handleDestSearch}
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                className="w-full px-2 py-1 text-base border rounded focus:outline-none"
              />
            </div>

            {data.destino_ids.length > 0 && (
              <div className="divide-y divide-gray-100">
                {data.destino_ids.map(selId => {
                  const d = destinos.find(x => String(x.id) === String(selId))
                  return (
                    <div
                      key={d.id}
                      className="flex items-center justify-between px-3 py-2 text-base cursor-pointer hover:bg-gray-100"
                    >
                      <span>{d.nombre}</span>
                      <button
                        onClick={() => {
                          handleToggleMultiSelect('destino_ids', d.id)
                          get('/fletes', { preserveState: true, data })
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <XIcon className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {localSuggestions
              .filter(d => !data.destino_ids.includes(String(d.id)))
              .map(d => (
                <div
                  key={d.id}
                  onClick={() => {
                    handleToggleMultiSelect('destino_ids', d.id)
                    setDestInput('')            // sólo al seleccionar, limpiamos
                    setLocalSuggestions([])
                    setActiveTab('')
                    get('/fletes', { preserveState: true, data })
                  }}
                  className="px-3 py-2 text-base text-gray-700 cursor-pointer hover:bg-gray-100"
                >
                  {d.nombre}
                </div>
              ))}
          </div>
        </FiltroBoton>

        {/* Titular (multi) */}
        <FiltroBoton
          icon={IdentificationIcon}
          label="Titular"
          isActive={activeTab === 'Titular'}
          hasSelection={
            data.colaborador_ids.length + data.conductor_ids.length > 0
          }
          onClick={() =>
            setActiveTab(activeTab === 'Titular' ? '' : 'Titular')
          }
        >
          <div className="w-48 max-h-[580px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100">
            {colaboradores.map(col => (
              <CheckboxItem
                key={`col-${col.id}`}
                label={col.name}
                checked={data.colaborador_ids.some(id => Number(id) === col.id)}
                onClick={() =>
                  handleToggleMultiSelect('colaborador_ids', col.id)
                }
              />
            ))}
            {conductores.map(cond => (
              <CheckboxItem
                key={`cond-${cond.id}`}
                label={cond.name}
                checked={data.conductor_ids.some(id => Number(id) === cond.id)}
                onClick={() =>
                  handleToggleMultiSelect('conductor_ids', cond.id)
                }
              />
            ))}
          </div>
        </FiltroBoton>

        {/* Tracto (multi) */}
        <FiltroBoton
          icon={TruckIcon}
          label="Tracto"
          isActive={activeTab === 'Tracto'}
          hasSelection={data.tracto_ids.length > 0}
          onClick={() =>
            setActiveTab(activeTab === 'Tracto' ? '' : 'Tracto')
          }
        >
          <div className="w-44 max-h-[480px] overflow-auto bg-white shadow-lg rounded divide-y divide-gray-100">
            {tractos.map(t => (
              <CheckboxItem
                key={t.id}
                label={t.patente}
                checked={data.tracto_ids.some(id => Number(id) === t.id)}
                onClick={() => handleToggleMultiSelect('tracto_ids', t.id)}
              />
            ))}
          </div>
        </FiltroBoton>

        {/* Crear */}
        <div className="relative flex-shrink-0">
          <button
            onClick={onCrear}
            className={classNames(
              hasDest && hasClient
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
          hasSelection={!!data.fecha_desde || !!data.fecha_hasta}
          onClick={() =>
            setActiveTab(activeTab === 'Fecha' ? '' : 'Fecha')
          }
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
                  get('/fletes', {
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

        {/* Rendición */}
        <div className="relative flex-shrink-0">
          <button
            data-toggle-type="Rendición"
            onClick={() =>
              setActiveTab(activeTab === 'Rendición' ? '' : 'Rendición')
            }
            className={classNames(
              activeTab === 'Rendición'
                ? 'border-violet-500'
                : 'border-transparent hover:border-violet-300',
              'inline-flex items-center bg-white p-1 border-b-2 rounded'
            )}
          >
            {!data.rendicion_estado && (
              <LockClosedIcon className="h-5 w-5 text-gray-500" />
            )}
            {data.rendicion_estado === 'Activo' && (
              <LockOpenIcon className="h-5 w-5 text-green-600" />
            )}
            {data.rendicion_estado === 'Cerrado' && (
              <LockClosedIcon className="h-5 w-5 text-red-600" />
            )}
          </button>
          <PortalDropdown isOpen={activeTab === 'Rendición'} type="Rendición">
            <div className="w-32 bg-white shadow-lg rounded divide-y divide-gray-100">
              <button
                onClick={() => {
                  setData('rendicion_estado', '')
                  setActiveTab('')
                  get('/fletes', { preserveState: true, data })
                }}
                className="flex items-center px-3 py-2 hover:bg-gray-100 w-full"
              >
                <LockClosedIcon className="h-5 w-5 text-gray-500 mr-2" />
                Todas
              </button>
              <button
                onClick={() => {
                  setData('rendicion_estado', 'Activo')
                  setActiveTab('')
                  get('/fletes', {
                    preserveState: true,
                    data: { ...data, rendicion_estado: 'Activo' },
                  })
                }}
                className="flex items-center px-3 py-2 hover:bg-gray-100 w-full"
              >
                <LockOpenIcon className="h-5 w-5 text-green-600 mr-2" />
                Activo
              </button>
              <button
                onClick={() => {
                  setData('rendicion_estado', 'Cerrado')
                  setActiveTab('')
                  get('/fletes', {
                    preserveState: true,
                    data: { ...data, rendicion_estado: 'Cerrado' },
                  })
                }}
                className="flex items-center px-3 py-2 hover:bg-gray-100 w-full"
              >
                <LockClosedIcon className="h-5 w-5 text-red-600 mr-2" />
                Cerrado
              </button>
            </div>
          </PortalDropdown>
        </div>

        {/* Notificación */}
        <div className="relative flex-shrink-0">
          <button
            data-toggle-type="Notificación"
            onClick={() =>
              setActiveTab(activeTab === 'Notificación' ? '' : 'Notificación')
            }
            className={classNames(
              activeTab === 'Notificación'
                ? 'border-violet-500'
                : 'border-transparent hover:border-violet-300',
              'inline-flex items-center bg-white p-1 border-b-2 rounded'
            )}
          >
            {!data.notificar_estado && (
              <EnvelopeIcon className="h-5 w-5 text-gray-500" />
            )}
            {data.notificar_estado === 'Sin Notificar' && (
              <EnvelopeOpenIcon className="h-5 w-5 text-green-600" />
            )}
            {data.notificar_estado === 'Notificado' && (
              <EnvelopeIcon className="h-5 w-5 text-black" />
            )}
          </button>
          <PortalDropdown isOpen={activeTab === 'Notificación'} type="Notificación">
            <div className="w-32 bg-white shadow-lg rounded divide-y divide-gray-100">
              <button
                onClick={() => {
                  setData('notificar_estado', '')
                  setActiveTab('')
                  get('/fletes', { preserveState: true, data })
                }}
                className="flex items-center px-3 py-2 hover:bg-gray-100 w-full"
              >
                <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                Todas
              </button>
              <button
                onClick={() => {
                  setData('notificar_estado', 'Sin Notificar')
                  setActiveTab('')
                  get('/fletes', {
                    preserveState: true,
                    data: { ...data, notificar_estado: 'Sin Notificar' },
                  })
                }}
                className="flex items-center:px-3 py-2 hover:bg-gray-100 w-full"
              >
                <EnvelopeOpenIcon className="h-5 w-5 text-green-600 mr-2" />
                Sin Notificar
              </button>
              <button
                onClick={() => {
                  setData('notificar_estado', 'Notificado')
                  setActiveTab('')
                  get('/fletes', {
                    preserveState: true,
                    data: { ...data, notificar_estado: 'Notificado' },
                  })
                }}
                className="flex items-center:px-3 py-2 hover:bg-gray-100 w-full"
              >
                <EnvelopeIcon className="h-5 w-5 text-black mr-2" />
                Notificado
              </button>
            </div>
          </PortalDropdown>
        </div>

      </div>
    </div>
  )
}

function FiltroBoton({ icon: Icon, isActive, hasSelection = false, onClick, children, label }) {
  return (
    <div className="relative flex-shrink-0">
      <button
        data-toggle-type={label}
        onClick={onClick}
        className={classNames(
          isActive ? 'border-violet-500' : 'border-transparent hover:border-violet-300',
          'inline-flex items-center bg-white p-1 border-b-2 rounded'
        )}
      >
        <Icon
          className={classNames(
            isActive || hasSelection ? 'text-violet-600' : 'text-gray-500',
            'h-5 w-5'
          )}
        />
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
