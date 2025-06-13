// resources/js/Components/FleteCard/index.jsx
import React, { useState, useMemo, useCallback, memo, useEffect } from 'react'
import axios from 'axios'
import {
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  BanknotesIcon as BankIcon,
} from '@heroicons/react/20/solid'
import './FleteCard.css'

import Header from './Header'
import DetailsGrid from './DetailsGrid'
import RecentRecords from './RecentRecords'
import FrontTabs from './FrontTabs'
import BackDetails from './BackDetails'
import BackTabs from './BackTabs'

export default memo(function FleteCard({
  flete,
  openForm,
  handleToggleForm,
  handleCloseForm,
  actualizarFleteEnLista,
  submitForm,
  onEliminarRegistro,
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
  // ─── Estados ───────────────────────────────────────────────────────────────
  const [flipped, setFlipped] = useState(false)
  const [errorCierre, setErrorCierre] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const formAbierto = openForm[flete.id]
  const [tempGuia, setTempGuia] = useState(flete.guiaruta || '')

  // ─── Efectos ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeMenu === 'GuiaRuta') {
      setTempGuia(flete.guiaruta || '')
    }
  }, [activeMenu, flete.guiaruta])

  useEffect(() => {
    function handleClickOutside(e) {
      if (!activeMenu) return
      if (
        e.target.closest(`[data-toggle-type="${activeMenu}"]`) ||
        e.target.closest(`[data-dropdown-type="${activeMenu}"]`)
      )
        return
      setActiveMenu(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeMenu])

  // ─── Memoizados ─────────────────────────────────────────────────────────────
  const fechaSalidaFormatted = useMemo(
    () =>
      flete.fecha_salida
        ? new Date(flete.fecha_salida).toLocaleDateString('es-CL')
        : '—',
    [flete.fecha_salida]
  )
  const fechaLlegadaFormatted = useMemo(
    () =>
      flete.fecha_llegada
        ? new Date(flete.fecha_llegada).toLocaleDateString('es-CL')
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

  const ultimosRegistros = useMemo(() => {
    const lista = [
      ...(flete.rendicion?.abonos || []),
      ...(flete.rendicion?.diesels || []),
      ...(flete.rendicion?.gastos || []),
      ...(flete.rendicion?.adicionales || []),
    ]
    lista.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    return lista.slice(-2)
  }, [
    flete.rendicion?.abonos,
    flete.rendicion?.diesels,
    flete.rendicion?.gastos,
    flete.rendicion?.adicionales,
  ])

  const detallesBack = useMemo(() => {
    const lista = [
      ...(flete.rendicion?.abonos || []),
      ...(flete.rendicion?.diesels || []),
      ...(flete.rendicion?.gastos || []),
    ]
    return lista.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [
    flete.rendicion?.abonos,
    flete.rendicion?.diesels,
    flete.rendicion?.gastos,
  ])

  // ─── Configuración de Pestañas ──────────────────────────────────────────────
  const frontTabs = useMemo(
    () => [
      {
        name: 'Diesel',
        key: 'diesel',
        icon: WrenchScrewdriverIcon,
        count: flete.rendicion?.diesels?.length ?? 0,
        current: formAbierto === 'diesel',
      },
      {
        name: 'Gasto',
        key: 'gasto',
        icon: CurrencyDollarIcon,
        count: flete.rendicion?.gastos?.length ?? 0,
        current: formAbierto === 'gasto',
      },
      {
        name: 'Viático',
        key: 'finalizar',
        icon: SparklesIcon,
        count: 0,
        current: formAbierto === 'finalizar',
      },
      {
        name: 'Adicional',
        key: 'adicional',
        icon: BankIcon,
        count: flete.rendicion?.adicionales?.length ?? 0,
        current: formAbierto === 'adicional',
      },
    ],
    [flete.rendicion, formAbierto]
  )

  const backTabs = useMemo(
    () => [
      {
        name: 'Abono',
        key: 'abono',
        icon: BankIcon,
        count: flete.rendicion?.abonos?.length ?? 0,
        current: formAbierto === 'abono',
      },
      {
        name: 'Retorno',
        key: 'retorno',
        icon: BankIcon,
        count: flete.rendicion?.retorno ? 1 : 0,
        current: formAbierto === 'retorno',
      },
      {
        name: 'Comisión',
        key: 'comision',
        icon: BankIcon,
        count: flete.rendicion?.comision != null ? 1 : 0,
        current: formAbierto === 'comision',
      },
    ],
    [flete.rendicion, formAbierto]
  )

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleFlip = useCallback(() => setFlipped(p => !p), [])

  const cerrarRendicion = useCallback(
    async fleteId => {
      setErrorCierre(null)
      setIsSubmitting(true)
      try {
        const res = await axios.post(`/fletes/${fleteId}/cerrar`)
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
    },
    [actualizarFleteEnLista]
  )

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

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className={`
        flete-card
        w-full sm:w-1/2 lg:w-1/3     /* Hasta 3 tarjetas por fila en escritorio */
        flex flex-col h-full overflow-hidden
        ${formAbierto ? 'expanded' : ''}
      `}
    >
      <div
        className={`
          flete-card-inner
          flex-1 relative overflow-hidden
          ${flipped ? 'rotate-y-180' : ''}
        `}
      >
        {/* ─── CARA FRONTAL ─────────────────────────────────────────── */}
        <div
          className={`
            flete-card-front
            h-full overflow-y-auto
            ${!flipped ? 'active' : ''}
          `}
        >
          {/* Primera fila: Destino/Cliente + Botones — Énfasis con border-b */}
          <div className="mb-4 pb-2 border-b border-gray-200">
            <Header
              flete={flete}
              errorCierre={errorCierre}
              isSubmitting={isSubmitting}
              activeMenu={activeMenu}
              onFlip={handleFlip}
              onToggleMenu={setActiveMenu}
              onCerrar={cerrarRendicion}
              onSubmitNotify={async () => {
                setIsSubmitting(true)
                await submitForm(
                  `/fletes/${flete.id}/notificar`,
                  { flete_id: flete.id },
                  actualizarFleteEnLista
                )
                setIsSubmitting(false)
              }}
            />
          </div>

          <DetailsGrid
            flete={flete}
            fechaSalidaFormatted={fechaSalidaFormatted}
            fechaLlegadaFormatted={fechaLlegadaFormatted}
            viaticoEfec={viaticoEfec}
            saldoTemporal={saldoTemporal}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            tempGuia={tempGuia}
            setTempGuia={setTempGuia}
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

          <RecentRecords
            records={ultimosRegistros}
            onDelete={handleEliminarRegistro}
            isSubmitting={isSubmitting}
          />

          <FrontTabs
            tabs={frontTabs}
            currentTab={formAbierto}
            onToggle={handleToggleForm}
            onSubmit={submitForm}
            isSubmitting={isSubmitting}
            flete={flete}
            handleCloseForm={handleCloseForm}
            actualizarFleteEnLista={actualizarFleteEnLista}
          />
        </div>

        {/* ─── CARA TRASERA ─────────────────────────────────────────── */}
        <div
          className={`
            flete-card-back
            h-full overflow-y-auto
            ${flipped ? 'active' : ''}
          `}
        >
          <BackDetails
            detallesBack={detallesBack}
            viaticoEfec={viaticoEfec}
            saldoTemporal={saldoTemporal}
            onDelete={handleEliminarRegistro}
            isSubmitting={isSubmitting}
          />

          <BackTabs
            tabs={backTabs}
            currentTab={formAbierto}
            onToggle={handleToggleForm}
            onSubmit={submitForm}
            isSubmitting={isSubmitting}
            onFlip={handleFlip}
            flete={flete}
            handleCloseForm={handleCloseForm}
            actualizarFleteEnLista={actualizarFleteEnLista}
          />
        </div>
      </div>
    </div>
  )
})
