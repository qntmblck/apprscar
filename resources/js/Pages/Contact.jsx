import Header from '@/Components/Header'
import Footer from '@/Components/Footer'
import ContactCliente from '@/Components/ContactCliente'
import ContactTransportista from '@/Components/ContactTransportista'
import FAQ from '@/Components/FAQ'
import WhatsAppChat from '@/Components/WhatsAppChat'
import CallButton from '@/Components/CallButton'
import { useEffect } from 'react'

export default function Contacto() {
  useEffect(() => {
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
    <div className="bg-white">
      {/* Encabezado */}
      <Header />

      {/* Hero actualizado */}
      <section
        className="relative bg-[#0c1e3a] text-white py-28 sm:py-36 px-6 text-center overflow-hidden bg-center bg-cover"
        style={{
          backgroundImage: "url('/img/mano.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold">Contáctanos</h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-200">
            ¿Eres cliente o transportista? Escoge el formulario adecuado y conversemos.
          </p>
        </div>

        {/* Separador inferior */}
        <svg className="absolute bottom-0 left-0 w-full text-white" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#1e3a8a" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z"></path>
        </svg>
      </section>


      <section id="clientes">
      {/* Formulario para clientes */}
      <ContactCliente />
      </section>


      {/* Separador sutil */}
      <div className="h-8 bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a]" />


      <section id="colaboradores">
      {/* Formulario para transportistas */}
      <ContactTransportista />
      </section>


      {/* Separador sutil */}
      <div className="h-8 bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a]" />


      {/* Preguntas frecuentes */}
      <FAQ />

      {/* Footer */}
      <Footer />

      <WhatsAppChat />
<CallButton />

    </div>
  )
}
