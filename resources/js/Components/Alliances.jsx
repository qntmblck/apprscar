import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import Flashcard from './Flashcard'

const items = [
  {
    title: 'ACHS Virtual & Gestión',
    description:
      'Soluciones digitales orientadas al fortalecimiento de la seguridad, salud y formación continua del equipo operativo.',
    image: '/img/achs.png',
    alt: 'ACHS Virtual y Gestión - seguridad y salud ocupacional',
  },
  {
    title: 'Subcontrataley',
    description:
      'Sistema de control normativo para asegurar la trazabilidad, cumplimiento laboral y respaldo documental en todas las operaciones.',
    image: '/img/subcontrataley.png',
    alt: 'Subcontrataley - cumplimiento y trazabilidad documental',
  },
  {
    title: 'Maquinaria para Construcción',
    description:
      'Colaboración con proveedores estratégicos de maquinaria pesada para ampliar capacidades operativas con equipos de alto rendimiento.',
    image: '/img/santaema.png',
    alt: 'Maquinaria para construcción - equipos de alto rendimiento',
  },
  {
    title: 'Alianza con Transportes',
    description:
      'Red de convenios con operadores logísticos en todo el país que garantiza cobertura nacional y eficiencia local.',
    image: '/img/al.jpeg',
    alt: 'Alianzas con transportes - red logística y cobertura nacional',
  },
]

export default function Alliances() {
  const controls = useAnimation()
  const reduceMotion = useReducedMotion()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, x: 0 })
    }
  }, [inView, controls])

  const containerVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
  }

  return (
    <section
      id="alliances"
      className="bg-white py-16 px-4 sm:px-6 lg:px-8"
      aria-labelledby="alliances-title"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: reduceMotion ? 0 : -60 }}
          animate={controls}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          {/* SEO: breadcrumb semántico */}
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-700">
            Partners · Cumplimiento · Trazabilidad
          </p>

          <h2 id="alliances-title" className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">
            Colaboración Estratégica
          </h2>

          {/* SEO + marketing: keywords naturales, sin “spam” */}
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Nuestro modelo de alianzas integra <b>tecnología</b>, <b>cumplimiento normativo</b> y{' '}
            <b>capacidad operativa</b> para entregar servicios de <b>transporte y distribución</b> con mayor continuidad,
            respaldo documental y control de gestión. Estas colaboraciones fortalecen cada parte del servicio y amplían
            nuestro alcance logístico a nivel nacional.
          </p>


        </motion.div>

        {/* Lista SEO + animaciones por tarjeta, sin romper el layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Alianzas estratégicas y colaboradores"
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              role="listitem"
              aria-label={item.title}
              className="contents"
              itemScope
              itemType="https://schema.org/Organization"
              itemProp="itemListElement"
            >
              {/* Microdata SEO sin afectar el diseño */}
              <meta itemProp="name" content={item.title} />
              <meta itemProp="description" content={item.description} />

              {/* Mantiene Flashcard funcional */}
              <Flashcard title={item.title} description={item.description} image={item.image} alt={item.alt} />
            </motion.div>
          ))}
        </motion.div>

        {/* SEO extra: texto de soporte (no afecta UX, pero ayuda a relevancia) */}
        <p className="mt-10 text-sm text-gray-500 max-w-3xl mx-auto text-center">
          Estas alianzas apoyan nuestra operación en seguridad laboral, control de subcontratación, disponibilidad de
          equipos y coordinación logística, mejorando la experiencia de clientes y colaboradores.
        </p>
      </div>
    </section>
  )
}
