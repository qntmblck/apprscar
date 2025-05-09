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
      <div className="bg-gray-900" id="faq">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Preguntas frecuentes</h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300">
            ¿Tienes otra pregunta que no ves aquí? Puedes escribirnos directamente usando cualquiera de los formularios o
            por WhatsApp.
          </p>
          <div className="mt-20">
            <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
              {faqs.map((faq) => (
                <div key={faq.id}>
                  <dt className="text-base font-semibold text-white">{faq.question}</dt>
                  <dd className="mt-2 text-base text-gray-300">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    )
  }
