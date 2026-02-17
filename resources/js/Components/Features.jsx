import {
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

const features = [
  {
    name: 'Levantamiento y diseño del servicio',
    description:
      'Levantamos tu operación (origen/destino, ventanas, volúmenes, restricciones) y la convertimos en parámetros claros de ruta, capacidad y servicio.',
    icon: UserGroupIcon,
    keywords: 'cotización, levantamiento, requerimientos, operación, distribución',
  },
  {
    name: 'Protocolos, seguridad y continuidad',
    description:
      'Operamos con procedimientos estandarizados y personal capacitado para responder ante contingencias, sostener continuidad y cumplir SLA.',
    icon: ShieldCheckIcon,
    keywords: 'seguridad, protocolos, contingencias, estándar, cumplimiento',
  },
  {
    name: 'Coordinación trazable y control operacional',
    description:
      'Definimos responsables, hitos y puntos de control para reducir ambigüedades, evitar reprocesos y mantener visibilidad con KPI.',
    icon: ChartBarIcon,
    keywords: 'coordinación, trazabilidad, control, información, KPI',
  },
  {
    name: 'Menos latencia, más eficiencia',
    description:
      'Automatizamos flujos y asignamos recursos para bajar tiempos de espera, acelerar decisiones y mejorar productividad en terreno y backoffice.',
    icon: ClockIcon,
    keywords: 'tiempo de respuesta, automatización, SLA, eficiencia',
  },
]

export default function Features() {
  const controls = useAnimation()
  const reduceMotion = useReducedMotion()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, x: 0 })
  }, [inView, controls])

  const containerVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: 'easeOut',
        staggerChildren: reduceMotion ? 0 : 0.06,
        delayChildren: reduceMotion ? 0 : 0.02,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : 0.99 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: 'easeOut' } },
  }

  return (
    <section
      id="servicios"
      className="bg-gradient-to-br from-[#0c1e3a] via-[#0c1e3aa0] to-[#102546] py-5 sm:py-7"
      aria-labelledby="features-title"
      itemScope
      itemType="https://schema.org/Service"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ✅ HEADER RE-ARMADO: microcopy full width + bloque horizontal (título | logo | párrafo) */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: reduceMotion ? 0 : -42 }}
          animate={controls}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-7 sm:mb-9"
        >


          {/* 2) Segundo bloque horizontal */}
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-5 lg:gap-10">
            {/* Título (izquierda en desktop) */}
            <h2
              id="features-title"
              className="text-2xl sm:text-4xl font-semibold tracking-tight text-white text-center text-balance lg:pr-2"
            >
             Estandarización y control en cada etapa del servicio
            </h2>

            {/* Logo (centro en desktop, entre título y párrafo) */}
            <div className="flex items-center justify-center">
              <img
                src="/img/logoscar.png"
                alt="Logo Transportes SCAR"
                className="h-20 sm:h-28 lg:h-32 w-auto"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Párrafo (derecha en desktop) */}
            <p
              className="text-sm sm:text-base leading-6 sm:leading-7 text-gray-300 text-justify [hyphens:auto] lg:pl-2"
              style={{ textAlignLast: 'left' }}
            >
              En Transportes SCAR estandarizamos procesos, medimos desempeño y dejamos respaldo documental para reducir
              incidencias, mejorar cumplimiento y sostener un servicio consistente en transporte, distribución y última
              milla.
            </p>
          </div>

          {/* Schema meta */}
          <meta itemProp="provider" content="Transportes SCAR" />
          <meta itemProp="areaServed" content="Chile" />
          <meta itemProp="serviceType" content="Transporte y distribución con control operativo" />
        </motion.div>




        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-7"
          role="list"
          aria-label="Características del servicio"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.name}
              variants={itemVariants}
              role="listitem"
              className="flex flex-col items-start"
              itemScope
              itemType="https://schema.org/PropertyValue"
              itemProp="hasOfferCatalog"
            >
              <dt className="text-sm sm:text-base font-semibold text-white" itemProp="name">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500 shadow-sm ring-1 ring-white/10">
                  <feature.icon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                {feature.name}
              </dt>

              <dd
                className="mt-1 text-sm leading-6 text-gray-300 text-justify [hyphens:auto]"
                style={{ textAlignLast: 'left' }}
                itemProp="value"
              >
                {feature.description}
              </dd>

              <span className="sr-only">{feature.keywords}</span>
            </motion.div>
          ))}
        </motion.div>


      </div>
    </section>
  )
}
