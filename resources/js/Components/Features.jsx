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
      'Traducimos tu operación (origen/destino, ventanas, volúmenes, restricciones) en parámetros claros de ruta, capacidad y niveles de servicio.',
    icon: UserGroupIcon,
    keywords: 'cotización, levantamiento, requerimientos, operación, distribución',
  },
  {
    name: 'Protocolos, seguridad y continuidad',
    description:
      'Aplicamos procedimientos estandarizados y equipos capacitados para responder ante contingencias, sostener continuidad y cumplir SLA.',
    icon: ShieldCheckIcon,
    keywords: 'seguridad, protocolos, contingencias, estándar, cumplimiento',
  },
  {
    name: 'Coordinación trazable y control operacional',
    description:
      'Definimos responsables, hitos y puntos de control para reducir ambigüedad, evitar reprocesos y mantener visibilidad con KPI.',
    icon: ChartBarIcon,
    keywords: 'coordinación, trazabilidad, control, información, KPI',
  },
  {
    name: 'Menos latencia, más eficiencia',
    description:
      'Optimizamos flujos y asignación de recursos para bajar tiempos de respuesta y acelerar decisiones en terreno y backoffice.',
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
      className="relative py-16 sm:py-20 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0c1e3a 60%, #080f1e 100%)' }}
      aria-labelledby="features-title"
      itemScope
      itemType="https://schema.org/Service"
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,148,217,0.12) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Glow */}
      <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full bg-[#0094d9]/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: reduceMotion ? 0 : -42 }}
          animate={controls}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-10"
        >
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-5 lg:gap-10">
            <div>
              <p className="text-xs font-semibold text-[#0094d9] uppercase tracking-widest mb-3">
                Método · Control · Evidencia
              </p>
              <h2
                id="features-title"
                className="text-2xl sm:text-4xl font-semibold tracking-tight text-white text-center text-balance lg:pr-2"
              >
                Método operativo: estándares, control y evidencia
              </h2>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-[#0094d9]/10 border border-[#0094d9]/20 flex items-center justify-center">
                <img
                  src="/img/logoscar.webp"
                  alt="Logo Transportes SCAR"
                  className="h-20 sm:h-28 w-auto"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <p
              className="text-sm sm:text-base leading-6 sm:leading-7 text-slate-300 text-justify [hyphens:auto] lg:pl-2"
              style={{ textAlignLast: 'left' }}
            >
              Convertimos la operación en un sistema claro: estándares, responsables, KPI y respaldo documental.
              Así reducimos errores, mejoramos cumplimiento y sostenemos continuidad con visibilidad de punta a punta.
            </p>
          </div>

          <meta itemProp="provider" content="Transportes SCAR" />
          <meta itemProp="areaServed" content="Chile" />
          <meta itemProp="serviceType" content="Transporte de carga y distribución con control operativo" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Características del servicio"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.name}
              variants={itemVariants}
              role="listitem"
              className="bg-white/[0.03] border border-[#0094d9]/20 rounded-2xl p-6 hover:border-[#0094d9]/40 hover:bg-white/[0.05] transition-all duration-300"
              itemScope
              itemType="https://schema.org/PropertyValue"
              itemProp="hasOfferCatalog"
            >
              <dt className="text-sm sm:text-base font-semibold text-white" itemProp="name">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0094d9]/10 border border-[#0094d9]/20">
                  <feature.icon className="h-5 w-5 text-[#0094d9]" aria-hidden="true" />
                </div>
                {feature.name}
              </dt>

              <dd
                className="mt-2 text-sm leading-6 text-slate-400 text-justify [hyphens:auto]"
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
