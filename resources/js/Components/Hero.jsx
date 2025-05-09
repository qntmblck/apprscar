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
          stiffness: 80,
          damping: 16,
        },
      })
    }
  }, [inView, controls])

  return (
    <section
      id="inicio"
      className="relative flex items-center text-white py-32 min-h-[80vh] bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/img/dashboard/truck.jpg')",
        backgroundAttachment: attachment,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      <motion.div
  ref={ref}
  initial={{ opacity: 0, x: 400, scale: 2.5 }}
  animate={controls}
  className="relative z-10 max-w-4xl px-6 lg:px-16 text-left"
>
  <motion.h1
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 80, damping: 10 }}
    className="text-4xl font-bold tracking-tight sm:text-6xl origin-center"
  >
    Tu carga, nuestra misión
  </motion.h1>

  <motion.p
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 80, damping: 10 }}
    className="mt-6 text-lg leading-8 text-gray-200 origin-center"
  >
    Más de 25 años de experiencia en transporte de carga por carretera en Chile, con cobertura de Arica a Punta Arenas.
  </motion.p>

  <div className="mt-10">
    <motion.a
      whileHover={{ scale: 1.35 }}
      transition={{ type: 'spring', stiffness: 100, damping: 8 }}
      href="/contacto#clientes"
      className="inline-block rounded-md border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-600 hover:border-indigo-600 transition origin-center"
    >
      Cotiza tu Servicio →
    </motion.a>
  </div>
</motion.div>

    </section>
  )
}
