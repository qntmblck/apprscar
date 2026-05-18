import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, usePage } from '@inertiajs/react'
import {
  TruckIcon, DocumentTextIcon, ArrowRightIcon,
  UserCircleIcon, BellIcon, CheckCircleIcon, ClockIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'

export default function ColaboradorDashboard() {
  const { props } = usePage()
  const user = props.auth?.user
  const firstName = user?.name?.split(' ')[0] || 'Colaborador'
  const notification = props.solicitudStatus || null

  return (
    <AuthenticatedLayout>
      <Head title="Panel del Colaborador" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-indigo-700/20 border border-indigo-500/30 flex items-center justify-center">
            <BuildingOfficeIcon className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-0.5">Colaborador</p>
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
                  ? '¡Tu solicitud de integración fue aprobada!'
                  : 'Tu solicitud de integración fue revisada'}
              </p>
              {notification.admin_notes && (
                <p className="text-xs mt-1 opacity-80">{notification.admin_notes}</p>
              )}
            </div>
          </div>
        )}

        {/* Módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: TruckIcon,
              title: 'Fletes asignados',
              desc: 'Revisa los fletes en los que participas como colaborador de flota.',
              href: '/fletes',
              color: 'indigo',
            },
            {
              icon: DocumentTextIcon,
              title: 'Mis documentos',
              desc: 'Accede a documentación operacional, guías de ruta y comprobantes.',
              href: '/profile',
              color: 'blue',
            },
          ].map(({ icon: Icon, title, desc, href, color }) => {
            const colors = {
              indigo: 'from-indigo-500/15 to-indigo-700/10 border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400',
              blue:   'from-[#0094d9]/15 to-[#003f8c]/10 border-[#0094d9]/20 hover:border-[#0094d9]/40 text-[#0094d9]',
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
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-indigo-400" />
            Tu alianza con SCAR
          </h3>
          <ul className="space-y-2 text-xs text-slate-400">
            {[
              'Integración a rutas nacionales de distribución B2B',
              'Coordinación operacional con seguimiento de carga',
              'Acceso a clientes de gran formato (retail, industria)',
              'Protocolos estandarizados y respaldo documental',
              'Crecimiento de flota con demanda sostenida',
            ].map(b => (
              <li key={b} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />{b}
              </li>
            ))}
          </ul>
        </div>

        {/* Solicitar integración */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-[#003f8c]/10 border border-indigo-500/20 rounded-2xl p-6 text-center">
          <ClockIcon className="w-8 h-8 mx-auto mb-3 text-indigo-400/60" />
          <p className="text-sm font-semibold text-white mb-1">¿Tienes más flota disponible?</p>
          <p className="text-xs text-slate-400 mb-4">Envíanos una nueva solicitud de integración y amplía tu participación.</p>
          <Link href="/contacto#colaboradores"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold transition-all">
            Solicitar integración de flota
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </AuthenticatedLayout>
  )
}
