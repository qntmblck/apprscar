import { usePage, router } from '@inertiajs/react'
import { useState } from 'react'

export default function SuperUsuarios({ auth, users, roles }) {
  const { props } = usePage()
  const currentUserId = props.auth.user.id
  const [search, setSearch] = useState('')
  const [editingUserId, setEditingUserId] = useState(null)

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  )

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

    if (isSuperadmin && isCurrentUser) return () => {}
    return hasRole
      ? () => removeRole(user.id, role.name)
      : () => toggleRole(user.id, role.name)
  }

  const isCheckboxDisabled = (user, role) =>
    role.name === 'superadmin' && user.id === currentUserId

  return (
    <div className="bg-gray-900 min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center mb-6">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-white">Usuarios</h1>
            <p className="mt-2 text-sm text-gray-300">
              Gestión de roles asignados a cada usuario. Puedes editar múltiples roles por persona.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar nombre o email"
              className="rounded-md border-gray-700 bg-gray-800 text-white p-2 text-sm w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Roles</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-white">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-4 py-3 text-sm text-white whitespace-nowrap">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {editingUserId === user.id ? (
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
                                className="form-checkbox text-indigo-500"
                              />
                              <span className="text-xs text-white">{role.name}</span>
                            </label>
                          )
                        })}
                      </div>
                    ) : (
                      user.roles.map(r => (
                        <span key={r.id} className="inline-block bg-indigo-100 text-indigo-800 rounded-full px-2 py-0.5 text-xs mr-1">
                          {r.name}
                        </span>
                      ))
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <button
                      onClick={() => setEditingUserId(editingUserId === user.id ? null : user.id)}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      {editingUserId === user.id ? 'Cerrar' : 'Editar'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400 text-sm">
                    No se encontraron usuarios con ese criterio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
