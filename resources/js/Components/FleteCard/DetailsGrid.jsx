// resources/js/Components/DetailsGrid.jsx
import './Header.css'
import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import {
  IdentificationIcon,
  CalendarDaysIcon,
  TruckIcon,
  ArrowRightEndOnRectangleIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  CheckIcon
} from '@heroicons/react/20/solid'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import PortalDropdown from './PortalDropdown'
import axios from 'axios'

// Helper para parsear "YYYY-MM-DD" como medianoche local
const parseLocalDate = iso => new Date(iso + 'T00:00')

export default function DetailsGrid({
  flete,
  activeMenu,
  setActiveMenu,
  fechaSalidaFormatted,
  fechaLlegadaFormatted,
  conductores = [],
  colaboradores = [],
  tractos = [],
  ramplas = [],
  onSelectFechaSalida,   // recibe (id, Date)
  onSelectFechaLlegada,  // recibe (id, Date)
}) {
  const nombreDestino = flete.destino?.nombre ?? '[sin destino]'
  const cliente = flete.clientePrincipal?.razon_social
                ?? flete.cliente?.razon_social
                ?? '[sin cliente]'
  const destinoClienteLabel = `${nombreDestino}-${cliente}`

  const titularInputRef  = useRef(null)
  const tractoInputRef   = useRef(null)
  const ramplaInputRef   = useRef(null)
  const guiaRutaInputRef = useRef(null)

  const [titularText,  setTitularText]  = useState(flete.conductor?.name || flete.colaborador?.name || '')
  const [tractoText,   setTractoText]   = useState(flete.tracto?.patente || '')
  const [ramplaText,   setRamplaText]   = useState(flete.rampla?.patente || '')
  const [guiaRutaText, setGuiaRutaText] = useState(flete.guiaruta || '')

  const [titularSug, setTitularSug] = useState([])
  const [tractoSug,  setTractoSug]  = useState([])
  const [ramplaSug,  setRamplaSug]  = useState([])

  const [errorMsg, setErrorMsg] = useState('')

  const [selectedSalida,  setSelectedSalida]  = useState(
    flete.fecha_salida ? parseLocalDate(flete.fecha_salida) : undefined
  )
  const [selectedLlegada, setSelectedLlegada] = useState(
    flete.fecha_llegada ? parseLocalDate(flete.fecha_llegada) : undefined
  )

  useEffect(() => {
    if (activeMenu === 'Titular')  titularInputRef.current?.focus({ preventScroll: true })
    if (activeMenu === 'Tracto')   tractoInputRef.current?.focus({ preventScroll: true })
    if (activeMenu === 'Rampla')   ramplaInputRef.current?.focus({ preventScroll: true })
    if (activeMenu === 'GuiaRuta') guiaRutaInputRef.current?.focus({ preventScroll: true })
  }, [activeMenu])

  useEffect(() => {
    setTitularText(flete.conductor?.name || flete.colaborador?.name || '')
    setTractoText(flete.tracto?.patente || '')
    setRamplaText(flete.rampla?.patente || '')
    setGuiaRutaText(flete.guiaruta || '')
    setSelectedSalida(flete.fecha_salida ? parseLocalDate(flete.fecha_salida) : undefined)
    setSelectedLlegada(flete.fecha_llegada ? parseLocalDate(flete.fecha_llegada) : undefined)
    setErrorMsg('')
  }, [flete])

  const filterOpts = (list, text) =>
    list.filter(x => (x.name || x.patente).toLowerCase().includes(text.toLowerCase())).slice(0, 10)

  const handleUpdate = async (url, payload, applyText) => {
    setErrorMsg('')
    try {
      const res = await axios.post(url, payload)
      applyText(res.data.flete)
      setActiveMenu(null)
    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data?.errors || {}).flat().join(' ')
        || err.message
        || 'Error al guardar'
      setErrorMsg(msg)
    }
  }

  const openTitular = async () => {
    const opening = activeMenu !== 'Titular'
    setActiveMenu(opening ? 'Titular' : null)
    if (!opening) return
    setTitularSug([])
    try {
      const { data } = await axios.get(window.route('fletes.suggestTitulares'))
      setTitularSug(data.suggestions)
    } catch {
      setTitularSug([...conductores, ...colaboradores].slice(0, 10))
    }
  }

  const openTracto = () => {
    const opening = activeMenu !== 'Tracto'
    setActiveMenu(opening ? 'Tracto' : null)
    if (opening) setTractoSug(tractos.slice(0, 10))
  }

  const openRampla = () => {
    const opening = activeMenu !== 'Rampla'
    setActiveMenu(opening ? 'Rampla' : null)
    if (opening) setRamplaSug(ramplas.slice(0, 10))
  }

  const openGuiaRuta = () => {
    const opening = activeMenu !== 'GuiaRuta'
    setActiveMenu(opening ? 'GuiaRuta' : null)
  }

  return (
    <div className="overflow-x-auto scrollbar-thin mb-4">
      {errorMsg && <div className="mb-2 text-sm text-red-600 px-2">{errorMsg}</div>}
      <div className="grid min-w-0 grid-cols-[1fr_1fr] gap-x-4 gap-y-2 text-sm text-gray-700">

        {/* Titular */}
        <div className="relative whitespace-nowrap">
          <button
            data-toggle-type="Titular"
            onClick={openTitular}
            className={classNames(
              'flex items-center gap-x-2 w-full p-1 border-b-2 rounded',
              activeMenu === 'Titular'
                ? 'border-violet-600'
                : 'border-transparent hover:border-gray-300'
            )}
          >
            <IdentificationIcon
              className={classNames(
                'h-5 w-5 flex-shrink-0',
                activeMenu === 'Titular' ? 'text-violet-600' : 'text-sky-800'
              )}
            />
            <span
              className={classNames(
                'truncate px-1',
                activeMenu === 'Titular' ? 'text-violet-600' : ''
              )}
            >
              {titularText || '—'}
            </span>
            <ChevronDownIcon
              className={classNames(
                'h-4 w-4',
                activeMenu === 'Titular' ? 'text-violet-600' : 'text-gray-500'
              )}
            />
          </button>
          <PortalDropdown isOpen={activeMenu === 'Titular'} type="Titular">
            <div className="w-48 max-h-48 overflow-auto bg-white rounded-lg shadow-md divide-y divide-gray-100 p-2">
              <input
                ref={titularInputRef}
                type="text"
                value={titularText}
                onChange={e => {
                  const v = e.target.value
                  setTitularText(v)
                  setTitularSug(filterOpts([...conductores, ...colaboradores], v))
                }}
                placeholder="Escribe titular..."
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none mb-2"
              />
              {titularSug.map(u => (
                <div
                  key={u.id}
                  onClick={() =>
                    handleUpdate(
                      `/fletes/${flete.id}/titular`,
                      { conductor_id: u.id, colaborador_id: null },
                      f => setTitularText(f.conductor?.name || f.colaborador?.name || '')
                    )
                  }
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 truncate"
                >
                  {u.name}
                </div>
              ))}
            </div>
          </PortalDropdown>
        </div>

        {/* Guía/Ruta */}
        <div className="relative whitespace-nowrap">
          <button
            data-toggle-type="GuiaRuta"
            onClick={openGuiaRuta}
            className={classNames(
              'flex items-center gap-x-2 w-full p-1 border-b-2 rounded',
              activeMenu === 'GuiaRuta'
                ? 'border-violet-600'
                : 'border-transparent hover:border-gray-300'
            )}
          >
            <ClipboardDocumentListIcon
              className={classNames(
                'h-5 w-5 flex-shrink-0',
                activeMenu === 'GuiaRuta' ? 'text-violet-600' : 'text-sky-800'
              )}
            />
            <span
              className={classNames(
                'truncate px-1',
                activeMenu === 'GuiaRuta' ? 'text-violet-600' : ''
              )}
            >
              {guiaRutaText || '—'}
            </span>
            <ChevronDownIcon
              className={classNames(
                'h-4 w-4',
                activeMenu === 'GuiaRuta' ? 'text-violet-600' : 'text-gray-500'
              )}
            />
          </button>
          <PortalDropdown isOpen={activeMenu === 'GuiaRuta'} type="GuiaRuta">
            <div className="w-56 bg-white rounded-lg shadow-md p-4 space-y-2">
              <div className="font-bold text-sm">
                Ingresar Nro. Guía Ruta de Carga
              </div>
              <input
                ref={guiaRutaInputRef}
                type="text"
                value={guiaRutaText}
                onChange={e => setGuiaRutaText(e.target.value)}
                placeholder="Nro. Guía Ruta"
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none"
              />
              <div className="mt-2 flex items-start justify-between">
                <div className="text-xs text-gray-500 max-w-[60%] leading-snug break-words">
                  {nombreDestino} · {cliente} · {fechaSalidaFormatted}
                </div>
                <button
                  onClick={() =>
                    handleUpdate(
                      `/fletes/${flete.id}/guiaruta`,
                      { guiaruta: guiaRutaText },
                      f => setGuiaRutaText(f.guiaruta)
                    )
                  }
                  className="px-3 py-1 bg-sky-800 text-white rounded hover:bg-sky-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </PortalDropdown>
        </div>

        {/* Tracto */}
        <div className="relative whitespace-nowrap">
          <button
            data-toggle-type="Tracto"
            onClick={openTracto}
            className={classNames(
              'flex items-center gap-x-2 w-full p-1 border-b-2 rounded',
              activeMenu === 'Tracto'
                ? 'border-violet-600'
                : 'border-transparent hover:border-gray-300'
            )}
          >
            <TruckIcon
              className={classNames(
                'h-5 w-5 flex-shrink-0',
                activeMenu === 'Tracto' ? 'text-violet-600' : 'text-sky-800'
              )}
            />
            <span
              className={classNames(
                'truncate px-1',
                activeMenu === 'Tracto' ? 'text-violet-600' : ''
              )}
            >
              {tractoText || '—'}
            </span>
            <ChevronDownIcon
              className={classNames(
                'h-4 w-4',
                activeMenu === 'Tracto' ? 'text-violet-600' : 'text-gray-500'
              )}
            />
          </button>
          <PortalDropdown isOpen={activeMenu === 'Tracto'} type="Tracto">
            <div className="w-48 max-h-48 overflow-auto bg-white rounded-lg shadow-md divide-y divide-gray-100 p-2">
              <input
                ref={tractoInputRef}
                type="text"
                value={tractoText}
                onChange={e => {
                  const v = e.target.value
                  setTractoText(v)
                  setTractoSug(filterOpts(tractos, v))
                }}
                placeholder="Escribe tracto..."
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none mb-2"
              />
              {tractoSug.map(t => (
                <div
                  key={t.id}
                  onClick={() =>
                    handleUpdate(
                      `/fletes/${flete.id}/tracto`,
                      { tracto_id: t.id },
                      () => setTractoText(t.patente)
                    )
                  }
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 truncate"
                >
                  {t.patente}
                </div>
              ))}
            </div>
          </PortalDropdown>
        </div>

        {/* Fecha de Salida */}
        <div className="relative whitespace-nowrap">
          <button
            data-toggle-type="Salida"
            onClick={() =>
              setActiveMenu(activeMenu === 'Salida' ? null : 'Salida')
            }
            className={classNames(
              'flex items-center gap-x-2 w-full p-1 border-b-2 rounded',
              activeMenu === 'Salida'
                ? 'border-violet-600'
                : 'border-transparent hover:border-gray-300'
            )}
          >
            <CalendarDaysIcon
              className={classNames(
                'h-5 w-5 flex-shrink-0',
                activeMenu === 'Salida' ? 'text-violet-600' : 'text-sky-800'
              )}
            />
            <span
              className={classNames(
                'px-1',
                activeMenu === 'Salida' ? 'text-violet-600' : ''
              )}
            >
              {fechaSalidaFormatted}
            </span>
            <ChevronDownIcon
              className={classNames(
                'h-4 w-4',
                activeMenu === 'Salida' ? 'text-violet-600' : 'text-gray-500'
              )}
            />
          </button>
          <PortalDropdown isOpen={activeMenu === 'Salida'} type="Salida">
            <div className="relative bg-white border border-gray-200 shadow-lg p-2 rounded">
              <DayPicker
                mode="single"
                selected={selectedSalida}
                onSelect={d => {
                  if (!d) return
                  setSelectedSalida(d)
                  onSelectFechaSalida(flete.id, d)
                }}
              />
              <span className="absolute bottom-1 right-2 text-xs text-[var(--rdp-color-accent)]">
                {destinoClienteLabel}
              </span>
            </div>
          </PortalDropdown>
        </div>

        {/* Rampla */}
        <div className="relative whitespace-nowrap">
          <button
            data-toggle-type="Rampla"
            onClick={openRampla}
            className={classNames(
              'flex items-center gap-x-2 w-full p-1 border-b-2 rounded',
              activeMenu === 'Rampla'
                ? 'border-violet-600'
                : 'border-transparent hover:border-gray-300'
            )}
          >
            <ShoppingCartIcon
              className={classNames(
                'h-6 w-6 flex-shrink-0',
                activeMenu === 'Rampla' ? 'text-violet-600' : 'text-sky-800'
              )}
            />
            <span
              className={classNames(
                'truncate px-1',
                activeMenu === 'Rampla' ? 'text-violet-600' : ''
              )}
            >
              {ramplaText || '—'}
            </span>
            <ChevronDownIcon
              className={classNames(
                'h-4 w-4',
                activeMenu === 'Rampla' ? 'text-violet-600' : 'text-gray-500'
              )}
            />
          </button>
          <PortalDropdown isOpen={activeMenu === 'Rampla'} type="Rampla">
            <div className="w-48 max-h-48 overflow-auto bg-white rounded-lg shadow-md divide-y divide-gray-100 p-2">
              <input
                ref={ramplaInputRef}
                type="text"
                value={ramplaText}
                onChange={e => {
                  const v = e.target.value
                  setRamplaText(v)
                  setRamplaSug(filterOpts(ramplas, v))
                }}
                placeholder="Escribe rampla..."
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none mb-2"
              />
              {ramplaSug.map(r => (
                <div
                  key={r.id}
                  onClick={() =>
                    handleUpdate(
                      `/fletes/${flete.id}/rampla`,
                      { rampla_id: r.id },
                      () => setRamplaText(r.patente)
                    )
                  }
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 truncate"
                >
                  {r.patente}
                </div>
              ))}
            </div>
          </PortalDropdown>
        </div>

        {/* Fecha de Llegada */}
        <div className="relative whitespace-nowrap">
          <button
            data-toggle-type="Llegada"
            onClick={() =>
              setActiveMenu(activeMenu === 'Llegada' ? null : 'Llegada')
            }
            className={classNames(
              'flex items-center gap-x-2 w-full p-1 border-b-2 rounded',
              activeMenu === 'Llegada'
                ? 'border-violet-600'
                : 'border-transparent hover:border-gray-300'
            )}
          >
            <ArrowRightEndOnRectangleIcon
              className={classNames(
                'h-6 w-6 flex-shrink-0',
                activeMenu === 'Llegada' ? 'text-violet-600' : 'text-yellow-500'
              )}
            />
            <span
              className={classNames(
                'px-1',
                activeMenu === 'Llegada' ? 'text-violet-600' : ''
              )}
            >
              {fechaLlegadaFormatted}
            </span>
            <ChevronDownIcon
              className={classNames(
                'h-4 w-4',
                activeMenu === 'Llegada' ? 'text-violet-600' : 'text-gray-500'
              )}
            />
          </button>
          <PortalDropdown isOpen={activeMenu === 'Llegada'} type="Llegada">
            <div
              className="
                relative bg-white border border-gray-200 shadow-lg p-2 rounded
                [--rdp-color-accent:#d97706] [--rdp-color-accent-hover:#fbbf24]
              "
            >
              <DayPicker
                mode="single"
                selected={selectedLlegada}
                disabled={{ before: selectedSalida }}
                onSelect={d => {
                  if (!d) return
                  setSelectedLlegada(d)
                  onSelectFechaLlegada(flete.id, d)
                }}
                classNames={{
                  nav_button:          'text-[var(--rdp-color-accent)] hover:text-[var(--rdp-color-accent-hover)]',
                  nav_button_previous: 'mr-2',
                  nav_button_next:     'ml-2',
                  day_selected:        'bg-[var(--rdp-color-accent)] text-white',
                  day_today:           'font-semibold text-[var(--rdp-color-accent)]',
                }}
              />
              <span className="absolute bottom-1 right-2 text-xs text-[var(--rdp-color-accent)]">
                {destinoClienteLabel}
              </span>
            </div>
          </PortalDropdown>
        </div>

      </div>
    </div>
  )
}
