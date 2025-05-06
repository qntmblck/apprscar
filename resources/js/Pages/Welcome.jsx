import { Head } from '@inertiajs/react'

import Header from '@/Components/Header'
import Hero from '@/Components/Hero'
import Features from '@/Components/Features'
import Statistics from '@/Components/Statistics'
import Clients from '@/Components/Clients'
import CallToAction from '@/Components/CallToAction'
import Footer from '@/Components/Footer'

export default function Welcome() {
  return (
    <>
      <Head title="Transportes SCAR | Tu carga, nuestra misión" />

      <div className="bg-white">
        <Header />
        <main>
          <Hero />

          {/* Separador más bajo y suave: Hero → Features */}
          <svg className="w-full -mb-1" viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg">
            <path fill="#0c1e3a" d="M0,0 C480,60 960,0 1440,60 L1440,0 L0,0 Z" />
          </svg>

          <Features />

          {/* Separador más bajo y suave: Features → Statistics */}
          <svg className="w-full -mb-1" viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M0,0 C480,60 960,0 1440,60 L1440,0 L0,0 Z" />
          </svg>

          <Statistics />

          {/* Separador más bajo y suave: Statistics → Clients */}
          <svg className="w-full -mb-1" viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg">
            <path fill="#0c1e3a" d="M0,0 C480,60 960,0 1440,60 L1440,0 L0,0 Z" />
          </svg>

          <Clients />

          {/* Separador plano entre Clients y CallToAction */}
          <div className="h-4 bg-[#0c1e3a]" />

          <CallToAction />
        </main>

        {/* Separador final: CTA → Footer */}
        <svg className="w-full -mt-1" viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg">
          <path fill="#111827" d="M0,0 C480,60 960,0 1440,60 L1440,0 L0,0 Z" />
        </svg>

        <Footer />
      </div>
    </>
  )
}
