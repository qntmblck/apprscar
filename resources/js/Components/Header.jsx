import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePage } from '@inertiajs/react'

const navigation = [
  { name: 'Inicio',    href: '/#inicio',    target: 'inicio'    },
  { name: 'Servicios', href: '/#servicios', target: 'servicios' },
  { name: 'Nosotros',  href: '/#alliances', target: 'alliances' },
  { name: 'Contacto',  href: '/contacto',   target: 'contacto'  },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('inicio')
  const { auth } = usePage().props
  const user = auth.user

  useEffect(() => {
    const handleScroll = () => {
      for (const { target } of navigation) {
        const el = document.getElementById(target)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActiveItem(target)
          return
        }
      }
      if (window.location.pathname === '/contacto') {
        setActiveItem('contacto')
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (target) => activeItem === target

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-[#0c1e3a] via-[#0c1e3aa0] to-transparent shadow-md">
      {/* Partículas */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg className="absolute w-full h-full animate-pulse opacity-70 blur-[0.5px] mix-blend-screen">
          {Array.from({ length: 30 }).map((_, i) => (
            <circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 1.5 + 0.4}
              fill={['#0094d9', '#006bb6', '#003f8c'][i % 3]}
              fillOpacity="0.45"
            />
          ))}
        </svg>
      </div>

      <div className="relative mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8 justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <button
            onClick={() => (window.location.href = '/')}
            className="p-0 m-0 border-none bg-transparent cursor-pointer"
          >
            <img
              className="h-6 sm:h-6 md:h-7 lg:h-10 w-auto mt-2"
              src="/img/scar.png"
              alt="Transportes SCAR"
            />
          </button>
        </div>

        {/* Navegación escritorio */}
        <div className="hidden lg:flex gap-x-4 items-center">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                isActive(item.target)
                  ? 'bg-[#003f8c] text-white shadow ring-1 ring-[#0094d9]'
                  : 'text-white hover:text-[#0094d9] hover:bg-white/10'
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Botón “Ingresar” / “Mi Panel” */}
        <div className="hidden lg:flex">
          <button
            onClick={() => (window.location.href = '/redirect-by-role')}
            className="ml-4 rounded-md bg-gradient-to-r from-[#0094d9] to-[#003f8c] px-4 py-2 text-sm font-semibold text-white shadow hover:from-[#00a0f0] hover:to-[#004b99] transition"
          >
            {user ? 'Mi Panel →' : 'Ingresar →'}
          </button>
        </div>

        {/* Botón burger móvil */}
        <div className="flex lg:hidden mt-1">
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
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-slide-down bg-gradient-to-b from-[#0c1e3a] via-[#0c1e3aa0] to-[#0c1e3a] px-6 pb-4 pt-2">
          <div className="flex flex-wrap gap-2 justify-center items-center text-center">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive(item.target)
                    ? 'bg-[#003f8c] text-white shadow ring-1 ring-[#0094d9]'
                    : 'text-white hover:text-[#0094d9] hover:bg-white/10'
                }`}
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                window.location.href = '/redirect-by-role'
              }}
              className="rounded-md bg-gradient-to-r from-[#0094d9] to-[#003f8c] px-4 py-2 text-sm font-semibold text-white shadow hover:from-[#00a0f0] hover:to-[#004b99] transition"
            >
              {user ? 'Mi Panel →' : 'Ingresar →'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
