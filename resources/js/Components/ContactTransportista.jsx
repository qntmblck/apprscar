import { useForm } from '@inertiajs/react'

export default function ContactTransportista() {
  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    mensaje: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post(route('contacto.transportista'), {
      onSuccess: () => reset(),
    })
  }

  return (
    <div className="relative bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a] py-24 px-6 lg:px-8 text-white">
      <div className="lg:grid lg:grid-cols-2 lg:gap-16 max-w-7xl mx-auto">
        {/* Imagen */}
        <div className="hidden lg:block">
          <img src="/img/dashboard/transportista.jpg" alt="Camión" className="rounded-xl shadow-xl object-cover w-full h-full" />
        </div>

        {/* Formulario */}
        <div className="max-w-xl space-y-10">
          <div>
            <h2 className="text-4xl font-semibold sm:text-5xl">¿Eres transportista o conductor?</h2>
            <p className="mt-4 text-white/80">
              Completa el siguiente formulario y nos pondremos en contacto contigo para evaluar una posible colaboración.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {recentlySuccessful && (
              <div className="p-4 rounded bg-green-500/20 border border-green-500 text-green-200 text-sm">
                ¡Tu solicitud fue enviada correctamente!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={data.nombre}
                  onChange={(e) => setData('nombre', e.target.value)}
                  required
                  className="mt-2 w-full rounded-md bg-white/10 px-3.5 py-2 text-white placeholder:text-white/50 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                {errors.nombre && <p className="text-sm text-red-400 mt-1">{errors.nombre}</p>}
              </div>

              <div>
                <label htmlFor="apellido" className="block text-sm font-semibold">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={data.apellido}
                  onChange={(e) => setData('apellido', e.target.value)}
                  required
                  className="mt-2 w-full rounded-md bg-white/10 px-3.5 py-2 text-white placeholder:text-white/50 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                {errors.apellido && <p className="text-sm text-red-400 mt-1">{errors.apellido}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-semibold">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  required
                  className="mt-2 w-full rounded-md bg-white/10 px-3.5 py-2 text-white placeholder:text-white/50 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="telefono" className="block text-sm font-semibold">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={data.telefono}
                  onChange={(e) => setData('telefono', e.target.value)}
                  className="mt-2 w-full rounded-md bg-white/10 px-3.5 py-2 text-white placeholder:text-white/50 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                {errors.telefono && <p className="text-sm text-red-400 mt-1">{errors.telefono}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="mensaje" className="block text-sm font-semibold">¿Qué tipo de colaboración ofreces?</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows="4"
                  value={data.mensaje}
                  onChange={(e) => setData('mensaje', e.target.value)}
                  required
                  placeholder="Por ejemplo: soy conductor con camión propio, flota, ramplero, etc."
                  className="mt-2 w-full rounded-md bg-white/10 px-3.5 py-2 text-white placeholder:text-white/50 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                {errors.mensaje && <p className="text-sm text-red-400 mt-1">{errors.mensaje}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/20">
              <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow transition disabled:opacity-50"
              >
                Enviar solicitud
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
