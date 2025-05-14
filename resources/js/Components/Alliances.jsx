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
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, x: 0 })
    }
  }, [inView, controls])

  return (
    <section
      id="alliances"
      className="bg-white py-8 sm:py-12"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado animado */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -60 }}
          animate={controls}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Colaboración Estratégica
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Nuestro modelo de alianzas integra tecnología, cumplimiento y capacidad operativa mediante acuerdos con actores clave. Estas colaboraciones fortalecen cada parte del servicio y amplían nuestro alcance logístico a nivel nacional.
          </p>
        </motion.div>

        {/* Grilla fija */}
        <div className="grid grid-cols-2 gap-6">
          {items.map((item, index) => (
            <Flashcard
              key={index}
              title={item.title}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
