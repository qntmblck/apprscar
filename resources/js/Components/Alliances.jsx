import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import {
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import SectionBadge from './SectionBadge'

const items = [
  {
    eyebrow: 'Seguridad preventiva',
    title: 'ACHS Virtual & Gestión',
    shortTitle: 'Seguridad laboral',
    description:
      'Soporte en seguridad y salud ocupacional para mantener equipos capacitados, criterios preventivos y operación responsable.',
    image: '/img/achs.webp',
    alt: 'ACHS Virtual y Gestión - seguridad, salud ocupacional y capacitación',
    icon: ShieldCheckIcon,
    bullets: ['Cultura preventiva', 'Capacitación operativa', 'Cuidado de equipos'],
  },
  {
    eyebrow: 'Control normativo',
    title: 'Subcontrataley',
    shortTitle: 'Cumplimiento documentado',
    description:
      'Respaldo documental y trazabilidad para ordenar la gestión de subcontratación con mayor control laboral.',
    image: '/img/subcontrataley.webp',
    alt: 'Subcontrataley - cumplimiento laboral y trazabilidad documental',
    icon: ClipboardDocumentCheckIcon,
    bullets: ['Documentación trazable', 'Gestión laboral', 'Menos fricción administrativa'],
  },
  {
    eyebrow: 'Capacidad escalable',
    title: 'Maquinaria para Construcción',
    shortTitle: 'Respuesta operativa',
    description:
      'Acceso a proveedores y equipos estratégicos para responder con más flexibilidad cuando el proyecto lo exige.',
    image: '/img/santaema.webp',
    alt: 'Maquinaria para construcción - apoyo operativo y disponibilidad de equipos',
    icon: TruckIcon,
    bullets: ['Proveedores activos', 'Mayor disponibilidad', 'Soporte en demanda alta'],
  },
  {
    eyebrow: 'Continuidad territorial',
    title: 'Red de operadores asociados',
    shortTitle: 'Cobertura flexible',
    description:
      'Operadores y flotas complementarias que fortalecen continuidad, soporte local y reacción ante picos de demanda.',
    image: '/img/al.webp',
    alt: 'Red de operadores asociados - continuidad operativa y soporte local',
    icon: CheckBadgeIcon,
    bullets: ['Red complementaria', 'Soporte local', 'Continuidad de servicio'],
  },
]

const trustSignals = [
  'Seguridad antes de la ruta',
  'Cumplimiento con respaldo',
  'Capacidad para crecer',
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
      className="relative overflow-hidden bg-white py-16 px-4 sm:px-6 lg:px-8"
      aria-labelledby="alliances-title"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0094d9]/25 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#0094d9]/5 blur-3xl" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: reduceMotion ? 0 : -50 }}
          animate={controls}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="relative text-center mb-10 sm:mb-12"
        >
          <SectionBadge color="#3730a3" backgroundOpacity={0.08} borderOpacity={0.22}>
            Partners · Cumplimiento · Continuidad
          </SectionBadge>

          <h2 id="alliances-title" className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">
            Ecosistema de respaldo para operar con confianza
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            SCAR no compite solo por mover carga: compite por dar <b>certeza operacional</b>. Estas alianzas suman
            seguridad, cumplimiento, capacidad y continuidad para responder mejor en escenarios exigentes.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {trustSignals.map((signal) => (
              <span
                key={signal}
                className="inline-flex items-center gap-2 rounded-full border border-[#0094d9]/20 bg-[#0094d9]/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#003f8c]"
              >
                <CheckBadgeIcon className="h-4 w-4 text-[#0094d9]" aria-hidden="true" />
                {signal}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          role="list"
          aria-label="Alianzas estratégicas"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              role="listitem"
              aria-label={item.title}
              className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[#0094d9]/35 hover:shadow-[0_24px_60px_rgba(0,63,140,0.13)]"
              itemScope
              itemType="https://schema.org/Organization"
              itemProp="itemListElement"
            >
              <meta itemProp="name" content={item.title} />
              <meta itemProp="description" content={item.description} />

              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0094d9] via-[#3730a3] to-[#003f8c]" />

              <div className="flex h-36 items-center justify-center border-b border-slate-100 bg-gradient-to-br from-white via-slate-50 to-[#eef7ff] px-6">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="max-h-20 max-w-[78%] object-contain transition duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0094d9]">
                    {item.eyebrow}
                  </span>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#0094d9]/20 bg-[#0094d9]/10 text-[#0094d9]">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-extrabold leading-tight text-slate-950">
                  {item.shortTitle}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>

                <ul className="mt-5 space-y-2 text-sm text-slate-700">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3730a3]" aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Partner estratégico
                    </span>
                    <span className="text-sm font-extrabold text-[#003f8c]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 rounded-xl border border-[#003f8c]/10 bg-gradient-to-r from-[#0c1e3a] via-[#12356a] to-[#003f8c] px-6 py-5 text-center shadow-[0_18px_45px_rgba(0,63,140,0.16)]">
          <p className="text-sm font-semibold leading-relaxed text-white sm:text-base">
            El resultado: menos improvisación, más respaldo documental y una red preparada para sostener continuidad
            cuando la operación exige velocidad, seguridad y control.
          </p>
        </div>
      </div>
    </section>
  )
}
