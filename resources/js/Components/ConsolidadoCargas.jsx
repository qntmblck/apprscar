import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from '@inertiajs/react'
import SectionBadge from './SectionBadge'
import {
  CubeIcon,
  ArrowPathIcon,
  ScaleIcon,
  ClockIcon,
  MapPinIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline'

const ventajas = [
  {
    icon: ScaleIcon,
    title: 'Reduce tu costo logístico',
    desc: 'Comparte el camión con otras empresas. Solo pagas por el espacio y peso que realmente usas.',
  },
  {
    icon: ClockIcon,
    title: 'Salidas programadas',
    desc: 'Frecuencias fijas a los principales destinos del país. Tu carga sale aunque no llene un camión completo.',
  },
  {
    icon: MapPinIcon,
    title: 'Cobertura nacional',
    desc: 'Rutas consolidadas a las 16 regiones de Chile, con puntos de entrega acordados y trazabilidad de la carga.',
  },
  {
    icon: CheckBadgeIcon,
    title: 'Gestión operacional completa',
    desc: 'Nos encargamos del armado de carga, documentación, coordinación y seguimiento hasta entrega confirmada.',
  },
  {
    icon: ArrowPathIcon,
    title: 'Flexibilidad de volúmenes',
    desc: 'Desde una paleta hasta varias toneladas. Ideal para empresas con demanda variable o rutas de menor volumen.',
  },
  {
    icon: CubeIcon,
    title: 'Carga segura y asegurada',
    desc: 'Protocolo de embalaje, estiba controlada y cobertura de seguro para todo tipo de mercancía.',
  },
]

export default function ConsolidadoCargas() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section
      id="consolidado"
      ref={ref}
      className="relative py-16 sm:py-20 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #060d1b 0%, #0c1e3a 50%, #0a1628 100%)' }}
      aria-labelledby="consolidado-title"
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#0094d9 1px, transparent 1px), linear-gradient(90deg, #0094d9 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-[#0094d9]/5 blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <SectionBadge className="mb-4">
            Nuevo servicio
          </SectionBadge>
          <h2
            id="consolidado-title"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Consolidado de cargas
          </h2>
          <p className="mt-4 text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transporta tu mercancía de forma eficiente compartiendo capacidad con otras empresas.
            La solución inteligente para volúmenes parciales con cobertura y control total.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ventajas.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#0094d9]/30"
            >
              <div className="mb-4 w-10 h-10 rounded-xl bg-[#0094d9]/10 border border-[#0094d9]/20 flex items-center justify-center group-hover:bg-[#0094d9]/20 transition-colors">
                <v.icon className="w-5 h-5 text-[#0094d9]" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{v.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/contacto#colaboradores"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-sm
                       bg-gradient-to-r from-[#0094d9] to-[#003f8c] hover:from-[#00a0f0] hover:to-[#004ba8]
                       transition-all shadow-lg shadow-[#0094d9]/20 hover:shadow-[#0094d9]/30"
          >
            Únete como Colaborador
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
