import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

const statsData = [
  { label: 'Clientes y Colaboradores', value: 120, suffix: '+' },
  { label: 'Tasa de crecimiento del sector', value: 5.61, suffix: '%', decimals: true },
  { label: 'Capacitación del equipo operativo', value: 100, suffix: '%', decimals: false },
  { label: 'Cumplimiento en entregas', value: 95, suffix: '+%', decimals: false },
]

function useCounter(target, decimals = false, trigger) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger) return
    let start = 0
    const duration = 1200
    const incrementTime = 20
    const steps = duration / incrementTime
    const increment = (target - start) / steps

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        clearInterval(timer)
        setCount(target)
      } else {
        setCount(start)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [target, trigger])

  return decimals ? count.toFixed(2) : Math.round(count)
}

export default function Statistics() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (inView) setAnimate(true)
  }, [inView])

  return (
    <section
      ref={ref}
      id="estadisticas"
      className="bg-gradient-to-r from-[#f6f9ff] to-[#eceaff] py-20 sm:py-20 px-6"
    >
      <div
        className={`max-w-7xl mx-auto text-center font-sans transform transition-all duration-1000 ${
          animate ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        } hover:scale-[1.05]`}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight transition-transform duration-300 hover:scale-[1.05]">
          Confiado por cientos de clientes y colaboradores en todo Chile
        </h2>
        <p className="mt-6 text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed transition-transform duration-300 hover:scale-[1.05]">
          El sector del transporte de carga mantiene un crecimiento sostenido del 5.61% anual. En Transportes SCAR respondemos con eficiencia operativa, costos competitivos y personal altamente capacitado.
        </p>
        <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed transition-transform duration-300 hover:scale-[1.05]">
          Invertimos en el bienestar de nuestro equipo, promoviendo una cultura de seguridad, respeto y mejora continua. Nuestra infraestructura y alianzas nos permiten operar a lo largo de todo Chile.
        </p>

        <dl className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, i) => {
            const count = useCounter(stat.value, stat.decimals, inView)
            return (
              <div
                key={i}
                className="flex flex-col items-center border-l border-gray-300 first:border-none pl-6 first:pl-0 transition-transform duration-300 hover:scale-[1.05]"
              >
                <dt className="text-sm font-semibold text-gray-600">{stat.label}</dt>
                <dd className="mt-2 text-3xl font-extrabold text-gray-900">
                  {stat.suffix.startsWith('+') ? stat.suffix : ''}
                  {count}
                  {stat.suffix.endsWith('%') ? '%' : ''}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
