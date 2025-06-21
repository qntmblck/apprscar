// resources/js/Components/DetailsGrid.jsx
import './Header.css'
import React, { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import {
  IdentificationIcon,
  CalendarDaysIcon,
  TruckIcon,
  ArrowRightEndOnRectangleIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  ArrowRightEndOnRectangleIcon as ArrowInIcon,
  CheckIcon
} from '@heroicons/react/20/solid'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import axios from 'axios'

// Helper para parsear "YYYY-MM-DD" como medianoche local
const parseLocalDate = iso => new Date(iso + 'T00:00')

export default function DetailsGrid({
  flete,
  fechaSalidaFormatted,
  fechaLlegadaFormatted,
  conductores = [],
  colaboradores = [],
  tractos = [],
  ramplas = [],
  onSelectFechaSalida,
  onSelectFechaLlegada,
}) {
  // Estados de texto
  const [titularText, setTitularText]     = useState(flete.conductor?.name || flete.colaborador?.name || '')
  const [tractoText, setTractoText]       = useState(flete.tracto?.patente || '')
  const [ramplaText, setRamplaText]       = useState(flete.rampla?.patente || '')
  const [guiaRutaText, setGuiaRutaText]   = useState(flete.guiaruta || '')
  const [selectedSalida, setSelectedSalida]   = useState(flete.fecha_salida ? parseLocalDate(flete.fecha_salida) : undefined)
  const [selectedLlegada, setSelectedLlegada] = useState(flete.fecha_llegada ? parseLocalDate(flete.fecha_llegada) : undefined)
  const [errorMsg, setErrorMsg]           = useState('')

  // Estados del modal
  const [modalType, setModalType]         = useState(null) // 'Titular','Tracto','Rampla','GuiaRuta','Salida','Llegada'
  const [modalMessage, setModalMessage]   = useState('')
  const [modalValue, setModalValue]       = useState('')
  const [suggestions, setSuggestions]     = useState([])
  const [selectedId, setSelectedId]       = useState(null)

  // Referencias (para focus cuando se abre el modal)
  const inputRef = useRef(null)

  // Al cambiar flete, reseteamos los textos y fechas
  useEffect(() => {
    setTitularText(flete.conductor?.name || flete.colaborador?.name || '')
    setTractoText(flete.tracto?.patente || '')
    setRamplaText(flete.rampla?.patente || '')
    setGuiaRutaText(flete.guiaruta || '')
    setSelectedSalida(flete.fecha_salida ? parseLocalDate(flete.fecha_salida) : undefined)
    setSelectedLlegada(flete.fecha_llegada ? parseLocalDate(flete.fecha_llegada) : undefined)
    setErrorMsg('')
  }, [flete])

  // Cuando abrimos el modal, enfocamos el input
  useEffect(() => {
    if (modalType && inputRef.current) {
      inputRef.current.focus({ preventScroll: true })
    }
  }, [modalType])

  // Helper para fetch de titulares
  const fetchTitulares = async () => {
    try {
      const { data } = await axios.get(window.route('fletes.suggestTitulares'))
      setSuggestions(data.suggestions)
    } catch {
      setSuggestions([...conductores, ...colaboradores].slice(0, 10))
    }
  }

  // Filtrado genérico
  const filterOpts = (list, text) =>
    list
      .filter(x => (x.name || x.patente).toLowerCase().includes(text.toLowerCase()))
      .slice(0, 10)

  // Lógica de guardado
  const handleUpdate = async (url, payload, applyText) => {
    setErrorMsg('')
    try {
      const res = await axios.post(url, payload)
      applyText(res.data.flete)
      setModalType(null)
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat().join(' ') ||
        err.message ||
        'Error al guardar'
      setErrorMsg(msg)
    }
  }

  // Abre el modal según tipo
  const openModal = (type) => {
    setErrorMsg('')
    setSelectedId(null)

    switch (type) {
      case 'Titular':
        setModalMessage('Selecciona titular:')
        setModalValue(titularText)
        fetchTitulares()
        break
      case 'Tracto':
        setModalMessage('Selecciona tracto:')
        setModalValue(tractoText)
        setSuggestions(tractos)
        break
      case 'Rampla':
        setModalMessage('Selecciona rampla:')
        setModalValue(ramplaText)
        setSuggestions(ramplas)
        break
      case 'GuiaRuta': {
        const destino = flete.destino?.nombre      ?? '[sin destino]'
        const cliente = flete.clientePrincipal?.razon_social
                        || flete.cliente?.razon_social
                        || '[sin cliente]'
        setModalMessage(`¿Cuál es la guía/ruta de carga de ${destino}-${cliente}?`)
        setModalValue(guiaRutaText)
        break
      }
      case 'Salida':
        setModalMessage('Selecciona fecha de salida:')
        setModalValue(selectedSalida)
        break
      case 'Llegada':
        setModalMessage('Selecciona fecha de llegada:')
        setModalValue(selectedLlegada)
        break
      default:
    }

    setModalType(type)
  }

  // Al aceptar en el modal
  const acceptModal = () => {
    switch (modalType) {
      case 'Titular':
        handleUpdate(
          `/fletes/${flete.id}/titular`,
          { conductor_id: selectedId, colaborador_id: null },
          f => setTitularText(f.conductor?.name || f.colaborador?.name || '')
        )
        break
      case 'Tracto':
        handleUpdate(
          `/fletes/${flete.id}/tracto`,
          { tracto_id: selectedId },
          f => setTractoText(f.tracto?.patente)
        )
        break
      case 'Rampla':
        handleUpdate(
          `/fletes/${flete.id}/rampla`,
          { rampla_id: selectedId },
          f => setRamplaText(f.rampla?.patente)
        )
        break
      case 'GuiaRuta':
        handleUpdate(
          `/fletes/${flete.id}/guiaruta`,
          { guiaruta: modalValue },
          f => setGuiaRutaText(f.guiaruta)
        )
        break
      case 'Salida':
        onSelectFechaSalida(flete.id, modalValue)
        setSelectedSalida(modalValue)
        setModalType(null)
        break
      case 'Llegada':
        onSelectFechaLlegada(flete.id, modalValue)
        setSelectedLlegada(modalValue)
        setModalType(null)
        break
      default:
        setModalType(null)
    }
  }

  return (
    <div className="overflow-x-auto scrollbar-thin mb-4">
      {errorMsg && (
        <div className="mb-2 text-sm text-red-600 px-2">{errorMsg}</div>
      )}

      {/* inline-grid con columnas auto y sin wrap para scroll sutil */}
      <div className="inline-grid grid-cols-[auto_auto] gap-4 text-gray-700 text-sm whitespace-nowrap">
        <button
          onClick={() => openModal('Titular')}
          className="flex items-center gap-2"
        >
          <IdentificationIcon className="h-5 w-5 text-sky-800" />
          {titularText || '—'}
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </button>

        <button
          onClick={() => openModal('GuiaRuta')}
          className="flex items-center gap-2"
        >
          <ClipboardDocumentListIcon className="h-5 w-5 text-sky-800" />
          {guiaRutaText || '—'}
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </button>

        <button
          onClick={() => openModal('Tracto')}
          className="flex items-center gap-2"
        >
          <TruckIcon className="h-5 w-5 text-sky-800" />
          {tractoText || '—'}
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </button>

        <button
          onClick={() => openModal('Salida')}
          className="flex items-center gap-2"
        >
          <CalendarDaysIcon className="h-5 w-5 text-sky-800" />
          {fechaSalidaFormatted}
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </button>

        <button
          onClick={() => openModal('Rampla')}
          className="flex items-center gap-2"
        >
          <ShoppingCartIcon className="h-5 w-5 text-sky-800" />
          {ramplaText || '—'}
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </button>

        <button
          onClick={() => openModal('Llegada')}
          className="flex items-center gap-2"
        >
          <ArrowInIcon className="h-5 w-5 text-sky-800" />
          {fechaLlegadaFormatted}
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Modal genérico */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 w-max max-w-[90vw] overflow-auto">

            {['Salida', 'Llegada'].includes(modalType) ? (
              <>
                {/* Calendario */}
                <div className="overflow-x-auto">
                  <DayPicker
                    mode="single"
                    selected={modalValue}
                    onSelect={date => setModalValue(date)}
                  />
                </div>

                {/* Texto y botones */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-800 font-medium">
                    {modalType}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setModalType(null)}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      disabled={!modalValue}
                      onClick={acceptModal}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="mb-4 text-gray-800">{modalMessage}</p>
                {['Titular', 'Tracto', 'Rampla'].includes(modalType) && (
                  <>
                    <input
                      ref={inputRef}
                      type="text"
                      value={modalValue}
                      onChange={e => {
                        const v = e.target.value
                        setModalValue(v)
                        if (modalType === 'Titular') {
                          fetchTitulares()
                          setSuggestions(filterOpts([...conductores, ...colaboradores], v))
                        } else if (modalType === 'Tracto') {
                          setSuggestions(filterOpts(tractos, v))
                        } else {
                          setSuggestions(filterOpts(ramplas, v))
                        }
                      }}
                      className="w-full px-3 py-2 border rounded mb-2"
                      placeholder="Filtrar..."
                    />
                    <div className="max-h-40 overflow-auto divide-y">
                      {suggestions.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedId(item.id)
                            setModalValue(item.name || item.patente)
                          }}
                          className={`px-3 py-2 cursor-pointer ${
                            selectedId === item.id ? 'bg-gray-100' : ''
                          }`}
                        >
                          {item.name || item.patente}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {modalType === 'GuiaRuta' && (
                  <input
                    ref={inputRef}
                    type="text"
                    value={modalValue}
                    onChange={e => setModalValue(e.target.value)}
                    className="w-full px-3 py-2 border rounded mb-4"
                  />
                )}

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={
                      (['Titular','Tracto','Rampla'].includes(modalType) && !selectedId) ||
                      (modalType === 'GuiaRuta' && !modalValue)
                    }
                    onClick={acceptModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Aceptar
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
