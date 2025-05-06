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
          <Features />
          <Statistics />
          <Clients />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </>
  )
}
