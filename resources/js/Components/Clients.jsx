const clients = [
  { name: 'Latam', logo: '/img/latam.png?v=2', width: 140, height: 48, offsetX: -25, offsetY: 7 },
  { name: 'Essity', logo: '/img/dashboard/essity.svg?v=2', width: 120, height: 50, offsetX: -15, offsetY: 4 },
  { name: 'Ripley', logo: '/img/ripley.png?v=2', width: 150, height: 60, offsetX: -4, offsetY: -2 },
  { name: 'Walmart', logo: '/img/walmart.png?v=2', width: 140, height: 64, offsetX: 8, offsetY: 0 },
  { name: 'Deco Muebles', logo: '/img/dashboard/deco.png?v=2', width: 165, height: 60, offsetX: 22, offsetY: 2 },
  { name: 'Fruna', logo: '/img/dashboard/fruna.webp?v=2', width: 160, height: 66, offsetX: 2, offsetY: 2 },
  { name: 'Fibox', logo: '/img/dashboard/fibox.png?v=2', width: 130, height: 60, offsetX: -15, offsetY: -2 },
  { name: 'Tottus', logo: '/img/tottus.png?v=2', width: 150, height: 60, offsetX: 4, offsetY: -1 },
  { name: 'Falabella', logo: '/img/dashboard/falabella.png?v=2', width: 140, height: 60, offsetX: 27, offsetY: -1 },
  { name: 'Prisa', logo: '/img/dashboard/prisa.png?v=2', width: 185, height: 75, offsetX: 2, offsetY: -2 },
  { name: 'Canontex', logo: '/img/dashboard/canontex.png?v=2', width: 160, height: 70, offsetX: -3, offsetY: 0 },
  { name: 'Paris', logo: '/img/paris.png?v=2', width: 95, height: 40, offsetX: 15, offsetY: 16 },
  { name: 'Geoprospec', logo: '/img/dashboard/geo.png?v=2', width: 190, height: 70, offsetX: 35, offsetY: -4 },
  { name: 'Construmart', logo: '/img/contrumart.jpeg?v=2', width: 240, height: 83, offsetX: -15, offsetY: -14 },
  { name: 'Tecnopapel', logo: '/img/tecnopapel.png?v=2', width: 180, height: 76, offsetX: -43, offsetY: -4 },
]

export default function Clients() {
  return (
    <section id="clientes" className="bg-white py-6 px-6 sm:px-8 -mt-[1px]">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex animate-scroll space-x-8 px-2 w-max">
          {clients.concat(clients).map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="flex items-center justify-center flex-shrink-0 grayscale-[60%] opacity-90 hover:grayscale-0 hover:opacity-100 transition duration-300"
              style={{ width: `${client.width + 20}px`, height: `${client.height + 10}px` }}
            >
              <img
                src={client.logo}
                alt={`Logo ${client.name}`}
                className="object-contain mx-auto"
                style={{
                  width: `${client.width}px`,
                  height: `${client.height}px`,
                  transform: `translate(${client.offsetX}px, ${client.offsetY}px)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
