import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import Flashcard from './Flashcard'

const items = [
  {
    title: 'ACHS Virtual & Gestión',
    description:
      'Soporte en seguridad y salud ocupacional, capacitación y cultura preventiva para equipos en operación.',
    image: '/img/achs.png',
    alt: 'ACHS Virtual y Gestión - seguridad, salud ocupacional y capacitación',
  },
  {
    title: 'Subcontrataley',
    description:
      'Control normativo y respaldo documental para gestión de subcontratación, trazabilidad y cumplimiento laboral.',
    image: '/img/subcontrataley.png',
    alt: 'Subcontrataley - cumplimiento laboral y trazabilidad documental',
  },
  {
    title: 'Maquinaria para Construcción',
    description:
      'Acceso a equipos y proveedores estratégicos para ampliar capacidad y respuesta operativa cuando el proyecto lo exige.',
    image: '/img/santaema.png',
    alt: 'Maquinaria para construcción - apoyo operativo y disponibilidad de equipos',
  },
  {
    title: 'Red de operadores asociados',
    description:
      'Convenios con operadores y flotas complementarias para continuidad, soporte local y flexibilidad en picos de demanda.',
    image: '/img/al.jpeg',
    alt: 'Red de operadores asociados - continuidad operativa y soporte local',
  },
]

export default function Alliances() {
  const controls = useAnimation()
  const reduceMotion = useReducedMotion()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, x: 0 })
  }, [inView, controls])

  const containerVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: 'easeOut',
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : 0.99 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: 'easeOut' } },
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
          initial={{ opacity: 0, x: reduceMotion ? 0 : -50 }}
          animate={controls}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-700">
            Partners · Cumplimiento · Continuidad
          </p>

          <h2 id="alliances-title" className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">
            Alianzas que fortalecen la operación
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nuestro ecosistema integra <b>cumplimiento normativo</b>, <b>seguridad laboral</b> y <b>capacidad</b> para
            sostener continuidad, respaldo y control en escenarios exigentes. Estas colaboraciones reducen fricción
            operativa y elevan el estándar de ejecución.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Alianzas estratégicas"
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
              <meta itemProp="name" content={item.title} />
              <meta itemProp="description" content={item.description} />
              <Flashcard title={item.title} description={item.description} image={item.image} alt={item.alt} />
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-10 text-sm text-gray-500 max-w-3xl mx-auto text-center leading-relaxed">
          Alianzas orientadas a seguridad, control de subcontratación, disponibilidad de recursos y coordinación
          operativa, con foco en cumplimiento y continuidad.
        </p>
      </div>
    </section>
  )
}
