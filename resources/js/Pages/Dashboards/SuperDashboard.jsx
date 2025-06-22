import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link as InertiaLink } from '@inertiajs/react';

export default function SuperDashboard() {
  const { summary, actividadReciente } = usePage().props;
  const {
    fletesRealizados = 0,
    conductoresActivos = 0,
    solicitudesMantencion = 0,
  } = summary || {};

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard SuperAdmin" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resumen general */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Resumen general
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Fletes realizados</p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {fletesRealizados}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Conductores activos</p>
                  <p className="text-2xl font-bold text-green-700">
                    {conductoresActivos}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">
                    Solicitudes de mantención
                  </p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {solicitudesMantencion}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Panel de administración */}
          <section>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Panel de administración
              </h2>
              <ul className="space-y-2 text-sm text-indigo-700">
                <li>
                  <InertiaLink
                    href="/usuarios"
                    className="hover:underline font-medium"
                  >
                    Gestionar usuarios
                  </InertiaLink>
                </li>
                <li>
                  <InertiaLink
                    href="/fletes"
                    className="hover:underline font-medium"
                  >
                    Revisar fletes
                  </InertiaLink>
                </li>
                <li>
                  <InertiaLink
                    href="/reportes"
                    className="hover:underline font-medium"
                  >
                    Ver reportes
                  </InertiaLink>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Actividad reciente */}
        <div className="space-y-6">
          <section>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Actividad reciente
              </h2>
              <ul className="text-sm text-gray-700 space-y-2">
                {actividadReciente && actividadReciente.length ? (
                  actividadReciente.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))
                ) : (
                  <li>No hay actividad reciente.</li>
                )}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
