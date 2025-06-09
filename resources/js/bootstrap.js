// resources/js/bootstrap.js

import axios from 'axios'

// Verificar si existe el token CSRF en el HTML
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

// Si el token CSRF está presente, configurarlo para todas las solicitudes de Axios
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token
} else {
  console.warn('CSRF token no encontrado, recargando página...')
  window.location.reload()  // Recargar la página si el token no está disponible
}

// Configurar axios para que use las cookies para autenticación en Laravel Sanctum
axios.defaults.withCredentials = true

// Si no existe el token CSRF, forzamos un ciclo de recarga (no debe repetirse)
if (!token && !window.__csrf_retry__) {
  window.__csrf_retry__ = true
  window.location.reload()
}
