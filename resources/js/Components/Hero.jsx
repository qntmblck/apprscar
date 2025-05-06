import React from 'react';

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex items-center text-white py-24 sm:py-32 min-h-[70vh] sm:min-h-[80vh]"
      style={{
        backgroundImage: "url('/img/dashboard/truck.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll', // mobile
      }}
    >
      {/* Fondo con efecto parallax solo en desktop */}
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/dashboard/truck.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      {/* Contenido del Hero */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 text-center sm:text-left">
        <div className="max-w-xl mx-auto sm:mx-0">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Tu carga, nuestra misión
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-gray-200">
            Más de 25 años de experiencia en transporte de carga por carretera en Chile, con cobertura de Arica a Punta Arenas.
          </p>
          <div className="mt-6 sm:mt-10">
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
