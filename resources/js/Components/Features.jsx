import {
    ShieldCheckIcon,
    TruckIcon,
    MapIcon,
    ChartBarIcon,
  } from '@heroicons/react/24/outline'
  import { motion } from 'framer-motion'

  const features = [
    {
      name: 'Cobertura Nacional',
      description: 'Desde Arica a Punta Arenas, conectamos cada rincón del país con eficiencia y compromiso.',
      icon: MapIcon,
    },
    {
      name: 'Seguridad en cada envío',
      description: 'Aplicamos rigurosos protocolos y capacitaciones para proteger cada carga.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Gestión Tecnológica',
      description: 'Sistemas digitales para monitoreo, control y trazabilidad de viajes.',
      icon: ChartBarIcon,
    },
    {
      name: 'Relación con Clientes',
      description: 'Comprometidos con la transparencia, confianza y mejora continua junto a nuestros aliados.',
      icon: TruckIcon,
    },
  ]

  export default function Features() {
    return (
      <section
        id="servicios"
        className="bg-gradient-to-br from-[#0c1e3a] via-[#0c1e3aa0] to-[#0c1e3a] py-12 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Título animado alineado a la derecha */}
          <motion.div
  className="flex items-center justify-between max-w-7xl mx-auto mb-10"
  initial={{ opacity: 0, x: -60 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
  {/* Logo grande alineado a la izquierda */}
  <div className="flex-shrink-0">
    <img src="/img/logoscar.png" alt="Logo SCAR" className="h-28 w-auto" />
  </div>

  {/* Título alineado a la derecha */}
  <div className="max-w-2xl text-right">
    <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
      Nuestro compromiso con la excelencia
    </h2>
    <p className="mt-4 text-lg leading-8 text-gray-300">
      En Transportes SCAR, combinamos experiencia, tecnología y profesionalismo para ofrecer un servicio integral y confiable en toda la cadena logística.
    </p>
  </div>
</motion.div>


          {/* Grid de características */}
          <div className="mx-auto mt-10 max-w-2xl lg:max-w-none">
            <dl className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col items-start text-left">
                  <dt className="text-base font-semibold text-white">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-1 text-base text-gray-300">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    )
  }
