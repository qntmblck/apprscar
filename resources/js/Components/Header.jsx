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
              src="/img/scar.webp"
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
          {!mobileMenuOpen && (
            <button
              type="button"
              className="p-2 text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Menú móvil — overlay sobre el header */}
      {mobileMenuOpen && (
        <div className="absolute top-0 left-0 z-60 w-full px-4 py-1">
          <div className="bg-[#0c1e3a]/95 backdrop-blur border border-[#0094d9]/20 rounded-xl shadow-xl px-3 py-2 flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5 overflow-x-auto">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${
                    isActive(item.target)
                      ? 'bg-[#003f8c] text-white ring-1 ring-[#0094d9]/50'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
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
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold bg-gradient-to-r from-[#0094d9] to-[#003f8c] text-white shadow hover:from-[#00a0f0] hover:to-[#004b99] transition-all duration-200"
              >
                {user ? 'Mi Panel →' : 'Ingresar →'}
              </button>
            </div>
            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-white flex-shrink-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
