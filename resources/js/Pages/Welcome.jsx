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

      <div className="bg-white">
        <Header />
        <main>
          <Hero />

          {/* Separador: Hero → Clients */}
          <svg className="w-full -mb-1" viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg">
            <path fill="#0c1e3a" d="M0,0 C480,60 960,0 1440,60 L1440,0 L0,0 Z" />
          </svg>

          <Clients />

          <Features />

          {/* Transición suave entre Features y Statistics */}
          <div className="-mt-px h-6 w-full bg-gradient-to-b from-[#0c1e3a] to-[#f6f9ff]" />

          <Statistics />

          <svg className="w-full -mt-1" viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg">
  <path fill="#0c1e3a" d="M1440,0 C960,60 480,0 0,60 L0,0 L1440,0 Z" />
  <rect x="0" y="0" width="1440" height="60" fill="#f6f9ff" mask="url(#curve)" />
  <defs>
    <mask id="curve">
      <rect x="0" y="0" width="1440" height="60" fill="white" />
      <path d="M1440,0 C960,60 480,0 0,60 L0,0 L1440,0 Z" fill="black" />
    </mask>
  </defs>
</svg>




          {/* Nueva sección destacada de Compromiso y Alianzas */}

          <div className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-6">

            <div className="mt-4">
              <Alliances />
            </div>
          </div>

          <svg
  className="w-full -mt-px block leading-none"
  viewBox="0 0 1440 60"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none"
>
  <defs>
    <mask id="bottom-curve">
      <rect x="0" y="0" width="1440" height="60" fill="white" />
      <path d="M0,60 C480,0 960,60 1440,0 L1440,60 L0,60 Z" fill="black" />
    </mask>
  </defs>
  <rect x="0" y="0" width="1440" height="60" fill="#f6f9ff" mask="url(#bottom-curve)" />
  <path d="M0,60 C480,0 960,60 1440,0 L1440,60 L0,60 Z" fill="#0c1e3a" />
</svg>


          <CallToAction />
        </main>

        {/* Separador: CTA → Footer */}
<svg className="w-full -mt-1" viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg">
  <path fill="#0c1e3a" d="M0,0 C480,60 960,0 1440,60 L1440,0 L0,0 Z" />
</svg>


        <Footer />
      </div>
    </>
  )
}

