import { router, usePage } from '@inertiajs/react'

export default function SuperUsuarios({ users, roles }) {
  const { props } = usePage()
  const currentUserId = props.auth.user.id

  const toggleRole = (userId, roleName) => {
    router.post(`/usuarios/${userId}/role`, { role: roleName }, { preserveScroll: true })
  }

  const removeRole = (userId, roleName) => {
    router.delete(`/usuarios/${userId}/role`, {
      data: { role: roleName },
      preserveScroll: true,
    })
  }

  const handleCheckbox = (user, role) => {
    const hasRole = user.roles?.some(r => r.name === role.name)
    const isCurrentUser = user.id === currentUserId
    const isSuperadmin = role.name === 'superadmin'

    if (isSuperadmin && isCurrentUser) {
      return () => {} // no hace nada
    }

    return hasRole
      ? () => removeRole(user.id, role.name)
      : () => toggleRole(user.id, role.name)
  }

  const isCheckboxDisabled = (user, role) => {
    return role.name === 'superadmin' && user.id === currentUserId
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Usuarios del sistema</h2>
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="pb-2">Nombre</th>
            <th className="pb-2">Email</th>
            <th className="pb-2">Roles asignables</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="py-2">{user.name}</td>
              <td className="py-2">{user.email}</td>
              <td className="py-2">
                <div className="flex flex-wrap gap-2">
                  {roles.map(role => {
                    const hasRole = user.roles?.some(r => r.name === role.name)
                    return (
                      <label key={role.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={hasRole}
                          disabled={isCheckboxDisabled(user, role)}
                          onChange={handleCheckbox(user, role)}
                          className="form-checkbox text-indigo-600"
                        />
                        <span className={`text-xs px-2 py-0.5 rounded-full ${hasRole ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-200 text-gray-600'}`}>
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
