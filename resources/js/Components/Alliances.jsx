import {
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import SectionBadge from './SectionBadge'

const items = [
  {
    eyebrow: 'Más tranquilidad',
    title: 'ACHS Virtual & Gestión',
    shortTitle: 'Cuidamos personas y carga',
    description:
      'Criterios de seguridad que ayudan a reducir atrasos evitables y a cuidar mejor cada retiro, traslado y entrega.',
    image: '/img/achs.webp',
    alt: 'ACHS Virtual y Gestión - seguridad, salud ocupacional y capacitación',
    icon: ShieldCheckIcon,
    bullets: ['Menos riesgo en ruta', 'Equipos preparados', 'Continuidad del servicio'],
  },
  {
    eyebrow: 'Orden documental',
    title: 'Subcontrataley',
    shortTitle: 'Respaldo para decidir',
    description:
      'Mayor orden para cotizar, aprobar y coordinar servicios con respaldo claro, especialmente en operaciones B2B.',
    image: '/img/subcontrataley.webp',
    alt: 'Subcontrataley - cumplimiento laboral y trazabilidad documental',
    icon: ClipboardDocumentCheckIcon,
    bullets: ['Papeles al día', 'Menos gestión para tu equipo', 'Decisiones con evidencia'],
  },
  {
    eyebrow: 'Más capacidad',
    title: 'Maquinaria para Construcción',
    shortTitle: 'Respuesta cuando aumenta la demanda',
    description:
      'Apoyo operativo para no depender de una sola alternativa cuando la carga, la ruta o el proyecto crecen.',
    image: '/img/santaema.webp',
    alt: 'Maquinaria para construcción - apoyo operativo y disponibilidad de equipos',
    icon: TruckIcon,
    bullets: ['Capacidad adicional', 'Alternativas ante urgencias', 'Mayor continuidad'],
  },
  {
    eyebrow: 'Cobertura flexible',
    title: 'Red de operadores asociados',
    shortTitle: 'Más opciones por zona',
    description:
      'Una red complementaria permite reaccionar mejor ante cambios de ruta, ventanas de entrega o demanda variable.',
    image: '/img/al.webp',
    alt: 'Red de operadores asociados - continuidad operativa y soporte local',
    icon: CheckBadgeIcon,
    bullets: ['Soporte local', 'Mejor reacción territorial', 'Servicio más estable'],
  },
]

const trustSignals = [
  'Más tranquilidad al cotizar',
  'Menos incertidumbre en ruta',
  'Respaldo antes de mover',
]

export default function Alliances() {
  return (
    <section
      id="alliances"
      className="bg-white pt-14 pb-6 sm:pt-16 sm:pb-8"
      aria-labelledby="alliances-title"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          <div>
            <SectionBadge color="#003f8c" backgroundOpacity={0.07} borderOpacity={0.18} className="mb-5">
              Seguridad · Documentación · Cobertura
            </SectionBadge>
            <h2 id="alliances-title" className="text-3xl font-semibold tracking-tight text-balance text-slate-950 sm:text-4xl">
              Respaldo que te da tranquilidad antes de mover la carga
            </h2>
          </div>

          <div className="flex h-full flex-col justify-center rounded-2xl border border-[#003f8c]/10 bg-[#f6fbff] p-5">
            <p className="text-base leading-7 text-slate-600">
              Para tu empresa, una operación confiable significa menos sorpresas: seguridad, documentación, capacidad
              adicional y continuidad cuando la ruta cambia.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {trustSignals.map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center gap-2 rounded-full border border-[#0094d9]/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#003f8c]"
                >
                  <CheckBadgeIcon className="h-4 w-4 text-[#0094d9]" aria-hidden="true" />
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </div>

        <ul role="list" className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li
              key={item.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-[#0094d9]/35 hover:shadow-md"
              itemScope
              itemType="https://schema.org/Organization"
              itemProp="itemListElement"
            >
              <meta itemProp="name" content={item.title} />
              <meta itemProp="description" content={item.description} />

              <div className="flex h-28 items-center justify-center border-b border-slate-100 bg-slate-50 px-6">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="max-h-16 max-w-[78%] object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0094d9]">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-slate-950">{item.shortTitle}</h3>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0094d9]/10 text-[#0094d9] ring-1 ring-[#0094d9]/20">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">{item.description}</p>

                <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
                  {item.bullets.map((bullet) => (
                    <div key={bullet} className="flex justify-between gap-4">
                      <dt className="text-slate-400">Para ti</dt>
                      <dd className="text-right font-medium text-slate-700">{bullet}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-2xl border border-[#003f8c]/10 bg-[#f6fbff] px-6 py-5">
          <p className="text-center text-sm font-medium leading-6 text-[#0c1e3a] sm:text-base">
            La diferencia para el cliente es simple: más claridad antes de contratar, más respaldo durante el servicio
            y menos riesgo de improvisar cuando la operación exige respuesta.
          </p>
        </div>
      </div>
    </section>
  )
}
