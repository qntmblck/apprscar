import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function SuperDashboard() {
  return (
    <AuthenticatedLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resumen general */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen general</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Fletes realizados</p>
                  <p className="text-2xl font-bold text-indigo-700">134</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Conductores activos</p>
                  <p className="text-2xl font-bold text-green-700">18</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Solicitudes de mantención</p>
                  <p className="text-2xl font-bold text-yellow-700">3</p>
                </div>
              </div>
            </div>
          </section>

          {/* Panel de administración */}
          <section>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Panel de administración</h2>
              <ul className="space-y-2 text-sm text-indigo-700">
                <li>
                  <a href="/usuarios" className="hover:underline font-medium">Gestionar usuarios</a>
                </li>
                <li>
                  <a href="/fletes" className="hover:underline font-medium">Revisar fletes</a>
                </li>
                <li>
                  <a href="/reportes" className="hover:underline font-medium">Ver reportes</a>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Actividad reciente */}
        <div className="space-y-6">
          <section>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Actividad reciente</h2>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>🟢 Juan Pérez inició un viaje a Antofagasta</li>
                <li>🔧 Solicitud de mantención para Tracto JB6591</li>
                <li>📦 Nuevo cliente agregado: SODIMAC</li>
                <li>🗂️ Rol de colaborador asignado a Carolina Reyes</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
