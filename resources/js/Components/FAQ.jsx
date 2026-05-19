import SectionBadge from './SectionBadge'

const faqs = [
  {
    id: 1,
    question: '¿Cómo puedo cotizar transporte de carga?',
    answer:
      'La forma más rápida es solicitarlo desde el portal SCAR. Envía origen, destino, volumen, tipo de carga y ventana horaria para evaluar si conviene flete dedicado, carga consolidada o distribución programada.',
  },
  {
    id: 2,
    question: '¿Qué es una carga consolidada?',
    answer:
      'Es una solución para cargas parciales que no requieren un camión completo. Agrupamos volúmenes compatibles en una ruta planificada para mejorar costo, capacidad y continuidad.',
  },
  {
    id: 3,
    question: '¿Cuándo conviene consolidado y cuándo flete dedicado?',
    answer:
      'El consolidado conviene cuando el volumen es parcial y la ventana permite coordinación. El flete dedicado conviene cuando la carga exige prioridad, control exclusivo, ruta directa o una ventana estricta.',
  },
  {
    id: 4,
    question: '¿Qué tipo de carga transportan?',
    answer:
      'Trabajamos con carga general, palletizada y distribución B2B. Cada solicitud se revisa según ruta, manipulación, volumen, restricciones operativas y documentación requerida.',
  },
  {
    id: 5,
    question: '¿Tienen cobertura nacional?',
    answer:
      'Sí. Nuestra base está en Lampa, Región Metropolitana, y coordinamos operaciones a nivel nacional según disponibilidad, ruta, demanda y compatibilidad de carga.',
  },
  {
    id: 6,
    question: '¿Cómo puedo postular o integrar mi flota?',
    answer:
      'Si eres conductor, postula con CV desde el portal. Si cuentas con camiones, ramplas o furgones, completa la solicitud de colaborador para evaluar cobertura, disponibilidad y estándares operativos.',
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
          Decisiones claras · Cotización · Soporte
        </SectionBadge>

        <h2 id="faq-title" className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Preguntas frecuentes sobre transporte y carga consolidada
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
          Resolvemos las dudas que suelen frenar una solicitud: qué datos entregar, cuándo conviene consolidar carga,
          cómo evaluar cobertura y cómo integrarse a la red operativa de SCAR.
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
            <span className="font-semibold text-white">Tip:</span> para una respuesta más precisa, envía{' '}
            <span className="font-semibold text-[#0094d9]">origen</span>, <span className="font-semibold text-[#0094d9]">destino</span>,{' '}
            <span className="font-semibold text-[#0094d9]">volumen</span>, <span className="font-semibold text-[#0094d9]">tipo de carga</span> y{' '}
            <span className="font-semibold text-[#0094d9]">ventana horaria</span>.
          </p>
        </div>
      </div>
    </section>
  )
}
