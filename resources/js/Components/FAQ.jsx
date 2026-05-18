import SectionBadge from './SectionBadge'

const faqs = [
  {
    id: 1,
    question: '¿Cómo puedo cotizar un servicio de transporte?',
    answer:
      'La forma más rápida es solicitar tu cotización desde el portal SCAR (cliente). Si lo prefieres, también puedes escribirnos por correo o WhatsApp con origen, destino y tipo de carga.',
  },
  {
    id: 2,
    question: '¿Qué tipo de carga transportan?',
    answer:
      'Transportamos carga general, palletizada y servicios de distribución. La disponibilidad puede variar según ruta, ventana horaria y requisitos operativos.',
  },
  {
    id: 3,
    question: '¿Cómo puedo postular como conductor o transportista asociado?',
    answer:
      'Si eres conductor, postula con CV desde el portal. Si cuentas con flota y quieres integrarte como colaborador B2B, completa el formulario de integración de flota.',
  },
  {
    id: 4,
    question: '¿Dónde están ubicados y qué cobertura tienen?',
    answer:
      'Nuestra base operativa está en Lampa (Región Metropolitana). Operamos principalmente a nivel nacional según planificación, demanda y compatibilidad por ruta.',
  },
  {
    id: 5,
    question: '¿Ofrecen seguimiento de carga?',
    answer:
      'Sí. Trabajamos con procesos y herramientas de trazabilidad para informar el estado del servicio y coordinar hitos operativos según el tipo de operación.',
  },
  {
    id: 6,
    question: '¿Qué datos ayudan a responder más rápido?',
    answer:
      'Origen, destino, tipo de carga, volumen aproximado, fecha estimada y cualquier restricción operativa. Con esa información podemos orientar mejor la solicitud.',
  },
]

export default function FAQ() {
  return (
    <section
      id="faq"
      className="relative isolate overflow-hidden py-16 sm:py-20"
      style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0c1e3a 60%, #060d1b 100%)' }}
      aria-labelledby="faq-title"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,148,217,0.12) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-[#0094d9]/8 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <SectionBadge>
          Ayuda · Información y soporte
        </SectionBadge>

        <h2 id="faq-title" className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Preguntas frecuentes
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
          Resolvemos dudas comunes sobre cotización de fletes, postulación de conductores e integración de flota. Si
          tienes un caso específico, contáctanos por el formulario correspondiente o por WhatsApp.
        </p>

        <div className="mt-10">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white/[0.03] border border-[#0094d9]/20 rounded-2xl p-6 hover:border-[#0094d9]/40 hover:bg-white/[0.05] transition-all duration-300"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <dt className="text-base font-semibold text-white" itemProp="name">
                  {faq.question}
                </dt>
                <dd
                  className="mt-3 text-sm leading-6 text-slate-400"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <p itemProp="text">{faq.answer}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-6 bg-white/[0.03] border border-[#0094d9]/20 rounded-2xl p-6">
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-white">Tip:</span> para cotizar más rápido, envía{' '}
            <span className="font-semibold text-[#0094d9]">origen</span>, <span className="font-semibold text-[#0094d9]">destino</span>,{' '}
            <span className="font-semibold text-[#0094d9]">tipo de carga</span> y <span className="font-semibold text-[#0094d9]">ventana horaria</span>.
          </p>
        </div>
      </div>
    </section>
  )
}
