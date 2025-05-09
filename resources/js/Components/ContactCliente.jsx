import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function ContactCliente() {
  return (
    <div className="relative isolate bg-gray-900" id="clientes">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Información de contacto (lado izquierdo) */}
        <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <h2 className="text-pretty text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Solicita tu cotización
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Completa el formulario y te responderemos con una propuesta personalizada lo antes posible. También puedes llamarnos o escribirnos directamente.
            </p>
            <dl className="mt-10 space-y-4 text-base leading-7 text-gray-300">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <BuildingOffice2Icon className="h-7 w-6 text-gray-400" aria-hidden="true" />
                </dt>
                <dd>
                  Sta. Rosa de Santiago & Cam. Uno<br />
                  Lampa, Región Metropolitana
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <PhoneIcon className="h-7 w-6 text-gray-400" aria-hidden="true" />
                </dt>
                <dd>
                  <a href="tel:+56944671205" className="hover:text-white">+56 9 4467 1205</a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <EnvelopeIcon className="h-7 w-6 text-gray-400" aria-hidden="true" />
                </dt>
                <dd>
                  <a href="mailto:contacto@scartransportes.cl" className="hover:text-white">
                    contacto@scartransportes.cl
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Formulario (lado derecho) */}
        <form method="POST" className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className="block text-sm font-semibold text-white">
                  Nombre
                </label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="mt-2 w-full rounded-md bg-white/5 px-3.5 py-2 text-white text-base outline outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-semibold text-white">
                  Apellido
                </label>
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  className="mt-2 w-full rounded-md bg-white/5 px-3.5 py-2 text-white text-base outline outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-semibold text-white">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="mt-2 w-full rounded-md bg-white/5 px-3.5 py-2 text-white text-base outline outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-white">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  autoComplete="tel"
                  className="mt-2 w-full rounded-md bg-white/5 px-3.5 py-2 text-white text-base outline outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-semibold text-white">
                  ¿En qué podemos ayudarte?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-2 w-full rounded-md bg-white/5 px-3.5 py-2 text-white text-base outline outline-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-500"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Enviar mensaje
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
