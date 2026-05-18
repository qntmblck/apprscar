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
    'Empresa chilena de transporte de carga por carretera, distribución y logística B2B con cobertura nacional.',
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
    'Transportes SCAR entrega servicios de transporte de carga, distribución y logística B2B en Chile, con cobertura nacional y control operacional.',
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

function WaveTransition({ gradient, fill, path, height = 96 }) {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden"
      style={{
        height: `${height}px`,
        background: gradient,
        lineHeight: 0,
        marginTop: '-2px',
        marginBottom: '-2px',
      }}
    >
      <svg
        className="absolute inset-0 block h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill={fill} d={path} />
      </svg>
    </div>
  )
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
        title="Transporte de carga y distribución en Chile | Transportes SCAR"
        description="Empresa de transporte de carga, distribución y logística B2B en Chile. Transportes SCAR coordina fletes, rutas y operaciones con cobertura nacional."
        canonical="/"
        image="/img/dashboard/truck.webp"
        preloadImage
        jsonLd={[organizationSchema, websiteSchema, homeSchema]}
      />

      <div className="overflow-x-hidden leading-none" style={{ background: '#060d1b' }}>
        <Header />

        <main className="overflow-hidden leading-none antialiased" style={{ background: '#060d1b' }}>
          <Hero />

          <Clients />

          <WaveTransition
            fill="white"
            height={98}
            gradient="linear-gradient(180deg, #ffffff 0%, #ffffff 34%, #d9eaff 55%, #1c4b84 82%, #0a1628 100%)"
            path="M0,48 C360,18 1080,74 1440,48 L1440,-4 L0,-4 Z"
          />

          <Features />

          <ConsolidadoCargas />

          <Statistics />

          <WaveTransition
            fill="#1e3a8a"
            height={92}
            gradient="linear-gradient(180deg, #1e3a8a 0%, #2f62ba 34%, #88b8ef 62%, #eef6ff 84%, #ffffff 100%)"
            path="M0,48 C360,16 1080,78 1440,48 L1440,-4 L0,-4 Z"
          />

          <Alliances />

          <WaveTransition
            fill="white"
            height={92}
            gradient="linear-gradient(180deg, #ffffff 0%, #ffffff 30%, #dcecff 54%, #456fc0 82%, #1e3a8a 100%)"
            path="M0,48 C360,78 1080,16 1440,48 L1440,-4 L0,-4 Z"
          />

          <CallToAction />
        </main>

        <WhatsAppChat />
        <CallButton />
        <Footer />
      </div>
    </>
  )
}
