// resources/js/Pages/LoginSuccess.jsx

import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'

export default function LoginSuccess() {
  // Obtengo usuario y roles de las props de Inertia
  const {
    auth: { user },
    roles,
  } = usePage().props

  useEffect(() => {
    // Si es superadmin o admin → lista de servicios
    if (roles.includes('superadmin') || roles.includes('admin')) {
      window.location.href = '/fletes'
      return
    }

    // Para los demás roles, redirige a su dashboard correspondiente
    if (roles.includes('cliente')) {
      window.location.href = '/cliente/dashboard'
    } else if (roles.includes('conductor')) {
      window.location.href = '/conductor/dashboard'
    } else if (roles.includes('colaborador')) {
      window.location.href = '/colaborador/dashboard'
    } else {
      // fallback genérico
      window.location.href = '/'
    }
  }, [roles])

  return null
}
