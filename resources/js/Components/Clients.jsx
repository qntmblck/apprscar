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
      <section id="clientes" className="bg-white py-6 px-4">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex animate-scroll space-x-8 px-2 w-max">
            {clients.concat(clients).map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="flex items-center justify-center flex-shrink-0 grayscale-[60%] opacity-90 hover:grayscale-0 hover:opacity-100 transition duration-300"
                style={{ width: '160px', height: '64px' }}
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
    );
  }
