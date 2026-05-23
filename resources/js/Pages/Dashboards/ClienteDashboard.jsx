import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, usePage } from '@inertiajs/react'
import {
  TruckIcon, DocumentTextIcon, ArrowRightIcon,
  UserCircleIcon, BellIcon, CheckCircleIcon,
  MapPinIcon, ClipboardDocumentListIcon, StarIcon,
} from '@heroicons/react/24/outline'

export default function ClienteDashboard() {
  const { props } = usePage()
  const user = props.auth?.user
  const firstName = user?.name?.split(' ')[0] || 'Cliente'
  const notification = props.solicitudStatus || null

  return (
    <AuthenticatedLayout>
      <Head title="Panel del Cliente" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-700/20 border border-emerald-500/30 flex items-center justify-center">
            <UserCircleIcon className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-0.5">Cliente</p>
            <h1 className="text-2xl font-extrabold text-white">Hola, {firstName} 👋</h1>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>

        {/* Notificación de solicitud */}
        {notification && (
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${
            notification.status === 'approved'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            <BellIcon className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">
                {notification.status === 'approved'
                  ? '¡Tu solicitud de transporte fue aprobada!'
                  : 'Tu solicitud de transporte fue revisada'}
              </p>
              {notification.admin_notes && (
                <p className="text-xs mt-1 opacity-80">{notification.admin_notes}</p>
              )}
            </div>
          </div>
        )}

        {/* Módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: TruckIcon,
              title: 'Mis fletes',
              desc: 'Revisa el estado y trazabilidad de tus embarques activos e históricos.',
              href: '/cliente/servicios',
              color: 'emerald',
            },
            {
              icon: ClipboardDocumentListIcon,
              title: 'Solicitar transporte',
              desc: 'Ingresa origen, destino, volumen y ventana para evaluar el esquema más conveniente.',
              href: '/contacto#clientes',
              color: 'blue',
            },
            {
              icon: DocumentTextIcon,
              title: 'Documentos',
              desc: 'Accede a guías de ruta, comprobantes y documentación de tus operaciones.',
              href: '/profile',
              color: 'amber',
            },
          ].map(({ icon: Icon, title, desc, href, color }) => {
            const colors = {
              emerald: 'from-emerald-500/15 to-emerald-700/10 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400',
              blue:    'from-[#0094d9]/15 to-[#003f8c]/10 border-[#0094d9]/20 hover:border-[#0094d9]/40 text-[#0094d9]',
              amber:   'from-amber-500/15 to-amber-700/10 border-amber-500/20 hover:border-amber-500/40 text-amber-400',
            }
            return (
              <Link key={title} href={href} className={`group bg-gradient-to-br ${colors[color]} border rounded-2xl p-5 transition-all`}>
                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-current" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{desc}</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-current group-hover:gap-2 transition-all">
                  Ir al módulo <ArrowRightIcon className="w-3.5 h-3.5" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <StarIcon className="w-4 h-4 text-emerald-400" />
              Tu operación con SCAR
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              {[
                'Cobertura nacional coordinada en 16 regiones',
                'Trazabilidad por hitos y control operacional',
                'Criterios de seguridad, cumplimiento y documentación',
                'Coordinación directa con equipo operativo',
                'Carga consolidada para volúmenes parciales',
              ].map(b => (
                <li key={b} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />{b}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-[#0094d9]" />
              Contacto operacional
            </h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div>
                <p className="font-semibold text-white">Laura (coordinación)</p>
                <a href="tel:+56961068999" className="text-[#0094d9] hover:underline">+56 9 6106 8999</a>
              </div>
              <div>
                <p className="font-semibold text-white">Pablo (operaciones)</p>
                <a href="tel:+56949023562" className="text-[#0094d9] hover:underline">+56 9 4902 3562</a>
              </div>
              <div>
                <p className="font-semibold text-white">Correo</p>
                <a href="mailto:contacto@scartransportes.cl" className="text-[#0094d9] hover:underline">contacto@scartransportes.cl</a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA consolidado */}
        <div className="bg-gradient-to-br from-[#0094d9]/10 to-[#003f8c]/10 border border-[#0094d9]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">Carga consolidada para volúmenes parciales</p>
            <p className="text-xs text-slate-400 mt-1">Comparte capacidad en rutas compatibles y evita sobredimensionar el flete.</p>
          </div>
          <Link href="/contacto#clientes"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0094d9]/20 hover:bg-[#0094d9]/30 border border-[#0094d9]/30 text-[#0094d9] hover:text-white text-xs font-semibold transition-all">
            Cotizar ahora <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </AuthenticatedLayout>
  )
}
