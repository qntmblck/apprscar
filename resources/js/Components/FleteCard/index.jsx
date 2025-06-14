// resources/js/Components/FleteCard/index.jsx
import React, { useState, useMemo, useCallback, useEffect, memo } from 'react'
import axios from 'axios'
import { formatDateSimple } from '@/helpers/date'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
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
  onSelectTracto,
  onSelectRampla,
  onSelectGuiaRuta,
}) {
  const [flipped, setFlipped] = useState(false)
  const [errorCierre, setErrorCierre] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const formAbierto = openForm[flete.id]

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
      const res = await axios.post(`/fletes/${flete.id}/cerrar`)
      if (res.data?.flete) actualizarFleteEnLista(res.data.flete)
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
  }, [flete.id, actualizarFleteEnLista])

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
      flete.fecha_llegada
        ? formatDateSimple(flete.fecha_llegada)
        : 'No registrada',
    [flete.fecha_llegada]
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
    <div
      className={`flete-card w-full h-full ${
        formAbierto ? 'expanded' : ''
      }`}
    >
      <div
        className={`flete-card-inner h-full ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Cara Frontal */}
        <div
          className={`flete-card-front bg-white border border-gray-200 shadow rounded-lg p-4 ${
            !flipped ? 'active' : ''
          }`}
        >
          <Header
            flete={flete}
            flipped={flipped}
            isSubmitting={isSubmitting}
            onFlip={handleFlip}
            onCerrar={cerrarRendicion}
            submitForm={submitForm}
            actualizarFleteEnLista={actualizarFleteEnLista}
          />

          <DetailsGrid
            flete={flete}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            fechaSalidaFormatted={fechaSalidaFormatted}
            fechaLlegadaFormatted={fechaLlegadaFormatted}
            viaticoEfec={viaticoEfec}
            saldoTemporal={saldoTemporal}
            conductores={conductores}
            colaboradores={colaboradores}
            tractos={tractos}
            ramplas={ramplas}
            guias={guias}
            onSelectTitular={onSelectTitular}
            onSelectFechaSalida={onSelectFechaSalida}
            onSelectTracto={onSelectTracto}
            onSelectRampla={onSelectRampla}
            onSelectGuiaRuta={onSelectGuiaRuta}
          />

          {errorCierre && (
            <div className="error-cierre">{errorCierre}</div>
          )}

          <div className="ultimos-registros text-xs">
  <RecordRow
    ultimosRegistros={ultimosRegistros}
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
          />
        </div>

        {/* Cara Trasera */}
        <div
          className={`flete-card-back bg-white border border-gray-200 shadow rounded-lg p-4 ${
            flipped ? 'active' : ''
          }`}
        >
          <div className="flex justify-end">
            <button
              onClick={handleFlip}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <BackDetails
  registros={flete.rendicion.gastos.concat(
    flete.rendicion.diesels,
    flete.rendicion.abonos
  )}
  adicionales={flete.rendicion.gastos.filter(g => g.tipo === 'Adicional')}
  comision={flete.comision}
  viaticoEfec={flete.rendicion.viatico_calculado}
  saldoTemporal={flete.rendicion.saldo}
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
  )
}

export default memo(FleteCard)
