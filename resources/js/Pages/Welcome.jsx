import { Head } from '@inertiajs/react'

import Header from '@/Components/Header'
import Hero from '@/Components/Hero'
import Clients from '@/Components/Clients'
import Features from '@/Components/Features'
import Statistics from '@/Components/Statistics'
import Alliances from '@/Components/Alliances'
import CallToAction from '@/Components/CallToAction'
import Footer from '@/Components/Footer'

export default function Welcome() {
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
<svg className="w-full -mt-1" viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lightToWhite" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="#f6f9ff" />
      <stop offset="100%" stopColor="#eceaff" />
    </linearGradient>
  </defs>
  <path fill="#0c1e3a" d="M1440,0 C960,100 480,0 0,100 L0,0 L1440,0 Z" />
</svg>

          <Alliances />

        {/* Separador difuminado: Alliances → CTA */}
<div className="w-full h-6 -mt-[2px] bg-gradient-to-b from-white to-[#0c1e3a]" />



          <CallToAction />
        </main>

        <Footer />
      </div>
    </>
  )
}
