import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import Flashcard from './Flashcard'

const items = [
  {
    title: 'ACHS Virtual & Gestión',
    description:
      'Soluciones digitales orientadas al fortalecimiento de la seguridad, salud y formación continua del equipo operativo.',
    image: '/img/achs.png',
  },
  {
    title: 'Subcontrataley',
    description:
      'Sistema de control normativo para asegurar la trazabilidad, cumplimiento laboral y respaldo documental en todas las operaciones.',
    image: '/img/subcontrataley.png',
  },
  {
    title: 'Maquinaria para Construcción',
    description:
      'Colaboración con proveedores estratégicos de maquinaria pesada para ampliar capacidades operativas con equipos de alto rendimiento.',
    image: '/img/santaema.png',
  },
  {
    title: 'Alianza con Transportes',
    description:
      'Red de convenios con operadores logísticos en todo el país, lo que permite mayor cobertura y disponibilidad de flota bajo estándares comunes.',
    image: '/img/al.jpeg?v=2',
  },
]

export default function Alliances() {
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 60,
          damping: 14,
        },
      })
    }
  }, [inView, controls])

  return (
    <section id="alliances" className="bg-white pt-6 pb-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0.01, y: 50 }}
        animate={controls}
        className="max-w-7xl mx-auto px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Colaboración Estratégica
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            Nuestro modelo de alianzas integra tecnología, cumplimiento y capacidad operativa mediante acuerdos con actores clave. Estas colaboraciones fortalecen cada parte del servicio y amplían nuestro alcance logístico a nivel nacional.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8 pb-0 mb-8 px-2 sm:px-6">
          {items.map((item, i) => (
            <Flashcard
              key={i}
              title={item.title}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
