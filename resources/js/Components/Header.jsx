import { useState, useEffect } from 'react'
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
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-[#0c1e3a] via-[#0c1e3aa0] to-transparent shadow-md">
      {/* Fondo partículas */}
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

      {/* Barra superior */}
      <div className="mx-auto flex max-w-7xl items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
        <a href="/" className="-m-1.5 p-0">
          <img className="h-12 w-auto" src="/img/scar.png" alt="Transportes SCAR" />
        </a>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-4">
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
      </div>

      {/* Menú desplegable móvil animado */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-slide-down bg-gradient-to-b from-[#0c1e3a] via-[#0c1e3aa0] to-[#0c1e3a] px-6 pb-4 pt-2">
          <div className="space-y-2 text-left">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-4 py-3 text-base font-semibold transition-all ${
                  isActive(item.target)
                    ? 'bg-white/10 text-indigo-300 backdrop-blur-md'
                    : 'text-white hover:text-indigo-300 hover:bg-white/10'
                }`}
              >
                {item.name}
              </a>
            ))}
            <a
              href="/login"
              className="block mt-4 rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 px-4 py-3 text-base font-semibold text-white hover:from-indigo-400 hover:to-indigo-600"
            >
              Ingresar →
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
