import { useForm } from '@inertiajs/react'
import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function ContactCliente() {
  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post(route('contacto.cliente'), {
      onSuccess: () => reset(),
    })
  }

  return (
    <div className="relative isolate bg-gradient-to-b from-[#1e3a8a] to-[#0c1e3a] py-20 px-6 lg:px-8 text-white" id="clientes">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Información de contacto */}
        <div className="max-w-xl">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Solicita tu cotización
          </h2>
          <p className="mt-6 text-lg text-white/80">
            Completa el formulario y te responderemos con una propuesta personalizada lo antes posible.
          </p>
          <dl className="mt-10 space-y-4 text-base text-white/80">
            <div className="flex gap-x-4">
              <dt><BuildingOffice2Icon className="h-6 w-6 text-indigo-400" /></dt>
              <dd>Sta. Rosa de Santiago & Cam. Uno, Lampa</dd>
            </div>
            <div className="flex gap-x-4">
              <dt><PhoneIcon className="h-6 w-6 text-indigo-400" /></dt>
              <dd><a href="tel:+56944671205" className="hover:text-white">+56 9 4467 1205</a></dd>
            </div>
            <div className="flex gap-x-4">
              <dt><EnvelopeIcon className="h-6 w-6 text-indigo-400" /></dt>
              <dd><a href="mailto:contacto@scartransportes.cl" className="hover:text-white">contacto@scartransportes.cl</a></dd>
            </div>
          </dl>
        </div>

        {/* Formulario funcional */}
        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
          {recentlySuccessful && (
            <div className="p-4 rounded bg-green-500/20 border border-green-500 text-green-200 text-sm">
              ¡Tu mensaje ha sido enviado correctamente!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first_name" className="block text-sm font-semibold">Nombre</label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                className="mt-2 w-full rounded-md bg-white/10 px-3.5 py-2 text-white placeholder:text-white/50 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              {errors.first_name && <p className="text-sm text-red-400 mt-1">{errors.first_name}</p>}
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-semibold">Apellido</label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                className="mt-2 w-full rounded-md bg-white/10 px-3.5 py-2 text-white placeholder:text-white/50 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              {errors.last_name && <p className="text-sm text-red-400 mt-1">{errors.last_name}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-semibold">Correo electrónico</label>
              <input
                type="email"
                name="email"
                id="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="mt-2 w-full rounded-md bg-white/10 px-3.5 py-2 text-white placeholder:text-white/50 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm font-semibold">Teléfono</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                className="mt-2 w-full rounded-md bg-white/10 px-3.5 py-2 text-white placeholder:text-white/50 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              {errors.phone && <p className="text-sm text-red-400 mt-1">{errors.phone}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-semibold">¿En qué podemos ayudarte?</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={data.message}
                onChange={(e) => setData('message', e.target.value)}
                className="mt-2 w-full rounded-md bg-white/10 px-3.5 py-2 text-white placeholder:text-white/50 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              {errors.message && <p className="text-sm text-red-400 mt-1">{errors.message}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="rounded-md bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow transition disabled:opacity-50"
            >
              Enviar mensaje
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
