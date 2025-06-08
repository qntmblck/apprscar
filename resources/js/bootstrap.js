// resources/js/bootstrap.js

import axios from 'axios'

// 1. Tomar el CSRF token desde la meta tag y asignarlo a todos los requests
const tokenMetaTag = document.head.querySelector('meta[name="csrf-token"]')
if (tokenMetaTag) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = tokenMetaTag.content
} else {
  console.warn('CSRF token meta tag no encontrado: asegúrate de tener <meta name="csrf-token"> en el <head>.')
}

// 2. Indicar que todas las peticiones serán AJAX (opcional pero recomendado)
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
