import React, { useEffect, useState } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Hero() {
  const [attachment, setAttachment] = useState('scroll')
  const controls = useAnimation()
  const reduceMotion = useReducedMotion()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const updateAttachment = () => setAttachment(window.innerWidth >= 1024 ? 'fixed' : 'scroll')
    updateAttachment()
    window.addEventListener('resize', updateAttachment)
    return () => window.removeEventListener('resize', updateAttachment)
  }, [])

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
      className="relative flex items-center justify-center text-white py-20 sm:py-32 min-h-[65vh] sm:min-h-[80vh] bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/img/dashboard/truck.jpg')",
        backgroundAttachment: attachment,
      }}
      aria-labelledby="hero-title"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 sm:bg-opacity-60" />

      {/* SEO estructurado ligero */}
      <meta itemProp="name" content="Transportes SCAR" />
      <meta itemProp="areaServed" content="Chile" />
      <meta itemProp="serviceType" content="Transporte de carga por carretera" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: reduceMotion ? 0 : 100, scale: reduceMotion ? 1 : 1.12 }}
        animate={controls}
        className="relative z-10 w-full max-w-4xl px-6 lg:px-16 text-center"
      >
        {/* ✅ H1 optimizado para rankeo (marca + nicho B2B) */}
        <motion.h1
          id="hero-title"
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 60, damping: 12 }}
          className="text-3xl sm:text-5xl font-bold tracking-tight"
        >
          Transporte de carga y distribución para empresas en Chile
        </motion.h1>

        {/* ✅ Mantener tu frase EXACTA, ahora como subtítulo/slogan */}
        <motion.p
          whileHover={reduceMotion ? undefined : { scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 60, damping: 12 }}
          className="mt-6 text-base sm:text-lg leading-relaxed text-gray-200"
          itemProp="description"
        >
          Tu carga, nuestra misión. Más de 25 años de experiencia en transporte de carga por carretera en Chile, con
          cobertura de Arica a Punta Arenas.
        </motion.p>

        {/* Señal SEO discreta (no redundante) */}
        <p className="mt-3 text-xs font-semibold tracking-widest uppercase text-indigo-200">
          Transporte regional · Logística B2B · Cobertura nacional
        </p>

        {/* ✅ Solo 1 botón */}
        <div className="mt-10 flex justify-center">
          <motion.a
            whileHover={reduceMotion ? undefined : { scale: 1.07 }}
            transition={{ type: 'spring', stiffness: 80, damping: 10 }}
            href="/contacto#clientes"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition"
            aria-label="Cotizar servicio de transporte de carga"
          >
            Cotizar servicio →
          </motion.a>
        </div>

        {/* SEO extra invisible (variaciones de búsqueda) */}
        <span className="sr-only">
          Empresa de transporte de carga para empresas. Transporte por carretera, transporte regional y distribución
          nacional en Chile. Cotización de fletes B2B.
        </span>
      </motion.div>
    </section>
  )
}

