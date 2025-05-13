import { router } from '@inertiajs/react'

export default function SuperUsuarios({ users, roles }) {
  const toggleRole = (userId, roleName, hasRole) => {
    if (hasRole) {
      router.delete(`/usuarios/${userId}/role`, {
        data: { role: roleName },
        preserveScroll: true,
      })
    } else {
      router.post(`/usuarios/${userId}/role`, {
        role: roleName,
        preserveScroll: true,
      })
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Usuarios del sistema</h1>

      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-3 text-gray-600">Nombre</th>
            <th className="p-3 text-gray-600">Email</th>
            <th className="p-3 text-gray-600">Roles asignables</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium text-gray-800">{user.name}</td>
              <td className="p-3 text-gray-700">{user.email}</td>
              <td className="p-3">
                <div className="flex flex-wrap gap-3">
                  {roles
                    .filter((role) => role.name !== 'superadmin')
                    .map((role) => {
                      const hasRole = user.roles.some((r) => r.name === role.name)
                      return (
                        <label key={role.id} className="flex items-center gap-2 text-sm text-gray-800">
                          <input
                            type="checkbox"
                            checked={hasRole}
                            onChange={() => toggleRole(user.id, role.name, hasRole)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            hasRole
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {role.name}
                          </span>
                        </label>
                      )
                    })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
