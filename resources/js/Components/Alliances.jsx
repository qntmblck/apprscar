import Flashcard from './Flashcard'
import { useInView } from 'react-intersection-observer'
import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

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
      'Red de convenios con operadores logísticos en todo el país que garantiza cobertura nacional y eficiencia local.',
    image: '/img/al.jpeg',
  },
]

export default function Alliances() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, x: 0 })
    }
  }, [inView, controls])

  return (
    <section
      id="alliances"
      ref={ref}
      className="bg-white pt-24 pb-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={controls}
          transition={{ duration: 0.8 }}
          className="transform transition-transform duration-1000 hover:scale-[1.05]"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 transition-transform duration-300 hover:scale-105">
              Colaboración Estratégica
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto transition-transform duration-300 hover:scale-105">
              Nuestro modelo de alianzas integra tecnología, cumplimiento y capacidad operativa mediante acuerdos con actores clave. Estas colaboraciones fortalecen cada parte del servicio y amplían nuestro alcance logístico a nivel nacional.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <Flashcard
                key={index}
                title={item.title}
                description={item.description}
                image={item.image}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
