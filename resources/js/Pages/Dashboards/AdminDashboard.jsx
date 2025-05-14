import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

export default function AdminDashboard() {
  return (
    <AuthenticatedLayout>
      <Head title="Panel del Administrador" />
      <div className="max-w-7xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Panel del Administrador</h1>
        <p className="text-gray-600">
          Desde este panel puedes acceder a herramientas de gestión, supervisar usuarios, revisar reportes de actividad y monitorear los fletes.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-indigo-600 mb-2">Usuarios registrados</h2>
            <p className="text-sm text-gray-600">Administra los usuarios y sus roles en el sistema.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-indigo-600 mb-2">Fletes activos</h2>
            <p className="text-sm text-gray-600">Supervisa los fletes en curso y su trazabilidad.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-indigo-600 mb-2">Reportes operacionales</h2>
            <p className="text-sm text-gray-600">Accede a estadísticas y reportes históricos.</p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
