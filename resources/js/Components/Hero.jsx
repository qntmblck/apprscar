import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Hero() {
  const [attachment, setAttachment] = useState('scroll')
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateAttachment = () => {
        setAttachment(window.innerWidth >= 1024 ? 'fixed' : 'scroll')
      }

      updateAttachment()
      window.addEventListener('resize', updateAttachment)
      return () => window.removeEventListener('resize', updateAttachment)
    }
  }, [])

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 60,
          damping: 14,
        },
      })
    }
  }, [inView, controls])

  return (
    <section
      id="inicio"
      className="relative flex items-center text-white py-64 sm:py-32 min-h-[25vh] sm:min-h-[80vh] bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/img/dashboard/truck.jpg')",
        backgroundAttachment: attachment,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 sm:bg-opacity-60" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: 100, scale: 1.2 }}
        animate={controls}
        className="relative z-10 w-full max-w-4xl px-6 lg:px-16 text-left"
      >
        <motion.h1
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 60, damping: 12 }}
          className="text-3xl sm:text-5xl font-bold tracking-tight"
        >
          Tu carga, nuestra misión
        </motion.h1>

        <motion.p
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 60, damping: 12 }}
          className="mt-6 text-base sm:text-lg leading-relaxed text-gray-200"
        >
          Más de 25 años de experiencia en transporte de carga por carretera en Chile, con cobertura de Arica a Punta Arenas.
        </motion.p>

        <div className="mt-10">
          <motion.a
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 80, damping: 10 }}
            href="/contacto#clientes"
            className="inline-block rounded-md border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-600 hover:border-indigo-600 transition"
          >
            Cotiza tu Servicio →
          </motion.a>
        </div>
      </motion.div>
    </section>
  )
}

