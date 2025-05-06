import { useEffect, useState } from 'react'

const statsData = [
  { label: 'Clientes y Colaboradores', value: 100, suffix: '+' },
  { label: 'Tasa de crecimiento anual del sector', value: 5.61, suffix: '%', decimals: true },
  { label: 'Colaboradores capacitados', value: 100, suffix: '%', decimals: false },
  { label: 'Cumplimiento en tiempos de entrega', value: 95, suffix: '+%', decimals: false },
]

function useCounter(target, decimals = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = target
    const duration = 1200
    const incrementTime = 20
    const steps = duration / incrementTime
    const increment = (end - start) / steps

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        clearInterval(timer)
        setCount(end)
      } else {
        setCount(start)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [target])

  return decimals ? count.toFixed(2) : Math.round(count)
}

export default function Statistics() {
  return (
    <section id="estadisticas" className="bg-gradient-to-r from-[#f6f9ff] to-[#eceaff] py-24 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Confiado por cientos de clientes y colaboradores en todo Chile
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-700 max-w-3xl mx-auto">
          El mercado del transporte de carga en Chile crece con un 5.61% de alza anual. En Transportes SCAR no solo
          respondemos con eficiencia y costos competitivos, sino que además invertimos en el desarrollo de nuestro
          equipo. Creemos que un transporte seguro comienza con personas capacitadas, por eso ofrecemos programas de
          formación continua alineados con las últimas normativas.
        </p>
        <p className="mt-4 text-lg leading-8 text-gray-700 max-w-3xl mx-auto">
          Nuestra cultura organizacional promueve el autocuidado, el respeto y la mejora constante. Nos importa el
          bienestar de quienes mueven a Chile, y eso se refleja en la confianza de nuestros clientes y en el
          compromiso de nuestros trabajadores.
        </p>

        <dl className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, i) => {
            const count = useCounter(stat.value, stat.decimals)
            return (
              <div key={i} className="flex flex-col items-center border-l border-gray-300 first:border-none pl-6 first:pl-0">
                <dt className="text-sm font-semibold text-gray-600">{stat.label}</dt>
                <dd className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.suffix.startsWith('+') ? stat.suffix : ''}{count}{stat.suffix.endsWith('%') ? '%' : ''}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
