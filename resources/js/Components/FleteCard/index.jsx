// resources/js/Components/FleteCard/index.jsx
import React, { useState, useMemo, useCallback, useEffect, memo } from 'react'
import axios from 'axios'
import { formatDateSimple } from '@/helpers/date'
import Header from './Header'
import DetailsGrid from './DetailsGrid'
import FrontTabs from './FrontTabs'
import BackTabs from './BackTabs'
import BackDetails from './BackDetails'
import RecordRow from './RecordRow'
import { XMarkIcon } from '@heroicons/react/20/solid'
import './FleteCard.css'

// Helper para concatenar clases
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function FleteCard({
  flete,
  openForm,
  handleToggleForm,
  handleCloseForm,
  actualizarFleteEnLista,
  submitForm,
  conductores = [],
  colaboradores = [],
  tractos = [],
  ramplas = [],
  guias = [],

  // handlers de edición
  onSelectTitular,
  onSelectFechaSalida,
  onSelectFechaLlegada,
  onSelectTracto,
  onSelectRampla,
  onSelectGuiaRuta,

  // Props para selección
  selectedIds = [],
  toggleSelect,
}) {
  const [flipped, setFlipped] = useState(false)
  const [errorCierre, setErrorCierre] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const formAbierto = openForm[flete.id]
  const isClosed = flete.rendicion?.estado !== 'Activo'

  // estado local para la fecha de llegada seleccionada
  const [selectedLlegada, setSelectedLlegada] = useState(
    flete.fecha_llegada ? new Date(flete.fecha_llegada) : undefined
  )

  // temp guía/ruta
  const [tempGuia, setTempGuia] = useState(flete.guiaruta || '')
  useEffect(() => {
    if (activeMenu === 'GuiaRuta') {
      setTempGuia(flete.guiaruta || '')
    }
  }, [activeMenu, flete.guiaruta])

  // cerrar dropdown si clic fuera
  useEffect(() => {
    function handleOutside(e) {
      if (!activeMenu) return
      if (
        e.target.closest(`[data-toggle-type="${activeMenu}"]`) ||
        e.target.closest(`[data-dropdown-type="${activeMenu}"]`)
      ) return
      setActiveMenu(null)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [activeMenu])

  const handleFlip = useCallback(() => setFlipped(f => !f), [])

  const cerrarRendicion = useCallback(async () => {
    setErrorCierre(null)
    setIsSubmitting(true)
    try {
      const payload = {
        flete_id:     flete.id,
        rendicion_id: flete.rendicion.id,
        ...(flete.rendicion.estado === 'Activo' && {
          fecha_termino: new Date().toISOString().slice(0, 10),
        }),
      }
      const res = await axios.post(`/fletes/${flete.id}/finalizar`, payload)
      if (res.data?.flete) {
        actualizarFleteEnLista(res.data.flete)
      }
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        (e.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join(' ')
          : e.message)
      setErrorCierre('❌ ' + msg)
    } finally {
      setIsSubmitting(false)
    }
  }, [
    flete.id,
    flete.rendicion.id,
    flete.rendicion.estado,
    actualizarFleteEnLista,
  ])

  const handleEliminarRegistro = useCallback(
    async registro => {
      if (!confirm('¿Eliminar este registro?')) return
      setIsSubmitting(true)
      try {
        let url
        if ('litros' in registro) url = `/diesels/${registro.id}`
        else if (registro.tipo === 'Comisión') url = `/comisiones/${registro.id}`
        else if (registro.tipo) url = `/gastos/${registro.id}`
        else if (registro.metodo === 'Retorno') url = `/retornos/${registro.id}`
        else url = `/abonos/${registro.id}`

        await axios.delete(url)
        const res = await axios.get(`/fletes/${flete.id}`)
        if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
      } catch (e) {
        alert('Error eliminando: ' + (e.response?.data?.message || e.message))
      } finally {
        setIsSubmitting(false)
      }
    },
    [flete.id, actualizarFleteEnLista]
  )

  // Memoizados: fechas y montos
  const fechaSalidaFormatted = useMemo(
    () => (flete.fecha_salida ? formatDateSimple(flete.fecha_salida) : '—'),
    [flete.fecha_salida]
  )
  const fechaLlegadaFormatted = useMemo(
    () =>
      selectedLlegada
        ? formatDateSimple(selectedLlegada)
        : 'No registrada',
    [selectedLlegada]
  )
  const viaticoEfec = useMemo(
    () => flete.rendicion?.viatico_efectivo ?? 0,
    [flete.rendicion?.viatico_efectivo]
  )
  const saldoTemporal = useMemo(
    () => flete.rendicion?.saldo_temporal ?? 0,
    [flete.rendicion?.saldo_temporal]
  )

  // Registros recientes y completos
  const ultimosRegistros = useMemo(() => {
    const lista = [
      ...(flete.rendicion?.abonos || []),
      ...(flete.rendicion?.diesels || []),
      ...(flete.rendicion?.gastos || []),
      ...(flete.rendicion?.adicionales || []),
    ]
    lista.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    return lista.slice(-2)
  }, [flete.rendicion])

  const detallesBack = useMemo(() => {
    const lista = [
      ...(flete.rendicion?.abonos || []),
      ...(flete.rendicion?.diesels || []),
      ...(flete.rendicion?.gastos || []),
      ...(flete.rendicion?.adicionales || []),
      ...(flete.rendicion?.retornos || []),
      ...(flete.rendicion?.comisiones || []),
    ]
    return lista.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [flete.rendicion])

  return (
    <div className={`flete-card w-full h-full ${formAbierto ? 'expanded' : ''}`}>
      <div className={`flete-card-inner h-full ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Cara Frontal */}
        <div
          className={classNames(
            'flete-card-front bg-white border border-gray-200 shadow rounded-lg p-4',
            !flipped && 'active',
            isClosed && 'opacity-70'
          )}
        >
          {/* Header siempre activo */}
          <Header
            flete={flete}
            flipped={flipped}
            isSubmitting={isSubmitting}
            onFlip={handleFlip}
            onCerrar={cerrarRendicion}
            submitForm={submitForm}
            actualizarFleteEnLista={actualizarFleteEnLista}
          />

          {/* Detalles y form */}
          <div className={isClosed ? 'pointer-events-none' : ''}>
            <DetailsGrid
              flete={flete}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              fechaSalidaFormatted={fechaSalidaFormatted}
              fechaLlegadaFormatted={fechaLlegadaFormatted}
              conductores={conductores}
              colaboradores={colaboradores}
              tractos={tractos}
              ramplas={ramplas}
              onSelectTitular={onSelectTitular}
              onSelectFechaSalida={(id, fecha) => {
                onSelectFechaSalida(id, fecha)
                onSelectFechaSalida(id, fecha)
              }}
              onSelectFechaLlegada={(id, fecha) => {
                onSelectFechaLlegada(id, fecha)
                setSelectedLlegada(fecha)
              }}
              onSelectTracto={onSelectTracto}
              onSelectRampla={onSelectRampla}
              onSelectGuiaRuta={onSelectGuiaRuta}
            />

            {errorCierre && <div className="error-cierre">{errorCierre}</div>}

            <div className="ultimos-registros text-xs">
              <RecordRow
                registros={ultimosRegistros}
                viatico={viaticoEfec}
                saldo={saldoTemporal}
                onEliminar={handleEliminarRegistro}
                isSubmitting={isSubmitting}
              />
            </div>

            <FrontTabs
  flete={flete}
  formAbierto={formAbierto}
  handleToggleForm={handleToggleForm}
  handleCloseForm={handleCloseForm}
  submitForm={submitForm}
  actualizarFleteEnLista={actualizarFleteEnLista}
  setIsSubmitting={setIsSubmitting}
  selectedIds={selectedIds}
  toggleSelect={toggleSelect}

  // Props para el cálculo de viático en FinalizarForm
  fechaSalidaISO={flete.fecha_salida}
  fechaLlegadaISO={
    selectedLlegada
      ? selectedLlegada.toISOString().slice(0, 10)
      : undefined
  }
  fletePosteriorEnMismoDia={
    // true si este flete arranca el mismo día que terminó el anterior
    flete.fecha_salida === flete.flete_anterior_fecha_llegada
  }
/>

          </div>
        </div>

        {/* Cara Trasera */}
        <div
          className={classNames(
            'flete-card-back bg-white border border-gray-200 shadow rounded-lg p-4',
            flipped && 'active',
            isClosed && 'opacity-70'
          )}
        >
          {/* Botón de cerrar trasera */}
          <div className="flex justify-end">
            <button onClick={handleFlip} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className={isClosed ? 'pointer-events-none' : ''}>
            <BackDetails
              registros={detallesBack}
              viaticoEfec={flete.rendicion?.viatico_calculado || 0}
              saldoTemporal={flete.rendicion?.saldo_temporal || 0}
              onEliminarRegistro={handleEliminarRegistro}
              isSubmitting={isSubmitting}
            />

            <BackTabs
              flete={flete}
              formAbierto={formAbierto}
              handleToggleForm={handleToggleForm}
              handleCloseForm={handleCloseForm}
              submitForm={submitForm}
              actualizarFleteEnLista={actualizarFleteEnLista}
              toggleFlip={handleFlip}
              setIsSubmitting={setIsSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(FleteCard)
