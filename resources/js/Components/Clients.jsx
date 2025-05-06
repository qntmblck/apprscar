const clients = [
    { name: 'Latam', logo: '/img/latam.png?v=2' },
    { name: 'Essity', logo: '/img/dashboard/essity.svg?v=2' },
    { name: 'Ripley', logo: '/img/ripley.png?v=2' },
    { name: 'Walmart', logo: '/img/walmart.png?v=2' },
    { name: 'Deco Muebles', logo: '/img/dashboard/deco.png?v=2' },
    { name: 'Fruna', logo: '/img/dashboard/fruna.webp?v=2' },
    { name: 'Fibox', logo: '/img/dashboard/fibox.png?v=2' },
    { name: 'Tottus', logo: '/img/tottus.png?v=2' },
    { name: 'Falabella', logo: '/img/dashboard/falabella.png?v=2' },
    { name: 'Prisa', logo: '/img/dashboard/prisa.png?v=2' },
    { name: 'Canontex', logo: '/img/dashboard/canontex.png?v=2' },
    { name: 'Paris', logo: '/img/paris.png?v=2' },
    { name: 'Geoprospec', logo: '/img/dashboard/geo.png?v=2' },
    { name: 'Construmart', logo: '/img/contrumart.jpeg?v=2' },
    { name: 'Tecnopapel', logo: '/img/tecnopapel.png?v=2' },
  ]

  export default function Clients() {
    return (
      <section id="clientes" className="bg-white py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-lg font-semibold text-indigo-600">
            Empresas que mueven Chile con Transportes SCAR
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {clients.map((client) => (
              <div
                key={client.name}
                className="flex items-center justify-center grayscale-[60%] opacity-90 hover:grayscale-0 hover:opacity-100 transition duration-300"
              >
                <img
                  className="max-h-12 object-contain mx-auto"
                  src={client.logo}
                  alt={`Logo ${client.name}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
