import { useState, useEffect } from 'react'
import { usePage, Link } from '@inertiajs/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { props } = usePage()
  const user = props.auth?.user
  const roles = props.auth?.roles || []

  const navigation = getNavigation(roles)
  const userNavigation = [
    { name: 'Perfil', href: '/profile', method: 'get' },
    { name: 'Salir', href: '/logout', method: 'post' },
  ]

  const [activeItem, setActiveItem] = useState('')
  useEffect(() => {
    const currentPath = window.location.pathname
    const current = navigation.find((item) => currentPath.startsWith(item.href))
    if (current) setActiveItem(current.name)
  }, [navigation])

  const isActive = (name) => activeItem === name

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-white via-[#0c1e3aa0] to-[#0c1e3a] shadow-md"
>
      {/* Partículas animadas */}
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

      <div className="relative mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8 justify-between">
        <div className="flex-shrink-0">
          <Link href="/">
            <img
  className="h-6 sm:h-6 md:h-7 lg:h-10 w-auto mt-1"
  src="/img/scar2.png"
  alt="Transportes SCAR"
/>

          </Link>
        </div>

        <div className="hidden lg:flex gap-x-4 items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                isActive(item.name)
                  ? 'bg-indigo-600 text-white shadow ring-2 ring-indigo-300'
                  : 'text-white hover:text-indigo-300 hover:bg-white/10'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex">
          <Menu as="div" className="relative ml-4 shrink-0">
            <MenuButton className="relative flex rounded-full bg-white text-sm ring-2 ring-white/20">
              <img
                className="h-8 w-8 rounded-full"
                src={user?.imageUrl || '/img/default-avatar.png'}
                alt="avatar"
              />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
              {userNavigation.map((item) => (
                <MenuItem key={item.name}>
                  <Link
                    href={item.href}
                    method={item.method}
                    as="button"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.name}
                  </Link>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden animate-slide-down bg-gradient-to-b from-[#0c1e3a] via-[#0c1e3aa0] to-[#0c1e3a] px-6 pb-4 pt-2">
          <div className="space-y-2 text-left">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-4 py-3 text-base font-semibold transition-all duration-300 ${
                  isActive(item.name)
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                    : 'text-white hover:text-indigo-300 hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-white/20 mt-4 pt-4">
              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  method={item.method}
                  as="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left rounded-md px-4 py-3 text-base font-semibold text-white hover:text-indigo-300 hover:bg-white/10"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function getNavigation(roles) {
  const navigation = [{ name: 'Panel', href: getDashboardUrl(roles) }]
  if (roles.includes('superadmin')) {
    navigation.push(
      { name: 'Usuarios', href: '/usuarios' },
      { name: 'Conductores', href: '/conductores' },
      { name: 'Clientes', href: '/clientes' },
      { name: 'Fletes', href: '/fletes' }
    )
  } else if (roles.includes('admin')) {
    navigation.push(
      { name: 'Conductores', href: '/conductores' },
      { name: 'Clientes', href: '/clientes' }
    )
  } else if (roles.includes('colaborador')) {
    navigation.push({ name: 'Clientes', href: '/clientes' })
  } else if (roles.includes('cliente')) {
    navigation.push({ name: 'Mis Fletes', href: '/cliente/fletes' })
  }
  return navigation
}

function getDashboardUrl(roles) {
  if (roles.includes('superadmin')) return '/super/dashboard'
  if (roles.includes('admin')) return '/admin/dashboard'
  if (roles.includes('colaborador')) return '/colaborador/dashboard'
  if (roles.includes('cliente')) return '/cliente/dashboard'
  if (roles.includes('conductor')) return '/conductor/dashboard'
  return '/dashboard'
}
