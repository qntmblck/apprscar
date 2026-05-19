import { Link } from '@inertiajs/react'
import {
  ArrowPathIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  ClockIcon,
  CubeIcon,
  MapPinIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline'
import SectionBadge from './SectionBadge'

const ventajas = [
  {
    icon: ScaleIcon,
    title: 'Pagas por la capacidad que usas',
    desc: 'Ideal para volúmenes parciales: compartes capacidad con cargas compatibles sin sobredimensionar el flete.',
  },
  {
    icon: ClockIcon,
    title: 'Rutas y ventanas planificadas',
    desc: 'Coordinamos salidas según ruta, demanda y prioridad para evitar esperas innecesarias por falta de volumen.',
  },
  {
    icon: MapPinIcon,
    title: 'Cobertura nacional coordinada',
    desc: 'Diseñamos el esquema según origen, destino, puntos de entrega y compatibilidad operacional en las 16 regiones.',
  },
  {
    icon: CheckBadgeIcon,
    title: 'Documentación y seguimiento',
    desc: 'Ordenamos antecedentes, coordinación, hitos y confirmación de entrega para que la decisión no dependa de supuestos.',
  },
  {
    icon: ArrowPathIcon,
    title: 'Escala sin perder control',
    desc: 'Sirve para una paleta, varios bultos o demanda variable, manteniendo reglas claras de costo, plazo y capacidad.',
  },
  {
    icon: CubeIcon,
    title: 'Estiba, seguridad y control',
    desc: 'Revisamos compatibilidad, embalaje, manipulación y respaldo para proteger la carga durante el trayecto.',
  },
]

const suitability = [
  'Cargas parciales o palletizadas',
  'Rutas con ventana flexible',
  'Empresas con demanda variable',
]

export default function ConsolidadoCargas() {
  return (
    <section id="consolidado" className="bg-white py-16 sm:py-20" aria-labelledby="consolidado-title">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <SectionBadge color="#003f8c" backgroundOpacity={0.07} borderOpacity={0.18} className="mb-5">
              Carga consolidada · Capacidad compartida · Rutas programadas
            </SectionBadge>

            <h2 id="consolidado-title" className="text-3xl font-semibold tracking-tight text-balance text-slate-950 sm:text-4xl">
              Carga consolidada para empresas que no necesitan llenar un camión
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Agrupamos volúmenes compatibles en rutas planificadas para bajar costo, mantener trazabilidad y evitar que tu
              carga quede esperando por falta de volumen.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-950">Conviene cuando necesitas:</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {suitability.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckBadgeIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#0094d9]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                href="/contacto#clientes"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0094d9] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#00a0f0]"
              >
                Cotizar transporte
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contacto#colaboradores"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#003f8c]/15 bg-white px-5 py-3 text-sm font-semibold text-[#003f8c] transition hover:bg-[#eef7ff]"
              >
                Únete como Colaborador
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {ventajas.map((ventaja) => (
              <article
                key={ventaja.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#0094d9]/35 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0094d9]/10 text-[#0094d9] ring-1 ring-[#0094d9]/20">
                  <ventaja.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-950">{ventaja.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{ventaja.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
