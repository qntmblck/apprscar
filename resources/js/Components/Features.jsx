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
          {/* Título y logo adaptables */}
          <motion.div
            className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 sm:gap-10 max-w-7xl mx-auto mb-12 text-center sm:text-right"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo SCAR */}
            <div className="flex-shrink-0">
              <img
                src="/img/logoscar.png"
                alt="Logo SCAR"
                className="h-24 sm:h-40 w-auto mx-auto sm:mx-0"
              />
            </div>

            {/* Texto */}
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
                Nuestro compromiso con la excelencia
              </h2>
              <p className="mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-gray-300">
                En Transportes SCAR, combinamos experiencia, tecnología y profesionalismo para ofrecer un servicio integral y confiable en toda la cadena logística.
              </p>
            </div>
          </motion.div>

          {/* Grilla de características */}
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
