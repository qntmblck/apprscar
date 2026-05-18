import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, usePage } from '@inertiajs/react'
import {
  TruckIcon, UsersIcon, ChartBarIcon, ArrowRightIcon,
  ClipboardDocumentCheckIcon, WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'

function Card({ icon: Icon, title, desc, href, color = 'blue' }) {
  const colors = {
    blue:  'from-[#0094d9]/15 to-[#003f8c]/10 border-[#0094d9]/20 hover:border-[#0094d9]/40',
    green: 'from-emerald-500/15 to-emerald-700/10 border-emerald-500/20 hover:border-emerald-500/40',
    amber: 'from-amber-500/15 to-amber-700/10 border-amber-500/20 hover:border-amber-500/40',
  }
  const iconColors = { blue: 'text-[#0094d9]', green: 'text-emerald-400', amber: 'text-amber-400' }

  return (
    <Link href={href} className={`group bg-gradient-to-br ${colors[color]} border rounded-2xl p-6 hover:bg-opacity-80 transition-all`}>
      <div className={`w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center mb-4 ${iconColors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className={`text-sm font-bold mb-2 ${iconColors[color]}`}>{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed mb-3">{desc}</p>
      <div className={`flex items-center gap-1 text-xs font-semibold ${iconColors[color]} group-hover:gap-2 transition-all`}>
        Ir al módulo <ArrowRightIcon className="w-3.5 h-3.5" />
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const { props } = usePage()
  const user = props.auth?.user

  return (
    <AuthenticatedLayout>
      <Head title="Panel del Administrador" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        <div>
          <p className="text-xs font-semibold text-[#0094d9] uppercase tracking-widest mb-1">Administrador</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Hola, {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">Gestiona operaciones, usuarios y reportes desde este panel.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card
            icon={TruckIcon}
            title="Fletes operacionales"
            desc="Supervisa los fletes en curso, asigna conductores, tractos y ramplas. Controla estados y trazabilidad."
            href="/fletes"
            color="blue"
          />
          <Card
            icon={UsersIcon}
            title="Usuarios y roles"
            desc="Revisa los usuarios registrados en el sistema. Coordina con superadmin para gestión de roles."
            href="/usuarios"
            color="green"
          />
          <Card
            icon={ChartBarIcon}
            title="Reportes operacionales"
            desc="Accede a estadísticas históricas, exporta Excel y genera liquidaciones de pagos por período."
            href="/fletes"
            color="amber"
          />
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#0094d9]/10 flex items-center justify-center">
                <ClipboardDocumentCheckIcon className="w-5 h-5 text-[#0094d9]" />
              </div>
              <h3 className="text-sm font-bold text-white">Gestión de fletes</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              {[
                'Crear y asignar nuevos fletes',
                'Actualizar estados operacionales',
                'Registrar gastos, diesel y rendiciones',
                'Exportar reportes en Excel/PDF',
                'Gestionar liquidaciones de conductores',
              ].map(b => (
                <li key={b} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0094d9] shrink-0" />{b}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <WrenchScrewdriverIcon className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Acciones rápidas</h3>
            </div>
            <div className="space-y-2">
              {[
                { href: '/fletes',   label: 'Ver todos los fletes' },
                { href: '/profile',  label: 'Editar mi perfil' },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-[#0094d9]/10 border border-white/5 hover:border-[#0094d9]/30 text-slate-300 hover:text-white transition-all group text-xs font-medium">
                  {label}
                  <ArrowRightIcon className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#0094d9] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AuthenticatedLayout>
  )
}
