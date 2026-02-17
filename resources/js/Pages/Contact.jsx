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
import { useEffect } from 'react'

export default function Contacto() {
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const el = document.querySelector(hash)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300)
    }
  }, [])

  return (
    <div className="bg-white">
      <SEO
        title="Contacto | Transportes SCAR — Cotiza fletes, postula como conductor o integra tu flota"
        description="Contacto oficial de Transportes SCAR. Cotiza transporte y distribución, postula como conductor con CV o integra tu flota como colaborador. Respuesta rápida por portal."
        canonical="/contacto"
        image="/img/og/contacto.jpg"
      />

      {/* JSON-LD (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contacto - Transportes SCAR',
            url: 'https://scartransportes.cl/contacto',
            about: {
              '@type': 'Organization',
              name: 'Transportes SCAR',
              url: 'https://scartransportes.cl',
              email: 'contacto@scartransportes.cl',
              telephone: '+56 9 4467 1205',
            },
            mainEntity: [
              {
                '@type': 'Service',
                name: 'Cotización de fletes',
                areaServed: 'Chile',
                provider: { '@type': 'Organization', name: 'Transportes SCAR' },
              },
              {
                '@type': 'Service',
                name: 'Postulación de conductores',
                areaServed: 'Chile',
                provider: { '@type': 'Organization', name: 'Transportes SCAR' },
              },
              {
                '@type': 'Service',
                name: 'Integración de flota (colaboradores)',
                areaServed: 'Chile',
                provider: { '@type': 'Organization', name: 'Transportes SCAR' },
              },
            ],
          }),
        }}
      />

      <Header />

      <section
        className="relative bg-[#0c1e3a] text-white py-28 sm:py-36 px-6 text-center overflow-hidden bg-center bg-cover"
        style={{ backgroundImage: "url('/img/mano.jpg')" }}
        aria-label="Encabezado de contacto"
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold">Contacto</h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-200">
            Elige tu caso: cotizar un flete, postular como conductor o integrar tu flota como colaborador.
          </p>

          <div
        className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        role="navigation"
        aria-label="Accesos rápidos de contacto"
        >
        <a
            href="#clientes"
            className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition"
            aria-label="Ir a cotización de fletes y servicios de transporte"
            title="Cotizar flete y servicios de transporte"
        >
            Cotizar flete
            <span className="block text-[11px] font-normal text-white/80 mt-0.5">
            Transporte y distribución · respuesta rápida
            </span>
        </a>

        <a
            href="#conductores"
            className="rounded-md bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15 transition"
            aria-label="Ir a postulación de conductores con CV"
            title="Postular como conductor"
        >
            Postular como conductor
            <span className="block text-[11px] font-normal text-white/75 mt-0.5">
            Adjunta tu CV · licencias A2/A4/A5
            </span>
        </a>

        <a
            href="#colaboradores"
            className="rounded-md bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15 transition"
            aria-label="Ir a integración de flota y alianzas B2B"
            title="Integrar flota como colaborador"
        >
            Integrar flota (B2B)
            <span className="block text-[11px] font-normal text-white/75 mt-0.5">
            Colaboradores · camiones, ramplas y furgones
            </span>
        </a>
          </div>


          {/* SEO microcopy */}
          <p className="mt-6 text-sm text-white/70">
            Transportes SCAR: transporte, distribución y operación organizada para clientes y partners.
          </p>
        </div>

        <svg className="absolute bottom-0 left-0 w-full text-white" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#1e3a8a" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z"></path>
        </svg>
      </section>

      <section id="clientes">
        <ContactCliente />
      </section>

      <div className="h-8 bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a]" />

      <section id="conductores">
        <ContactConductor />
      </section>

      <div className="h-8 bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a]" />

      <section id="colaboradores">
        <ContactColaborador />
      </section>

      <div className="h-8 bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a]" />

      <FAQ />
      <Footer />
      <WhatsAppChat />
      <CallButton />
    </div>
  )
}
