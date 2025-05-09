import Header from '@/Components/Header'
import Footer from '@/Components/Footer'
import ContactCliente from '@/Components/ContactCliente'
import ContactTransportista from '@/Components/ContactTransportista'
import FAQ from '@/Components/FAQ'

export default function Contact() {
  return (
    <div className="bg-white">
      {/* Encabezado */}
      <Header />

      {/* Hero simple */}
      <section
        className="relative bg-[#0c1e3a] text-white py-24 px-6 text-center"
        style={{ backgroundImage: "url('/img/dashboard/truck.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold">Contáctanos</h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-200">
            ¿Eres cliente o transportista? Escoge el formulario adecuado y conversemos.
          </p>
        </div>
      </section>

      {/* Formulario para clientes */}
      <ContactCliente />

      {/* Formulario para transportistas */}
      <ContactTransportista />

      {/* Preguntas frecuentes */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  )
}
