import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import SuperUsuarios from '@/Components/SuperUsuarios'

export default function Index({ auth, users, roles }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Usuarios" />
      <SuperUsuarios auth={auth} users={users} roles={roles} />
    </AuthenticatedLayout>
  )
}
