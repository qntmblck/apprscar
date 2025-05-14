import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DashboardHeader from '@/Components/DashboardHeader'
import { Head } from '@inertiajs/react'

export default function ConductorDashboard() {
  return (
    <AuthenticatedLayout>
      <Head title="Panel del Conductor" />
      <DashboardHeader />

      <div className="max-w-7xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Panel del Conductor</h1>
        <p className="text-gray-600 mb-6">
          Bienvenido al sistema. Aquí podrás ver tus fletes activos, registrar entregas y subir rendiciones.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-green-600 mb-2">Fletes asignados</h2>
            <p className="text-sm text-gray-600">Consulta tus rutas y entregas pendientes.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-green-600 mb-2">Rendiciones</h2>
            <p className="text-sm text-gray-600">Sube comprobantes y realiza el cierre del viaje.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-green-600 mb-2">Asistencia</h2>
            <p className="text-sm text-gray-600">Contacta soporte en caso de problemas en ruta.</p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

