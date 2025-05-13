import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import SuperUsuarios from '@/Components/SuperUsuarios'

export default function Index({ users, roles }) {
  return (
    <AuthenticatedLayout>
      <div className="mt-24 max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Gestión de Usuarios</h1>
        <SuperUsuarios users={users} roles={roles} />
      </div>
    </AuthenticatedLayout>
  )
}
