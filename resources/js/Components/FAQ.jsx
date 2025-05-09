const faqs = [
    {
      id: 1,
      question: '¿Cómo puedo cotizar un servicio de transporte?',
      answer:
        'Puedes utilizar el formulario de contacto para clientes. Nos comunicaremos contigo lo antes posible con una propuesta personalizada.',
    },
    {
      id: 2,
      question: '¿Qué tipo de carga transportan?',
      answer:
        'Transportamos carga general, palletizada, a granel y especializada en carretera, desde Arica a Punta Arenas.',
    },
    {
      id: 3,
      question: '¿Cómo puedo postular como conductor o transportista asociado?',
      answer:
        'Accede al formulario de contacto para transportistas, completa tus datos y te responderemos directamente por correo o teléfono.',
    },
    {
      id: 4,
      question: '¿Dónde están ubicados?',
      answer:
        'Nuestra base principal está en Lampa, Región Metropolitana, con cobertura nacional.',
    },
    {
      id: 5,
      question: '¿Ofrecen seguimiento de carga?',
      answer:
        'Sí, utilizamos sistemas de gestión y trazabilidad para informar sobre el estado de tu carga en tiempo real.',
    },
  ]

  export default function FAQ() {
    return (
      <section
        id="faq"
        className="relative isolate overflow-hidden bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Preguntas frecuentes
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/80">
            ¿Tienes otra pregunta que no ves aquí? Puedes escribirnos directamente usando cualquiera de los formularios o por WhatsApp.
          </p>
          <div className="mt-20">
            <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
              {faqs.map((faq) => (
                <div key={faq.id}>
                  <dt className="text-base font-semibold text-white">{faq.question}</dt>
                  <dd className="mt-2 text-base text-white/70">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Fondo decorativo sutil */}
        <svg
          viewBox="0 0 1024 1024"
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
        >
          <circle r={512} cx={512} cy={512} fill="url(#scar-gradient)" fillOpacity="0.6" />
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
