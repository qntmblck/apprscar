import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import SectionBadge from './SectionBadge'

const features = [
  {
    name: 'Cotiza con claridad desde el inicio',
    description:
      'Nos cuentas origen, destino, volumen y urgencia; te orientamos hacia la alternativa que conviene para tu carga.',
    icon: UserGroupIcon,
    keywords: 'cotización, carga consolidada, flete dedicado, requerimientos, distribución',
  },
  {
    name: 'Carga protegida y respaldada',
    description:
      'Operamos con criterios preventivos, documentación y equipos preparados para reducir riesgos durante el trayecto.',
    icon: ShieldCheckIcon,
    keywords: 'seguridad, protocolos, contingencias, documentación, cumplimiento',
  },
  {
    name: 'Seguimiento sin incertidumbre',
    description:
      'Te entregamos puntos de avance y responsables claros para saber qué está pasando con tu carga cuando importa.',
    icon: ChartBarIcon,
    keywords: 'coordinación, trazabilidad, control operacional, información, KPI',
  },
  {
    name: 'Menos vueltas para decidir',
    description:
      'Comparamos costo, plazo, capacidad y nivel de control para que elijas con seguridad, sin sobredimensionar el servicio.',
    icon: ClockIcon,
    keywords: 'tiempo de respuesta, eficiencia, decisión logística, costos, planificación',
  },
]

const processSteps = [
  'Cuéntanos qué necesitas mover',
  'Recibe una alternativa clara',
  'Confirma ruta y condiciones',
  'Haz seguimiento del avance',
]

export default function Features() {
  return (
    <section
      id="servicios"
      className="relative overflow-hidden bg-[#071121] py-10 sm:py-12"
      aria-labelledby="features-title"
      itemScope
      itemType="https://schema.org/Service"
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,148,217,0.12) 1px, transparent 0)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-7">
            <SectionBadge className="mb-5">
              Claridad · Respaldo · Continuidad
            </SectionBadge>

            <div className="flex flex-col gap-7 sm:flex-row sm:items-center lg:flex-col lg:items-start">
              <img
                src="/img/logoscar.webp"
                alt="Logo Transportes SCAR"
                className="aspect-square w-36 shrink-0 rounded-full object-cover drop-shadow-[0_18px_45px_rgba(0,148,217,0.24)] sm:w-40 lg:w-44"
                loading="lazy"
                decoding="async"
              />

              <div>
                <h2 id="features-title" className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                  Un servicio pensado para que cotices con confianza
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                  Antes de mover tu carga aclaramos origen, destino, ventanas, volumen y restricciones. Así sabes qué
                  se hará, cuándo ocurre y bajo qué condiciones se confirma cada avance.
                </p>
              </div>
            </div>

            <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1" aria-label="Cómo trabajamos tu solicitud">
              {processSteps.map((step, index) => (
                <li key={step} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0094d9]/15 text-xs font-semibold text-[#38bdf8] ring-1 ring-[#0094d9]/25">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-200">{step}</span>
                </li>
              ))}
            </ol>

            <meta itemProp="provider" content="Transportes SCAR" />
            <meta itemProp="areaServed" content="Chile" />
            <meta itemProp="serviceType" content="Transporte de carga consolidada y distribución con control operativo" />
          </div>

          <div className="grid h-full gap-4 sm:grid-cols-2 lg:auto-rows-fr">
            {features.map((feature) => (
              <article
                key={feature.name}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-[#0094d9]/40 hover:bg-white/[0.055]"
                itemScope
                itemType="https://schema.org/PropertyValue"
                itemProp="hasOfferCatalog"
              >
                <feature.icon className="h-6 w-6 text-[#38bdf8]" aria-hidden="true" />
                <h3 className="mt-5 text-base font-semibold text-white" itemProp="name">
                  {feature.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400" itemProp="value">
                  {feature.description}
                </p>
                <p className="sr-only">{feature.keywords}</p>
              </article>
            ))}
            <article className="flex h-full flex-col justify-center rounded-2xl border border-[#0094d9]/25 bg-[#0094d9]/10 p-6 sm:col-span-2">
              <p className="flex flex-col gap-3 text-sm leading-6 text-slate-200 sm:flex-row sm:items-center">
                <CheckCircleIcon className="h-5 w-5 shrink-0 text-[#38bdf8]" aria-hidden="true" />
                <span>
                  Te proponemos un servicio entendible desde el primer contacto: costo, plazo, capacidad y nivel de
                  control claros antes de mover la carga.
                </span>
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
