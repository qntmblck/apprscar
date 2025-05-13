import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Link, usePage } from '@inertiajs/react'

export default function Dashboard() {
  const { props } = usePage()
  const user = props.auth?.user || {}
  const roles = user.roles || []

  const novedades = [
    {
      title: 'Seguimiento de fletes actualizado',
      description: 'Ahora puedes monitorear en tiempo real el estado de tus fletes desde el panel de cliente o conductor.',
      date: 'Mayo 2025',
    },
    {
      title: 'Indicadores de seguridad',
      description: 'En el último trimestre, logramos una reducción del 17% en incidentes en ruta gracias a las nuevas capacitaciones.',
      date: 'Abril 2025',
    },
    {
      title: 'Canal directo con operaciones',
      description: 'Habilitamos un canal de contacto prioritario con el área de operaciones para los colaboradores de terreno.',
      date: 'Marzo 2025',
    },
  ]

  const resumen = [
    { label: 'Fletes activos este mes', value: '248', color: 'indigo' },
    { label: 'Clientes recurrentes', value: '63', color: 'green' },
    { label: 'Horas de capacitación completadas', value: '142', color: 'yellow' },
  ]

  const getDashboardUrl = () => {
    if (roles.includes('superadmin')) return '/super/dashboard'
    if (roles.includes('admin')) return '/admin/dashboard'
    if (roles.includes('colaborador')) return '/colaborador/dashboard'
    if (roles.includes('cliente')) return '/cliente/dashboard'
    if (roles.includes('conductor')) return '/conductor/dashboard'
    return '/dashboard'
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto p-6 sm:p-8 relative">
        {/* Botón a dashboard por rol */}
        <Link
          href={getDashboardUrl()}
          className="absolute right-6 top-6 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition"
        >
          Ir a mi panel →
        </Link>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">Bienvenido, {user.name}</h2>
          <p className="text-gray-700 mb-6">
            Esta es la vista informativa general de Transportes SCAR. Aquí puedes encontrar novedades, mejoras en nuestros servicios y datos relevantes según tu perfil.
          </p>

          {/* Indicadores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {resumen.map((item, idx) => (
              <div
                key={idx}
                className={`bg-${item.color}-50 p-4 rounded-lg text-center border border-${item.color}-100`}
              >
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className={`text-2xl font-bold text-${item.color}-700`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Boletín de novedades */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📢 Últimas novedades para ti</h3>
            <ul className="space-y-4">
              {novedades.map((item, idx) => (
                <li
                  key={idx}
                  className="p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition"
                >
                  <h4 className="text-md font-semibold text-indigo-800">{item.title}</h4>
                  <p className="text-sm text-gray-700">{item.description}</p>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte y ayuda */}
          <div className="mt-10 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📞 Soporte y asistencia</h3>
            <p className="text-sm text-gray-700 mb-2">
              ¿Tienes dudas sobre tus fletes, entregas o acceso al sistema? Nuestro equipo está disponible para ayudarte de lunes a sábado.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Correo soporte: <a href="mailto:contacto@scartransportes.cl" className="text-indigo-600 hover:underline">contacto@scartransportes.cl</a></li>
              <li>Horario de atención: 08:00 a 18:30 hrs</li>
              <li>También puedes visitar la sección <Link href="/contacto" className="text-indigo-600 hover:underline">Contacto</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
