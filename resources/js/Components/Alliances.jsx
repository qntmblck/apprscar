import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import Flashcard from './Flashcard'

const items = [
  {
    title: 'ACHS Virtual & Gestión',
    description:
      'Herramientas digitales de capacitación y gestión avanzada en seguridad y salud laboral.',
    image: '/img/achs.png',
  },
  {
    title: 'Subcontrataley',
    description:
      'Sistema de monitoreo y gestión para asegurar el cumplimiento normativo de trabajadores y empresas colaboradoras.',
    image: '/img/subcontrataley.png',
  },
  {
    title: 'Maquinaria para Construcción',
    description:
      'Nos aliamos con empresas líderes en arriendo de maquinaria para asegurar operaciones eficientes.',
    image: '/img/santaema.png',
  },
  {
    title: 'Alianza con Transportes',
    description:
      'Establecemos convenios con empresas de transporte para ampliar nuestra cobertura logística a lo largo del país.',
    image: '/img/al.jpeg?v=2',
  },
]

export default function Alliances() {
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      controls.start({
        scale: 1,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 12,
        },
      })
    }
  }, [inView, controls])

  return (
    <section id="alliances" className="bg-white pt-6 pb-8 scroll-mt-24">
      <motion.div
        ref={ref}
        initial={{ scale: 2.5, opacity: 0 }}
        animate={controls}
        className="max-w-7xl mx-auto px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Compromiso y Alianzas
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            En Transportes SCAR colaboramos estrechamente con nuestros clientes y aliados estratégicos para garantizar cumplimiento, excelencia operativa y desarrollo del equipo humano.
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
