// resources/js/Components/DashboardHeader.jsx
import { useState, useEffect, useMemo } from 'react'
import { usePage, Link } from '@inertiajs/react'
import { Bars3Icon, ChevronDownIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { props } = usePage()
  const user = props.auth?.user
  const roles = props.auth?.roles || []

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
    { name: 'Salir',  href: '/logout',  method: 'post' },
  ]

  const [activeItem, setActiveItem] = useState('')
  useEffect(() => {
    const currentPath = window.location.pathname
    const current = navigation.find((item) => currentPath.startsWith(item.href))
    if (current) setActiveItem(current.name)
  }, [navigation])

  const isActive = (name) => activeItem === name

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4">
      <div className="relative mx-auto max-w-7xl overflow-visible rounded-2xl border border-[#0094d9]/25 bg-[#07172d]/95 shadow-2xl shadow-[#020817]/45 backdrop-blur-xl ring-1 ring-white/5">

        {/* Particles — same as public header */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
          <svg className="absolute w-full h-full animate-pulse opacity-60 blur-[0.5px] mix-blend-screen">
            {Array.from({ length: 24 }).map((_, i) => (
              <circle
                key={i}
                cx={`${(i * 4.2) % 100}%`}
                cy={`${(i * 7.3) % 100}%`}
                r={1}
                fill={['#0094d9', '#006bb6', '#003f8c'][i % 3]}
                fillOpacity="0.4"
              />
            ))}
          </svg>
        </div>

      <div className="relative mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8 justify-between">

        {/* Logo — same as public header */}
        <div className="flex-shrink-0">
          <Link href={getDashboardUrl(roles)}>
            <img
              className="h-6 sm:h-7 md:h-8 lg:h-10 w-auto mt-1"
              src="/img/scar.webp"
              alt="Transportes SCAR"
            />
          </Link>
        </div>

        {/* Navegación desktop */}
        <div className="hidden lg:flex gap-x-1 items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                isActive(item.name)
                  ? 'bg-[#003f8c] text-white shadow ring-1 ring-[#0094d9]'
                  : 'text-white hover:text-[#0094d9] hover:bg-white/10'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Usuario desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <Menu as="div" className="relative shrink-0">
            <MenuButton className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-slate-200 transition hover:bg-white/10 hover:text-white">
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[#0094d9]/45 bg-[#0094d9]/20">
                {initials ? (
                  <span className="font-bold text-sm text-white">{initials}</span>
                ) : (
                  <UserIcon className="h-4 w-4 text-slate-300" />
                )}
              </span>
              <span className="max-w-28 truncate text-sm font-semibold">
                {user?.name?.split(' ')[0] ?? 'Perfil'}
              </span>
              <ChevronDownIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-[90] mt-2 w-56 origin-top-right rounded-xl bg-[#0c1e3a] border border-[#0094d9]/20 shadow-xl shadow-black/40 overflow-hidden">
              {user && (
                <div className="px-4 py-2.5 border-b border-[#0094d9]/15">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              )}
              {userNavigation.map((item) => (
                <MenuItem key={item.name}>
                  <Link
                    href={item.href}
                    method={item.method}
                    as="button"
                    className="block w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-[#0094d9]/10 transition-colors"
                  >
                    {item.name}
                  </Link>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        {/* Burger móvil */}
        <div className="flex lg:hidden">
          {!mobileMenuOpen && (
            <button type="button" className="p-2 text-white" onClick={() => setMobileMenuOpen(true)}>
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-[#0094d9]/20 bg-[#0c1e3a]/95 shadow-2xl shadow-[#020817]/45 backdrop-blur-xl">
          <div className="px-3 py-2 flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5 overflow-x-auto">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${
                    isActive(item.name)
                      ? 'bg-[#003f8c] text-white ring-1 ring-[#0094d9]/50'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
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
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <button type="button" className="p-1.5 text-slate-400 hover:text-white flex-shrink-0" onClick={() => setMobileMenuOpen(false)}>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

function getNavigation(roles) {
  const navigation = []

  // Panel siempre primero
  navigation.push({ name: 'Panel', href: getDashboardUrl(roles) })

  // Admin / SuperAdmin
  if (roles.includes('superadmin') || roles.includes('admin')) {
    navigation.push({ name: 'Fletes', href: '/fletes' })
  }

  // SuperAdmin: rendiciones y usuarios
  if (roles.includes('superadmin')) {
    navigation.push({ name: 'Rendiciones', href: '/super/rendiciones' })
    navigation.push({ name: 'Usuarios',    href: '/usuarios' })
  }

  // Roles de campo
  if (roles.includes('conductor')) {
    navigation.push({ name: 'Mis Fletes', href: '/conductor/servicios' })
  }
  if (roles.includes('cliente')) {
    navigation.push({ name: 'Mis Fletes', href: '/cliente/servicios' })
  }
  if (roles.includes('colaborador')) {
    navigation.push({ name: 'Mis Fletes', href: '/colaborador/servicios' })
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
