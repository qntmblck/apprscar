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

          {/* Separador superior: Features → Statistics */}
<div className="-mt-[1px] h-6 w-full bg-gradient-to-b from-[#0c1e3a] via-[#d5e5ff] to-[#eef2ff]" />



          <Statistics />
          {/* Separador inferior: Statistics → Alliances */}
<div className="-mt-[1px] h-10 w-full bg-gradient-to-b from-[#eef2ff] via-[#f5f7fb] to-white" />


          <Alliances />

          {/* Separador curvo: de fondo blanco a CTA azul */}
<div className="bg-white">
  <svg
    className="w-full h-[60px] block leading-none"
    viewBox="0 0 1440 60"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      fill="#1e3a8a"
      d="M0,60 C480,0 960,60 1440,0 L1440,60 L0,60 Z"
    />
  </svg>
</div>

<div className="-mt-[1px] relative z-10">
  <CallToAction />
</div>
        </main>

      <WhatsAppChat />
      <CallButton />
        <Footer />
      </div>
    </>
  )
}
