import { Head } from '@inertiajs/react'
import Header from '@/Components/Header'
import Hero from '@/Components/Hero'
import Clients from '@/Components/Clients'
import Features from '@/Components/Features'
import Statistics from '@/Components/Statistics'
import Alliances from '@/Components/Alliances'
import CallToAction from '@/Components/CallToAction'
import Footer from '@/Components/Footer'
import WhatsAppChat from '@/Components/WhatsAppChat'
import CallButton from '@/Components/CallButton'
import { useEffect } from 'react'

export default function Welcome() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const hash = window.location.hash
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      }
    }
  }, [])

    return (
    <>
      <Head title="Transportes SCAR | Tu carga, nuestra misión" />

      <div className="bg-white overflow-x-hidden leading-none">
        <Header />

        <main className="overflow-hidden leading-none antialiased bg-white">
          <Hero />

          {/* Separador curvo (Hero → Clients) */}
          <div className="bg-white -mt-[1px]">
            <svg
              className="w-full block leading-none"
              preserveAspectRatio="none"
              viewBox="0 0 1440 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="#0c1e3a" d="M0,0 C480,60 960,0 1440,60 L1440,0 L0,0 Z" />
            </svg>
          </div>

          <Clients />
          <Features />

          {/* Transición: Features → Statistics */}
          <div className="-mt-[1px] h-6 w-full bg-gradient-to-b from-[#0c1e3a] to-[#f6f9ff]" />

          <Statistics />

          {/* Separador estilizado: Statistics → Alliances */}
          <div className="bg-white -mt-[1px]">
            <svg
              className="w-full block leading-none"
              preserveAspectRatio="none"
              viewBox="0 0 1440 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="#0c1e3a" d="M1440,0 C960,100 480,0 0,100 L0,0 L1440,0 Z" />
            </svg>
          </div>

          <Alliances />

          {/* Separador difuminado: Alliances → CTA */}
          <div className="w-full h-6 -mt-[2px] bg-gradient-to-b from-white to-[#0c1e3a]" />

          <CallToAction />
        </main>

      <WhatsAppChat />
      <CallButton />
        <Footer />
      </div>
    </>
  )
}
