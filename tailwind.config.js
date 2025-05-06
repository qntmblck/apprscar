import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'
import scrollbarHide from 'tailwind-scrollbar-hide' // 👈 asegúrate de tenerlo instalado

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        scrolling: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        scroll: 'scrolling 30s linear infinite',
      },
    },
  },

  plugins: [
    forms,
    scrollbarHide, // ✅ agrega este plugin aquí
  ],
}
