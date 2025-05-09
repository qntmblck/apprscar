import {
    ShieldCheckIcon,
    ClockIcon,
    UserGroupIcon,
    ChartBarIcon,
  } from '@heroicons/react/24/outline'
  import { motion, useAnimation } from 'framer-motion'
  import { useInView } from 'react-intersection-observer'
  import { useEffect } from 'react'

  const features = [
    {
      name: 'Análisis de Requerimientos del Cliente',
      description:
        'Recolectamos y procesamos información específica sobre cada cliente para identificar parámetros operativos clave, permitiendo configuraciones de servicio basadas en datos.',
      icon: UserGroupIcon,
    },
    {
      name: 'Protocolos de Resolución Operativa',
      description:
        'Aplicamos modelos de resolución estructurada con personal capacitado en procedimientos estandarizados, optimizando los tiempos de respuesta ante contingencias.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Optimización de la Comunicación Funcional',
      description:
        'Mantenemos flujos de comunicación definidos, orientados a la claridad operativa, reducción de ambigüedades y minimización de errores por malentendidos.',
      icon: ChartBarIcon,
    },
    {
      name: 'Minimización de Latencia de Atención',
      description:
        'Implementamos automatización de flujos y estrategias de asignación de recursos que reducen la latencia del servicio, disminuyendo significativamente los tiempos de espera promedio.',
      icon: ClockIcon,
    },
  ]

  export default function Features() {
    const controls = useAnimation()
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

    useEffect(() => {
      if (inView) {
        controls.start({ opacity: 1, x: 0 })
      }
    }, [inView, controls])

    return (
      <section
        id="servicios"
        className="bg-gradient-to-br from-[#0c1e3a] via-[#0c1e3aa0] to-[#0c1e3a] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Encabezado animado */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -60 }}
            animate={controls}
            transition={{ duration: 0.8 }}
            className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 sm:gap-10 mb-16 text-center sm:text-right"
          >
            <div className="flex-shrink-0">
              <img
                src="/img/logoscar.png"
                alt="Logo SCAR"
                className="h-24 sm:h-40 w-auto mx-auto sm:mx-0"
              />
            </div>

            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
                Métricas de Desempeño y Eficiencia Operativa
              </h2>
              <p className="mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-gray-300">
                Transportes SCAR aplica principios de análisis sistemático, mejora continua y control de procesos para optimizar cada fase del servicio logístico.
              </p>
            </div>
          </motion.div>

          {/* Grilla de características */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
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
          </div>
        </div>
      </section>
    )
  }
