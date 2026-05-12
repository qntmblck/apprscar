import SEO from '@/Components/SEO'
import Header from '@/Components/Header'
import Hero from '@/Components/Hero'
import Clients from '@/Components/Clients'
import Features from '@/Components/Features'
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
  logo: `${siteUrl}/img/logoscar.png`,
  image: `${siteUrl}/img/dashboard/truck.jpg`,
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
    url: `${siteUrl}/img/dashboard/truck.jpg`,
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
        title="Transporte de carga y distribución en Chile | Transportes SCAR"
        description="Empresa de transporte de carga, distribución y logística B2B en Chile. Transportes SCAR coordina fletes, rutas y operaciones con cobertura nacional."
        canonical="/"
        image="/img/dashboard/truck.jpg"
        jsonLd={[organizationSchema, websiteSchema, homeSchema]}
      />

      <div className="bg-white overflow-x-hidden leading-none">
        <Header />

        <main className="overflow-hidden leading-none antialiased bg-white">
          <Hero />

          {/* Separador curvo (Hero → Clients) */}
          <div className="bg-white -mt-[1px]">
            <svg
              className="w-full block leading-none"
              preserveAspectRatio="none"
              viewBox="0 0 1440 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="#0c1e3a" d="M0,0 C480,60 960,0 1440,60 L1440,0 L0,0 Z" />
            </svg>
          </div>

          <Clients />

          <Features />

          {/* Separador superior: Features → Statistics */}
<div className="-mt-[1px] h-10 w-full bg-gradient-to-b from-[#354256] via-[#d5e5ff] to-[#eef2ff]" />



          <Statistics />
          {/* Separador inferior: Statistics → Alliances */}
<div className="-mt-[1px] h-10 w-full bg-gradient-to-b from-[#eef2ff] via-[#f5f7fb] to-white" />


          <Alliances />

          {/* Separador curvo: de fondo blanco a CTA azul */}
<div className="bg-white">
  <svg
    className="w-full h-[60px] block leading-none"
    viewBox="0 0 1440 60"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      fill="#1e3a8a"
      d="M0,60 C480,0 960,60 1440,0 L1440,60 L0,60 Z"
    />
  </svg>
</div>

<div className="-mt-[1px] relative z-10">
  <CallToAction />
</div>
        </main>

      <WhatsAppChat />
      <CallButton />
        <Footer />
      </div>
    </>
  )
}
