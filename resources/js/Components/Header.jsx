import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Inicio', href: '/#inicio', target: 'inicio' },
  { name: 'Nosotros', href: '/#alliances', target: 'alliances' },
  { name: 'Servicios', href: '/#servicios', target: 'servicios' },
  { name: 'Contacto', href: '/contacto', target: 'contacto' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('inicio')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'servicios', 'alliances']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 80 && rect.bottom >= 80) {
            setActiveItem(id)
            return
          }
        }
      }
      if (window.location.pathname === '/contacto') setActiveItem('contacto')
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (target) => activeItem === target

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 sm:h-16 bg-gradient-to-b from-[#0c1e3a] via-[#0c1e3ad0] to-transparent shadow-md">
  {/* Fondo animado de partículas */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <svg className="absolute w-full h-full animate-pulse opacity-70 blur-[0.5px] mix-blend-screen">
      {Array.from({ length: 30 }).map((_, i) => (
        <circle
          key={i}
          cx={`${Math.random() * 100}%`}
          cy={`${Math.random() * 100}%`}
          r={Math.random() * 1.5 + 0.4}
          fill={['#a78bfa', '#c084fc', '#818cf8', '#facc15', '#fde68a'][i % 5]}
          fillOpacity="0.45"
        />
      ))}
    </svg>
  </div>

  <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-full">
    <div className="flex flex-1 items-center">
      <a href="/" className="-m-1.5 p-0">
        <img className="h-12 sm:h-12 w-auto -mt-0 sm:-mt-0" src="/img/scar.png" alt="Transportes SCAR" />
      </a>
    </div>

    <div className="flex lg:hidden">
      <button
        type="button"
        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>

    <div className="hidden lg:flex lg:gap-x-4 items-center">
      {navigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 ${
            isActive(item.target)
              ? 'bg-white/10 text-indigo-400 backdrop-blur-sm shadow-inner'
              : 'text-white hover:text-indigo-300 hover:bg-white/10'
          }`}
        >
          {item.name}
          {isActive(item.target) && (
            <span className="absolute inset-0 rounded-md ring-1 ring-indigo-400/50" />
          )}
        </a>
      ))}
    </div>

    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
      <a
        href="/login"
        className="rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow hover:from-indigo-400 hover:to-indigo-600 transition"
      >
        Ingresar →
      </a>
    </div>
  </nav>
</header>

  )
}
