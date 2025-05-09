import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'


const navigation = [
    { name: 'Inicio', href: '/#inicio' },
    { name: 'Nosotros', href: '/#alliances' },
    { name: 'Servicios', href: '/#servicios' },
    { name: 'Contacto', href: '/contacto' },
  ]


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-[#0c1e3a] via-[#0c1e3ad0] to-transparent shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <img className="h-12 w-auto" src="/img/scar.png" alt="Transportes SCAR" />
          </a>
        </div>

        {/* Mobile button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex lg:gap-x-4">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="relative rounded-md px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:text-indigo-300"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Login */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a
            href="/login"
            className="rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow hover:from-indigo-400 hover:to-indigo-600 transition"
          >
            Ingresar →
          </a>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-x-0 top-0 z-50 w-full overflow-hidden rounded-b-2xl bg-gradient-to-b from-[#0c1e3a] via-[#0c1e3aa0] to-[#0c1e3a] shadow-lg backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-6 lg:px-8">
            <a href="/" className="-m-1.5 p-1.5">
              <img className="h-12 w-auto" src="/img/scar.png" alt="Transportes SCAR" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="px-6 pb-6 pt-2 space-y-2 text-center">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block rounded-md px-4 py-3 text-base font-semibold text-white hover:bg-white/10 hover:text-indigo-300 transition-all"
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
      </Dialog>
    </header>
  )
}
