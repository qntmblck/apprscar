// resources/js/Components/DetailsGrid.jsx
import './Header.css'
import React, { useState, useEffect } from 'react'
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
  // Textos
  const [titularText,  setTitularText]  = useState(flete.conductor?.name || flete.colaborador?.name || '')
  const [tractoText,   setTractoText]   = useState(flete.tracto?.patente || '')
  const [ramplaText,   setRamplaText]   = useState(flete.rampla?.patente || '')
  const [guiaRutaText, setGuiaRutaText] = useState(flete.guiaruta || '')

  // Sugerencias
  const [titularSug, setTitularSug] = useState([])
  const [tractoSug,  setTractoSug]  = useState([])
  const [ramplaSug,  setRamplaSug]  = useState([])

  // Error
  const [errorMsg, setErrorMsg] = useState('')

  // Fechas en UI (mostramos +1 para usuario)
  const [selectedSalida, setSelectedSalida]   = useState(
    flete.fecha_salida ? parseLocalDate(flete.fecha_salida) : undefined
  )
  const [selectedLlegada, setSelectedLlegada] = useState(
    flete.fecha_llegada ? parseLocalDate(flete.fecha_llegada) : undefined
  )

  // Reset de textos y fechas cuando cambia flete
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
    setActiveMenu('Titular')
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

  return (
    <div className="overflow-x-auto scrollbar-thin mb-4">
      {errorMsg && <div className="mb-2 text-sm text-red-600 px-2">{errorMsg}</div>}

      <div className="grid min-w-0 grid-cols-[1fr_1fr] gap-x-4 gap-y-2 text-sm text-gray-700">
        {/* Titular */}
        <div className="relative whitespace-nowrap">
          <button
            data-toggle-type="Titular"
            onClick={openTitular}
            className="flex items-center gap-x-2 w-full"
          >
            <IdentificationIcon className="h-5 w-5 text-sky-800 flex-shrink-0"/>
            <span className="truncate px-1">{titularText || '—'}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500"/>
          </button>
          <PortalDropdown isOpen={activeMenu==='Titular'} type="Titular">
            <div className="absolute top-0 left-0 mt-2 ml-2 w-48 bg-white shadow-lg rounded divide-y divide-gray-100 p-2">
              <input
                autoFocus
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
            onClick={() => setActiveMenu(activeMenu==='GuiaRuta'?null:'GuiaRuta')}
            className="flex items-center gap-x-2 w-full"
          >
            <ClipboardDocumentListIcon className="h-5 w-5 text-sky-800 flex-shrink-0"/>
            <span className="truncate px-1">{guiaRutaText || '—'}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500"/>
          </button>
          <PortalDropdown isOpen={activeMenu==='GuiaRuta'} type="GuiaRuta">
            <div className="absolute top-0 left-0 mt-2 ml-2 w-48 bg-white shadow-lg rounded p-2">
              <div className="flex items-center">
                <input
                  autoFocus
                  type="text"
                  value={guiaRutaText}
                  onChange={e => setGuiaRutaText(e.target.value)}
                  placeholder="Escribe guía/ruta..."
                  className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                />
                <button
                  onClick={() =>
                    handleUpdate(
                      `/fletes/${flete.id}/guiaruta`,
                      { guiaruta: guiaRutaText },
                      () => setGuiaRutaText(guiaRutaText)
                    )
                  }
                  className="ml-2 p-1 hover:bg-gray-100 rounded"
                >
                  <CheckIcon className="h-5 w-5 text-green-600"/>
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
            className="flex items-center gap-x-2 w-full"
          >
            <TruckIcon className="h-5 w-5 text-sky-800 flex-shrink-0"/>
            <span className="truncate px-1">{tractoText || '—'}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500"/>
          </button>
          <PortalDropdown isOpen={activeMenu==='Tracto'} type="Tracto">
            <div className="absolute top-0 left-0 mt-2 ml-2 w-48 bg-white shadow-lg rounded p-2 divide-y divide-gray-100">
              <input
                autoFocus
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
    onClick={() => setActiveMenu(activeMenu === 'Salida' ? null : 'Salida')}
    className="flex items-center gap-x-2 w-full"
  >
    <CalendarDaysIcon className="h-5 w-5 text-sky-800 flex-shrink-0"/>
    <span className="px-1">{fechaSalidaFormatted}</span>
    <ChevronDownIcon className="h-4 w-4 text-gray-500"/>
  </button>
  <PortalDropdown isOpen={activeMenu === 'Salida'} type="Salida">
    <div className="absolute top-0 left-0 mt-2 ml-2 bg-white border border-gray-200 shadow-lg p-2 rounded">
      <DayPicker
        mode="single"
        selected={selectedSalida}
        onSelect={d => {
          if (!d) return
          // 1) UI: mostrar d+1 en salida
          const uiDate = new Date(d)
          uiDate.setDate(uiDate.getDate() + 1)
          setSelectedSalida(uiDate)
          // 2) Backend: guardar d+1 en salida
          const payload = new Date(d)
          payload.setDate(payload.getDate() + 1)
          onSelectFechaSalida(flete.id, payload)
          // 3) cerrar dropdown
          setActiveMenu(null)
        }}
      />
    </div>
  </PortalDropdown>
</div>


        {/* Rampla */}
        <div className="relative whitespace-nowrap">
          <button
            data-toggle-type="Rampla"
            onClick={openRampla}
            className="flex items-center gap-x-2 w-full"
          >
            <ShoppingCartIcon className="h-6 w-6 text-sky-800 flex-shrink-0"/>
            <span className="truncate px-1">{ramplaText || '—'}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500"/>
          </button>
          <PortalDropdown isOpen={activeMenu==='Rampla'} type="Rampla">
            <div className="absolute top-0 left-0 mt-2 ml-2 w-48 bg-white shadow-lg rounded p-2 divide-y divide-gray-100">
              <input
                autoFocus
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
            onClick={() => setActiveMenu(activeMenu === 'Llegada' ? null : 'Llegada')}
            className="flex items-center gap-x-2 w-full"
          >
            <ArrowRightEndOnRectangleIcon className="h-6 w-6 text-yellow-500 flex-shrink-0"/>
            <span className="px-1">{fechaLlegadaFormatted}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500"/>
          </button>
          <PortalDropdown isOpen={activeMenu === 'Llegada'} type="Llegada">
            <div className="absolute top-0 left-0 mt-2 ml-2 bg-white border border-gray-200 shadow-lg p-2 rounded">
              <DayPicker
                mode="single"
                selected={selectedLlegada}
                disabled={{ before: selectedSalida }}
                selectedDays={[{ from: selectedSalida, to: selectedLlegada }]}
                onSelect={d => {
                  if (!d) return
                  // UI: mostrar d+1
                  const uiDate = new Date(d); uiDate.setDate(uiDate.getDate() )
                  setSelectedLlegada(uiDate)
                  // Backend: guardar d+1
                  const payload = new Date(d); payload.setDate(payload.getDate()+1)
                  onSelectFechaLlegada(flete.id, payload)
                  setActiveMenu(null)
                }}
              />
            </div>
          </PortalDropdown>
        </div>

      </div>
    </div>
  )
}
