import { usePage, router } from '@inertiajs/react'
import { useState } from 'react'

export default function SuperUsuarios({ auth, users, roles }) {
  const { props } = usePage()
  const currentUserId = props.auth.user.id
  const [search, setSearch] = useState('')

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
      {/* Título y búsqueda arriba */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-lg font-semibold text-gray-700">Buscar Usuario:</h2>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Escribe nombre o email"
          className="rounded-md border p-2 w-full sm:w-64 text-sm shadow"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto">
        <table className="w-full text-sm table-auto min-w-[600px]">
          <thead className="text-left text-gray-600 text-xs sm:text-sm">
            <tr className="border-b">
              <th className="pb-2">Nombre</th>
              <th className="pb-2">Email</th>
              <th className="pb-2 text-right">Roles asignables</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-t">
                <td className="py-2 whitespace-nowrap">{user.name}</td>
                <td className="py-2 whitespace-nowrap">{user.email}</td>
                <td className="py-2 text-right">
                  <div className="flex flex-wrap gap-2 justify-end ml-auto">
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
                          <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full ${hasRole ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-200 text-gray-600'}`}>
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
    </div>
  )
}
