// resources/js/Pages/Contacto.jsx
import SEO from '@/Components/SEO'
import Header from '@/Components/Header'
import Footer from '@/Components/Footer'
import ContactCliente from '@/Components/ContactCliente'
import ContactConductor from '@/Components/ContactConductor'
import ContactColaborador from '@/Components/ContactColaborador'
import FAQ from '@/Components/FAQ'
import WhatsAppChat from '@/Components/WhatsAppChat'
import CallButton from '@/Components/CallButton'
import { useEffect, useState } from 'react'

const siteUrl = 'https://scartransportes.cl'
const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${siteUrl}/contacto#webpage`,
  name: 'Contacto - Transportes SCAR',
  url: `${siteUrl}/contacto`,
  description:
    'Contacto oficial de Transportes SCAR para cotizar transporte de carga, cargas consolidadas, fletes dedicados o integrar una flota colaboradora.',
  inLanguage: 'es-CL',
  about: {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'Transportes SCAR',
    url: siteUrl,
    email: 'contacto@scartransportes.cl',
    telephone: '+56961068999',
  },
  mainEntity: [
    {
      '@type': 'Service',
      name: 'Cotización de transporte de carga',
      serviceType: 'Carga consolidada, fletes dedicados y distribución B2B',
      areaServed: 'Chile',
      provider: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'Service',
      name: 'Postulación de conductores',
      serviceType: 'Postulación para servicios de transporte y distribución',
      areaServed: 'Chile',
      provider: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'Service',
      name: 'Integración de flota',
      serviceType: 'Colaboración B2B con transportistas y flotas',
      areaServed: 'Chile',
      provider: { '@id': `${siteUrl}/#organization` },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: siteUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Contacto',
      item: `${siteUrl}/contacto`,
    },
  ],
}

export default function Contacto() {
  const getInitialTab = () => {
    const hash = window.location.hash

    if (hash === '#conductores') return 'conductores'
    if (hash === '#colaboradores') return 'colaboradores'
    return 'clientes'
  }

  const [activeTab, setActiveTab] = useState(getInitialTab)

  useEffect(() => {
    const hash = window.location.hash

    if (hash === '#conductores') setActiveTab('conductores')
    else if (hash === '#colaboradores') setActiveTab('colaboradores')
    else setActiveTab('clientes')
  }, [])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    window.history.replaceState(null, '', `#${tab}`)
  }

  return (
    <div className="bg-white">
      <SEO
        title="Contacto Transportes SCAR | Cotiza carga consolidada, fletes o integra tu flota"
        description="Cotiza transporte de carga, cargas consolidadas, fletes dedicados y distribución B2B con SCAR. También puedes postular como conductor o integrar tu flota colaboradora."
        canonical="/contacto"
        image="/img/mano.webp"
        preloadImage
        jsonLd={[contactSchema, breadcrumbSchema]}
      />

      <Header />

      <section
        className="relative bg-[#0c1e3a] text-white pt-32 pb-24 sm:pt-40 sm:pb-32 px-6 text-center overflow-hidden bg-center bg-cover"
        style={{ backgroundImage: "url('/img/mano.webp')" }}
        aria-label="Encabezado de contacto"
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold">Contacto</h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-200">
            Elige el camino correcto: cotizar una carga, postular como conductor o integrar tu flota a una red operativa con respaldo.
          </p>

          <div
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
            role="tablist"
            aria-label="Opciones de contacto"
          >
            <button
              type="button"
              onClick={() => handleTabChange('clientes')}
              role="tab"
              aria-selected={activeTab === 'clientes'}
              aria-controls="clientes"
              id="tab-clientes"
              className={`rounded-md px-5 py-3 text-sm font-semibold text-white shadow transition ${
                activeTab === 'clientes'
                  ? 'bg-indigo-600 hover:bg-indigo-500'
                  : 'bg-white/10 ring-1 ring-white/20 hover:bg-white/15'
              }`}
              aria-label="Ver cotización de transporte de carga, consolidado o flete dedicado"
              title="Cotizar transporte de carga"
            >
              Cotizar carga
              <span className="block text-[11px] font-normal text-white/80 mt-0.5">
                Consolidado · dedicado · distribución
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('conductores')}
              role="tab"
              aria-selected={activeTab === 'conductores'}
              aria-controls="conductores"
              id="tab-conductores"
              className={`rounded-md px-5 py-3 text-sm font-semibold text-white shadow transition ${
                activeTab === 'conductores'
                  ? 'bg-indigo-600 hover:bg-indigo-500'
                  : 'bg-white/10 ring-1 ring-white/20 hover:bg-white/15'
              }`}
              aria-label="Ver postulación de conductores con CV"
              title="Postular como conductor"
            >
              Postular como conductor
              <span className="block text-[11px] font-normal text-white/75 mt-0.5">
                Adjunta tu CV · licencias A2/A4/A5
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('colaboradores')}
              role="tab"
              aria-selected={activeTab === 'colaboradores'}
              aria-controls="colaboradores"
              id="tab-colaboradores"
              className={`rounded-md px-5 py-3 text-sm font-semibold text-white shadow transition ${
                activeTab === 'colaboradores'
                  ? 'bg-indigo-600 hover:bg-indigo-500'
                  : 'bg-white/10 ring-1 ring-white/20 hover:bg-white/15'
              }`}
              aria-label="Ver integración de flota y alianzas B2B"
              title="Integrar flota como colaborador"
            >
              Integrar flota B2B
              <span className="block text-[11px] font-normal text-white/75 mt-0.5">
                Camiones · ramplas · furgones
              </span>
            </button>
          </div>

          {/* SEO microcopy */}
          <p className="mt-6 text-sm text-white/70">
            SCAR ordena la decisión logística con datos: ruta, capacidad, ventana, documentación y nivel de control.
          </p>
        </div>

        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#1e3a8a" d="M0,0 C480,0 960,100 1440,100 L1440,100 L0,100 Z" />
        </svg>
      </section>

      <section className="min-h-[420px] bg-[#1e3a8a]">
        {activeTab === 'clientes' && (
          <section id="clientes" role="tabpanel" aria-labelledby="tab-clientes">
            <ContactCliente />
          </section>
        )}

        {activeTab === 'conductores' && (
          <section id="conductores" role="tabpanel" aria-labelledby="tab-conductores">
            <ContactConductor />
          </section>
        )}

        {activeTab === 'colaboradores' && (
          <section id="colaboradores" role="tabpanel" aria-labelledby="tab-colaboradores">
            <ContactColaborador />
          </section>
        )}
      </section>

      <FAQ />
      <Footer />
      <WhatsAppChat />
      <CallButton />
    </div>
  )
}
