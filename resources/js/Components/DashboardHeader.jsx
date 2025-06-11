import { useState, useEffect, useMemo } from 'react'
import { usePage, Link } from '@inertiajs/react'
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { props } = usePage()
  const user = props.auth?.user
  const roles = props.auth?.roles || []

  // Genera iniciales a partir de user.name
  const initials = useMemo(() => {
    if (!user?.name) return null
    const parts = user.name.trim().split(' ')
    const letters = parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0][0]
    return letters.toUpperCase()
  }, [user])

  const navigation = getNavigation(roles)
  const userNavigation = [
    { name: 'Perfil', href: '/profile', method: 'get' },
    { name: 'Salir', href: '/logout', method: 'post' },
  ]

  const [activeItem, setActiveItem] = useState('')
  useEffect(() => {
    const currentPath = window.location.pathname
    const current = navigation.find((item) =>
      currentPath.startsWith(item.href)
    )
    if (current) setActiveItem(current.name)
  }, [navigation])

  const isActive = (name) => activeItem === name

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-t from-white via-[#0c1e3aa0] to-[#0c1e3a] shadow-md">
      <div className="relative mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8 justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href={getDashboardUrl(roles)}>
            <img
              className="h-6 sm:h-6 md:h-5 lg:h-7 w-auto mt-1"
              src="/img/scar3.png"
              alt="Transportes SCAR"
            />
          </Link>
        </div>

        {/* Navegación desktop */}
        <div className="hidden lg:flex gap-x-4 items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                isActive(item.name)
                  ? 'bg-[#003f8c] text-white shadow ring-2 ring-[#0094d9]'
                  : 'text-white hover:text-[#0094d9] hover:bg-white/10'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Perfil desktop */}
        <div className="hidden lg:flex">
          <Menu as="div" className="relative ml-4 shrink-0">
            <MenuButton className="flex items-center justify-center h-8 w-8 rounded-full bg-white ring-2 ring-white/20 overflow-hidden">
              {initials ? (
                <span className="font-medium text-sm text-gray-700">
                  {initials}
                </span>
              ) : (
                <UserIcon className="h-5 w-5 text-gray-500" />
              )}
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

        {/* Botón burger móvil */}
        <div className="flex lg:hidden">
          {!mobileMenuOpen && (
            <button
              type="button"
              className="p-2 text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* Menú móvil — solo una línea sutil */}
      {mobileMenuOpen && (
        <div className="absolute top-0 left-0 z-60 w-full border-b border-gray-200 bg-transparent px-4 py-1">
          <div className="flex items-center justify-between">
            {/* Enlaces en una sola fila con scroll horizontal */}
            <div className="flex space-x-4 overflow-x-auto">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-semibold transition-all duration-200 ${
                    isActive(item.name)
                      ? 'bg-[#003f8c] text-white ring-1 ring-[#0094d9]/50'
                      : 'text-gray-700 hover:text-[#003f8c] hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  method={item.method}
                  as="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-semibold text-gray-700 hover:text-[#003f8c] hover:bg-gray-100 transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {/* Única “X” para cerrar el menú */}
            <button
              type="button"
              className="p-2 text-gray-500 flex-shrink-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
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
      { name: 'Fletes', href: '/fletes' }
    )
  } else if (roles.includes('admin')) {
    navigation.push({ name: 'Fletes', href: '/fletes' })
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
