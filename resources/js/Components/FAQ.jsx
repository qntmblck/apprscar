// resources/js/Components/FAQ.jsx

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
]

export default function FAQ() {
  return (
    <section
      id="faq"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a]"
      aria-labelledby="faq-title"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {/* Alineado a ContactColaborador: max-w-6xl / px / py */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20 relative z-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-200">
          Ayuda · Información y soporte
        </p>

        <h2 id="faq-title" className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Preguntas frecuentes
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-7 text-white/80">
          Resolvemos dudas comunes sobre cotización de fletes, postulación de conductores e integración de flota. Si
          tienes un caso específico, contáctanos por el formulario correspondiente o por WhatsApp.
        </p>

        {/* Cards alineadas con el look & feel del resto */}
        <div className="mt-10">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="rounded-xl bg-white/5 ring-1 ring-white/15 p-6"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <dt className="text-base font-semibold text-white" itemProp="name">
                  {faq.question}
                </dt>
                <dd
                  className="mt-2 text-sm leading-6 text-white/75"
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

        {/* Micro-CTA SEO/marketing (sin romper diseño) */}
        <div className="mt-10 rounded-xl bg-white/5 ring-1 ring-white/15 p-6">
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white">Tip:</span> para cotizar más rápido, envía{' '}
            <span className="font-semibold text-white">origen</span>, <span className="font-semibold text-white">destino</span>,{' '}
            <span className="font-semibold text-white">tipo de carga</span> y <span className="font-semibold text-white">ventana horaria</span>.
          </p>
        </div>
      </div>

      {/* Fondo decorativo sutil (igual paleta) */}
      <svg
        viewBox="0 0 1024 1024"
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
      >
        <circle r={512} cx={512} cy={512} fill="url(#scar-gradient)" fillOpacity="0.55" />
        <defs>
          <radialGradient id="scar-gradient">
            <stop stopColor="#4f46e5" />
            <stop offset={1} stopColor="#312e81" />
          </radialGradient>
        </defs>
      </svg>
    </section>
  )
}
