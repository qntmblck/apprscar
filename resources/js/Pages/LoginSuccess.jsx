import { useEffect } from 'react'

export default function LoginSuccess() {
  useEffect(() => {
    // Redirige automáticamente al home después del login
    window.location.href = '/'
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500 text-sm">Redirigiendo...</p>
    </div>
  )
}
