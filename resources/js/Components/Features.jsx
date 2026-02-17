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
    name: 'Análisis de Requerimientos del Cliente',
    description:
      'Recolectamos y procesamos información específica sobre cada cliente para identificar parámetros operativos clave, permitiendo configuraciones de servicio basadas en datos.',
    icon: UserGroupIcon,
    keywords: 'cotización, levantamiento, requerimientos, operación, distribución',
  },
  {
    name: 'Protocolos de Resolución Operativa',
    description:
      'Aplicamos modelos de resolución estructurada con personal capacitado en procedimientos estandarizados, optimizando los tiempos de respuesta ante contingencias.',
    icon: ShieldCheckIcon,
    keywords: 'seguridad, protocolos, contingencias, estándar, cumplimiento',
  },
  {
    name: 'Optimización de la Comunicación Funcional',
    description:
      'Mantenemos flujos de comunicación definidos, orientados a la claridad operativa, reducción de ambigüedades y minimización de errores por malentendidos.',
    icon: ChartBarIcon,
    keywords: 'coordinación, trazabilidad, control, información, KPI',
  },
  {
    name: 'Minimización de Latencia de Atención',
    description:
      'Implementamos automatización de flujos y estrategias de asignación de recursos que reducen la latencia del servicio, disminuyendo significativamente los tiempos de espera promedio.',
    icon: ClockIcon,
    keywords: 'tiempo de respuesta, automatización, SLA, eficiencia',
  },
]

export default function Features() {
  const controls = useAnimation()
  const reduceMotion = useReducedMotion()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, x: 0 })
    }
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
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
  }

  return (
    <section
      id="servicios"
      className="bg-gradient-to-br from-[#0c1e3a] via-[#0c1e3aa0] to-[#102546] py-8 sm:py-12"
      aria-labelledby="features-title"
      itemScope
      itemType="https://schema.org/Service"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado animado (mantenido, mejorado con easing y reduceMotion) */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: reduceMotion ? 0 : -60 }}
          animate={controls}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 sm:gap-10 mb-16 text-center"
        >
          <div className="flex-shrink-0">
            <img
              src="/img/logoscar.png"
              alt="Logo Transportes SCAR"
              className="h-24 sm:h-40 w-auto mx-auto sm:mx-0"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="max-w-2xl">
            {/* SEO microcopy */}
            <p className="text-xs font-semibold tracking-widest uppercase text-indigo-200">
              Servicios · Transporte · Distribución · Control operativo
            </p>

            <h2 id="features-title" className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tight text-white">
              Resultados que trazan nuestra ruta de excelencia
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-gray-300">
              Transportes SCAR aplica principios de análisis sistemático, mejora continua y control de procesos para
              optimizar cada fase del servicio logístico, elevando la trazabilidad, el cumplimiento y la experiencia del
              cliente.
            </p>


            {/* Schema meta */}
            <meta itemProp="provider" content="Transportes SCAR" />
            <meta itemProp="areaServed" content="Chile" />
            <meta itemProp="serviceType" content="Transporte y distribución con control operativo" />
          </div>
        </motion.div>

        {/* Grilla de características (con stagger pro, sin cambiar layout) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
          role="list"
          aria-label="Características del servicio"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.name}
              variants={itemVariants}
              role="listitem"
              className="flex flex-col items-center text-center sm:items-center sm:text-center"
              itemScope
              itemType="https://schema.org/PropertyValue"
              itemProp="hasOfferCatalog"
            >
              <dt className="text-base font-semibold text-white" itemProp="name">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500 mx-auto shadow-sm ring-1 ring-white/10">
                  <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                {feature.name}
              </dt>

              <dd className="mt-1 text-base text-gray-300" itemProp="value">
                {feature.description}
              </dd>

              {/* SEO: keywords discretas (no visibles) */}
              <span className="sr-only">{feature.keywords}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Copy adicional SEO/marketing (sin afectar UX) */}
        <p className="mt-12 text-sm text-white/70 max-w-4xl mx-auto text-center">
          Nuestro enfoque combina estándares, protocolos y automatización para mejorar tiempos de respuesta y reducir
          incidencias en operaciones de transporte, distribución y última milla, con comunicación clara y respaldo
          documental.
        </p>
      </div>
    </section>
  )
}
