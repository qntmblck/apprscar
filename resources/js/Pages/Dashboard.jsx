import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function Dashboard() {
  const novedades = [
    {
      title: '¡Nueva funcionalidad!',
      description: 'Ahora puedes asignar múltiples roles a los usuarios desde el panel de gestión.',
      date: 'Mayo 2025',
    },
    {
      title: 'Optimización de rutas',
      description: 'Hemos mejorado el motor de cálculo para seleccionar rutas más rápidas y económicas.',
      date: 'Abril 2025',
    },
    {
      title: 'Soporte a clientes',
      description: 'Integramos un nuevo canal de contacto directo para clientes frecuentes y licitaciones.',
      date: 'Marzo 2025',
    },
  ]

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">Bienvenido al Panel de Usuario</h2>
          <p className="text-gray-700 mb-6">
            Esta es tu vista general dentro del sistema. Aquí encontrarás noticias, mejoras y accesos útiles según tu rol.
          </p>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📢 Últimas novedades</h3>
            <ul className="space-y-4">
              {novedades.map((item, idx) => (
                <li key={idx} className="p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition">
                  <h4 className="text-md font-semibold text-indigo-800">{item.title}</h4>
                  <p className="text-sm text-gray-700">{item.description}</p>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📈 Enlaces útiles</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li><a href="/profile" className="text-indigo-600 hover:underline">Editar mi perfil</a></li>
              <li><a href="/contacto" className="text-indigo-600 hover:underline">Contactar soporte</a></li>
              <li><a href="/redirect-by-role" className="text-indigo-600 hover:underline">Ir a mi panel según rol</a></li>
            </ul>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
