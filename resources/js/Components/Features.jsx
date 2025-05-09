import {
    ShieldCheckIcon,
    ClockIcon,
    UserGroupIcon,
    ChartBarIcon,
  } from '@heroicons/react/24/outline';
  import { motion, useAnimation } from 'framer-motion';
  import { useInView } from 'react-intersection-observer';
  import { useEffect } from 'react';

  const features = [
    {
      name: 'Conocimiento Profundo del Cliente',
      description:
        'Comprendemos las expectativas y necesidades específicas de cada cliente, permitiéndonos ofrecer soluciones personalizadas que agregan verdadero valor.',
      icon: UserGroupIcon,
    },
    {
      name: 'Resolución Eficiente de Problemas',
      description:
        'Implementamos procesos claros y capacitamos a nuestro personal para manejar situaciones difíciles, asegurando soluciones rápidas y efectivas.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Empatía y Comunicación Clara',
      description:
        'Establecemos conexiones emocionales mediante una comunicación transparente y empática, fortaleciendo la relación y fomentando la lealtad.',
      icon: ChartBarIcon,
    },
    {
      name: 'Reducción de Tiempos de Espera',
      description:
        'Minimizamos los tiempos de espera mediante la automatización de procesos y la optimización de recursos, mejorando significativamente la experiencia del cliente.',
      icon: ClockIcon,
    },
  ];

  export default function Features() {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    useEffect(() => {
      if (inView) {
        controls.start({ opacity: 1, x: 0 });
      }
    }, [inView, controls]);

    return (
      <section
        id="servicios"
        className="bg-gradient-to-br from-[#0c1e3a] via-[#0c1e3aa0] to-[#0c1e3a] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Encabezado animado de izquierda a derecha */}
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
                Nuestro Compromiso con la Excelencia
              </h2>
              <p className="mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-gray-300">
                En Transportes SCAR, nos enfocamos en comprender profundamente a nuestros clientes, resolver eficientemente sus problemas, comunicarnos con empatía y reducir los tiempos de espera para ofrecer un servicio excepcional.
              </p>
            </div>
          </motion.div>

          {/* Grilla de características (opcional: animable también) */}
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
    );
  }
