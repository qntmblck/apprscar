import React, { useEffect } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SectionBadge from './SectionBadge'

export default function Hero() {
  const controls = useAnimation()
  const reduceMotion = useReducedMotion()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (!inView) return
    controls.start({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: reduceMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 60, damping: 14 },
    })
  }, [inView, controls, reduceMotion])

  return (
    <section
      id="inicio"
      className="relative flex items-center justify-center text-white py-20 sm:py-32 min-h-[65vh] sm:min-h-[80vh] bg-center bg-cover bg-no-repeat bg-scroll lg:bg-fixed"
      style={{
        backgroundImage: "url('/img/dashboard/truck.webp')",
      }}
      aria-labelledby="hero-title"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      {/* Overlay oscuro con gradiente hacia azul navy */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060d1b]/80 via-[#0c1e3a]/70 to-[#060d1b]/80" />

      {/* Grid overlay sutil */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,148,217,0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#0094d9]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-[#003f8c]/20 blur-[100px] pointer-events-none" />

      <meta itemProp="name" content="Transportes SCAR" />
      <meta itemProp="areaServed" content="Chile" />
      <meta itemProp="serviceType" content="Transporte de carga por carretera" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: reduceMotion ? 0 : 100, scale: reduceMotion ? 1 : 1.12 }}
        animate={controls}
        className="relative z-10 w-full max-w-4xl px-6 lg:px-16 text-center"
      >
        <SectionBadge
          color="#e0f7ff"
          dotColor="#38bdf8"
          backgroundOpacity={0.18}
          borderOpacity={0.42}
          className="mb-4 shadow-[0_0_28px_rgba(0,148,217,0.35)] backdrop-blur-md"
        >
          Transporte regional · Logística B2B · Cobertura nacional
        </SectionBadge>

        <motion.h1
          id="hero-title"
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 60, damping: 12 }}
          className="text-3xl sm:text-5xl font-bold tracking-tight text-white"
        >
          Transporte de carga y distribución para empresas en Chile
        </motion.h1>

        <motion.p
          whileHover={reduceMotion ? undefined : { scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 60, damping: 12 }}
          className="mt-6 text-base sm:text-lg leading-relaxed text-slate-300"
          itemProp="description"
        >
          Tu carga, nuestra misión. Más de 25 años de experiencia en transporte de carga por carretera en Chile, con
          cobertura de Arica a Punta Arenas.
        </motion.p>

        <div className="mt-10 flex justify-center">
          <motion.a
            whileHover={reduceMotion ? undefined : { scale: 1.07 }}
            transition={{ type: 'spring', stiffness: 80, damping: 10 }}
            href="/contacto#clientes"
            className="inline-flex items-center justify-center rounded-xl bg-[#0094d9] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0094d9]/30 hover:bg-[#00a0f0] transition-all duration-300"
            aria-label="Cotizar servicio de transporte de carga"
          >
            Cotizar servicio →
          </motion.a>
        </div>

        <span className="sr-only">
          Empresa de transporte de carga para empresas. Transporte por carretera, transporte regional y distribución
          nacional en Chile. Cotización de fletes B2B.
        </span>
      </motion.div>
    </section>
  )
}
