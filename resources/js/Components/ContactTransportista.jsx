export default function ContactTransportista() {
    return (
      <div className="relative bg-white">
        {/* Imagen lateral */}
        <div className="lg:absolute lg:inset-0 lg:left-1/2">
          <img
            alt="Camión de fondo"
            src="/img/dashboard/truck.jpg"
            className="h-64 w-full object-cover bg-gray-50 sm:h-80 lg:absolute lg:h-full"
          />
        </div>

        {/* Formulario */}
        <div className="pb-24 pt-16 sm:pb-32 sm:pt-24 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:pt-32">
          <div className="px-6 lg:px-8">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                ¿Eres transportista o conductor?
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                Completa el siguiente formulario y nos pondremos en contacto contigo para evaluar una posible colaboración.
              </p>

              <form method="POST" className="mt-16 space-y-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-semibold text-gray-900">
                      Nombre
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      required
                      className="mt-2 w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="apellido" className="block text-sm font-semibold text-gray-900">
                      Apellido
                    </label>
                    <input
                      id="apellido"
                      name="apellido"
                      type="text"
                      required
                      className="mt-2 w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                      Correo electrónico
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-2 w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="telefono" className="block text-sm font-semibold text-gray-900">
                      Teléfono
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      className="mt-2 w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="mensaje" className="block text-sm font-semibold text-gray-900">
                      ¿Qué tipo de servicio o colaboración ofreces?
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={4}
                      maxLength={500}
                      required
                      className="mt-2 w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="Cuéntanos brevemente si eres conductor con camión propio, ramplero, transportista con flota, etc."
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition"
                  >
                    Enviar solicitud
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
