import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  MapIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import SectionBadge from './SectionBadge'

const decisionOptions = [
  {
    name: 'Carga consolidada',
    description: 'Volumen parcial, rutas compatibles y mejor uso de capacidad.',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    name: 'Flete dedicado',
    description: 'Prioridad, control exclusivo y ventanas operativas estrictas.',
    icon: TruckIcon,
  },
  {
    name: 'Distribución B2B',
    description: 'Entregas programadas, coordinación y trazabilidad por hitos.',
    icon: MapIcon,
  },
]

const proofPoints = [
  '25+ años reduciendo riesgo operativo',
  'Empresas que ya confiaron en SCAR',
  'Cotización clara sin vueltas innecesarias',
]

const stats = [
  { value: '16', label: 'regiones' },
  { value: '98,7%', label: 'cumplimiento' },
  { value: '127', label: 'empresas' },
]

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden bg-[#060d1b] text-white"
      aria-labelledby="hero-title"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <img
        src="/img/dashboard/truck.webp"
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_58%] opacity-[0.62]"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,13,27,0.78)_0%,rgba(12,30,58,0.64)_48%,rgba(6,13,27,0.44)_100%)]" />
      <div
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,148,217,0.28) 1px, transparent 0)',
          backgroundSize: '34px 34px',
        }}
      />

      <meta itemProp="name" content="Transportes SCAR" />
      <meta itemProp="areaServed" content="Chile" />
      <meta itemProp="serviceType" content="Transporte de carga consolidada, fletes dedicados y distribución B2B" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pt-28 pb-16 sm:pt-32 sm:pb-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pt-36 lg:pb-24">
        <div className="max-w-3xl">
          <SectionBadge
            color="#e0f7ff"
            dotColor="#38bdf8"
            backgroundOpacity={0.16}
            borderOpacity={0.35}
            className="mb-5 backdrop-blur-md"
          >
            Carga consolidada · Distribución B2B · Cobertura nacional
          </SectionBadge>

          <h1
            id="hero-title"
            className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl"
          >
            Transporte de carga y distribución para empresas en Chile
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8" itemProp="description">
            Diseñamos rutas, ventanas y capacidad para que tu carga avance con menos incertidumbre: cargas consolidadas,
            fletes dedicados y distribución nacional con seguimiento operativo.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/contacto#clientes"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0094d9] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0094d9]/20 transition hover:bg-[#00a0f0]"
              aria-label="Cotizar transporte de carga consolidada o flete dedicado"
            >
              Cotizar transporte
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#consolidado"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ver carga consolidada
            </a>
          </div>

          <ul className="mt-8 grid max-w-2xl gap-3 text-sm text-slate-300 sm:grid-cols-3" aria-label="Señales de confianza">
            {proofPoints.map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#38bdf8]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <span className="sr-only">
            Empresa de transporte de carga para empresas. Carga consolidada, fletes dedicados, transporte por carretera,
            transporte regional, distribución nacional y cotización de fletes B2B en Chile.
          </span>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-[#081527]/85 p-5 shadow-2xl shadow-black/25 backdrop-blur-md sm:p-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#38bdf8]">Decisión simple</p>
              <h2 className="mt-2 text-xl font-semibold text-white">El esquema correcto según tu carga</h2>
            </div>
            <img src="/img/logoscar.webp" alt="Transportes SCAR" className="h-16 w-16 shrink-0 rounded-full object-cover" />
          </div>

          <div className="mt-5 space-y-3">
            {decisionOptions.map((option) => (
              <div
                key={option.name}
                className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-[#0094d9]/45 hover:bg-[#0094d9]/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0094d9]/10 text-[#38bdf8] ring-1 ring-[#0094d9]/25">
                  <option.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white">{option.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{option.description}</p>
                </div>
              </div>
            ))}
          </div>

          <dl className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-black/15">
            {stats.map((stat) => (
              <div key={stat.label} className="px-3 py-4 text-center">
                <dt className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{stat.label}</dt>
                <dd className="mt-1 text-xl font-semibold text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}
