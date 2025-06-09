// resources/js/app.jsx

// 1. Primero importamos los estilos generales (Tailwind o tu CSS)
//    y luego 'bootstrap.js' para configurar Axios con el CSRF token.
import '../css/app.css'
import './bootstrap'

import React from 'react'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'



// 2. Creamos la aplicación Inertia + React.
//    - title: función que recibe el title de cada página (configurable en cada componente).
//    - resolve: le dice a Vite dónde buscar los componentes dinámicos en ./Pages.
//    - setup: monta el componente Inertia dentro del <div id="app"> que produce Blade.
//    - progress: configuración opcional de la barra de progreso.
createInertiaApp({
  title: (title) => `${title}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.jsx`,
      import.meta.glob('./Pages/**/*.jsx')
    ),
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(<App {...props} />)
  },
  progress: {
    color: '#4B5563',
  },
})
