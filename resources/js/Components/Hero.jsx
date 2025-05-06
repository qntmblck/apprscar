import React from 'react';

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex items-center text-white py-32 min-h-[80vh]"
      style={{
        backgroundImage: "url('/img/dashboard/truck.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Capa oscura */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Contenido del Hero alineado a la izquierda pero centrado */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 text-left">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Tu carga, nuestra misión
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-200">
            Más de 25 años de experiencia en transporte de carga por carretera en Chile, con cobertura de Arica a Punta Arenas.
          </p>
          <div className="mt-10">
            <a
              href="#contacto"
              className="inline-block rounded-md border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-600 hover:border-indigo-600 transition"
            >
              Cotiza tu Servicio →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
