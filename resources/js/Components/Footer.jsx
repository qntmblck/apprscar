import { useEffect, useState } from 'react'

const socialLinks = [
  {
    name: 'Facebook',
    href: '#',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128
          8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506
          1.492-3.89 3.777-3.89 1.094 0 2.238.195
          2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63
          1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343
          21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12 2.163c3.204 0 3.584.012 4.85.07
          1.366.062 2.633.334 3.608 1.31.975.975
          1.248 2.242 1.31 3.608.058 1.266.07 1.646.07
          4.85s-.012 3.584-.07 4.85c-.062 1.366-.334
          2.633-1.31 3.608-.975.975-2.242 1.248-3.608
          1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.31C2.497
          19.196 2.224 17.929 2.162 16.563c-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633
          1.31-3.608C4.437 2.497 5.704 2.224 7.07
          2.162c1.266-.058 1.646-.07 4.85-.07zM12
          5.838a6.162 6.162 0 100 12.324 6.162 6.162 0
          000-12.324zm0 10.162a4 4 0 110-8 4 4 0
          010 8zm6.406-11.845a1.44 1.44 0 100
          2.881 1.44 1.44 0 000-2.881z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'X',
    href: '#',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765
        13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819
        10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742
        10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: '#',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0
          4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
          0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608
          1.003.07 1.531 1.032 1.531 1.032.892
          1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951
          0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65
          0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112
          6.844c.85.004 1.705.115 2.504.337
          1.909-1.296 2.747-1.027 2.747-1.027.546
          1.379.202 2.398.1 2.651.64.7
          1.028 1.595 1.028 2.688 0
          3.848-2.339 4.695-4.566
          4.943.359.309.678.92.678
          1.855 0 1.338-.012 2.419-.012
          2.747 0 .268.18.58.688.482A10.019
          10.019 0 0022 12.017C22
          6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M19.812 5.418c.861.23 1.538.907
          1.768 1.768C21.998 8.746 22 12 22 12s0
          3.255-.418 4.814a2.504 2.504 0 0
          1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255
          0-7.814-.419a2.505 2.505 0 0
          1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507
          2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998
          5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

export default function Footer() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const p = []
    for (let i = 0; i < 20; i++) {
      p.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${8 + Math.random() * 4}s`,
      })
    }
    setParticles(p)
  }, [])

  return (
    <footer className="relative text-white font-semibold overflow-hidden bg-[#0c1e3a]">

      {/* Fondo patrón */}
      <div className="absolute inset-0 z-0 pointer-events-none animate-slow-pattern" style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, #6366f1 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        opacity: 0.1
      }}></div>

      {/* Partículas */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {particles.map((style, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-slow-float"
            style={style}
          ></div>
        ))}
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Texto centrado */}
          <div className="flex flex-col justify-center items-center text-center">
            <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Transportes SCAR</h2>
            <p className="mt-6 max-w-2xl text-sm leading-6 text-white font-semibold">
              Empresa nacional dedicada al transporte de carga, comprometida con la seguridad, cumplimiento y eficiencia. Construimos alianzas confiables en todo Chile.
            </p>

            <div className="mt-8 space-y-2 text-sm">
              <p>📍 <span className="text-indigo-300 font-semibold">Dirección:</span> Sta. Rosa de Santiago & Cam. Uno, Batuco, Lampa</p>
              <p>📞 <span className="text-indigo-300 font-semibold">Teléfono:</span> <a href="tel:+56944671205" className="hover:underline">+56 9 4467 1205</a></p>
              <p>📧 <span className="text-indigo-300 font-semibold">Correo:</span> <a href="mailto:contacto@scartransportes.cl" className="hover:underline">contacto@scartransportes.cl</a></p>
            </div>
          </div>

          {/* Mapa */}
          <div className="w-full h-96 rounded-xl overflow-hidden shadow-xl relative">
            <iframe
              title="Ubicación Transportes SCAR"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11360.518375032407!2d-70.77939047130636!3d-33.24605036819924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662bc2ab0096e85%3A0x144213a8b702d3be!2sSta.%20Rosa%20de%20Santiago%20%26%20Cam.%20Uno%2C%20Batuco%2C%20Lampa%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1746529815067!5m2!1ses!2scl"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Línea inferior y RRSS */}
        <div className="mt-16 border-t border-indigo-500 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-white font-semibold">
            © 2024 Transportes SCAR SpA. Todos los derechos reservados.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            {socialLinks.map((item) => (
              <a key={item.name} href={item.href} className="text-white hover:text-indigo-300 transition-colors">
                <span className="sr-only">{item.name}</span>
                <item.icon className="w-6 h-6" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Estilos */}
      <style jsx>{`
        @keyframes slow-pattern {
          0% { background-position: 0 0; }
          100% { background-position: 80px 80px; }
        }
        .animate-slow-pattern {
          animation: slow-pattern 100s linear infinite;
        }
        @keyframes slow-float {
          0% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-15px) scale(1.1); opacity: 0.7; }
          100% { transform: translateY(0) scale(1); opacity: 0.4; }
        }
        .animate-slow-float {
          animation: slow-float 10s ease-in-out infinite;
        }
      `}</style>
    </footer>
  )
}
