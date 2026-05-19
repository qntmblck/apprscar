import SEO from '@/Components/SEO'
import Header from '@/Components/Header'
import Hero from '@/Components/Hero'
import Clients from '@/Components/Clients'
import Features from '@/Components/Features'
import ConsolidadoCargas from '@/Components/ConsolidadoCargas'
import Statistics from '@/Components/Statistics'
import Alliances from '@/Components/Alliances'
import CallToAction from '@/Components/CallToAction'
import Footer from '@/Components/Footer'
import WhatsAppChat from '@/Components/WhatsAppChat'
import CallButton from '@/Components/CallButton'
import { useEffect } from 'react'

const siteUrl = 'https://scartransportes.cl'
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${siteUrl}/#organization`,
  name: 'Transportes SCAR',
  url: siteUrl,
  logo: `${siteUrl}/img/logoscar.webp`,
  image: `${siteUrl}/img/dashboard/truck.webp`,
  email: 'contacto@scartransportes.cl',
  telephone: '+56961068999',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Sta. Rosa de Santiago & Cam. Uno',
    addressLocality: 'Batuco, Lampa',
    addressRegion: 'Región Metropolitana',
    addressCountry: 'CL',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Chile',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+56961068999',
    contactType: 'customer service',
    email: 'contacto@scartransportes.cl',
    areaServed: 'CL',
    availableLanguage: 'es',
  },
  description:
    'Empresa chilena de transporte de carga, cargas consolidadas, distribución B2B y logística por carretera con cobertura nacional, trazabilidad y control operativo.',
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: 'Transportes SCAR',
  url: siteUrl,
  publisher: {
    '@id': `${siteUrl}/#organization`,
  },
  inLanguage: 'es-CL',
}

const homeSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/#webpage`,
  url: siteUrl,
  name: 'Transporte de carga y distribución para empresas en Chile | Transportes SCAR',
  description:
    'Transportes SCAR coordina transporte de carga, cargas consolidadas, fletes dedicados y distribución B2B en Chile con cobertura nacional, seguridad documental y control operacional.',
  isPartOf: {
    '@id': `${siteUrl}/#website`,
  },
  about: {
    '@id': `${siteUrl}/#organization`,
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: `${siteUrl}/img/dashboard/truck.webp`,
  },
  inLanguage: 'es-CL',
}

export default function Welcome() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const hash = window.location.hash
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      }
    }
  }, [])

    return (
    <>
      <SEO
        title="Transporte de carga y distribución para empresas en Chile | Transportes SCAR"
        description="Cotiza transporte de carga, cargas consolidadas, fletes dedicados y distribución B2B en Chile. SCAR coordina rutas nacionales con trazabilidad, seguridad y control operativo."
        canonical="/"
        image="/img/dashboard/truck.webp"
        preloadImage
        jsonLd={[organizationSchema, websiteSchema, homeSchema]}
      />

      <div className="overflow-x-hidden bg-[#060d1b] leading-none">
        <Header />

        <main className="overflow-hidden bg-white leading-none antialiased">
          <Hero />

          <Clients />

          <Features />

          <ConsolidadoCargas />

          <Statistics />

          <Alliances />

          <CallToAction />
        </main>

        <WhatsAppChat />
        <CallButton />
        <Footer />
      </div>
    </>
  )
}
