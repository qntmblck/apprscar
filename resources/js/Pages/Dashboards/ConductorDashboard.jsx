import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, usePage } from '@inertiajs/react'
import {
  TruckIcon, DocumentTextIcon, PhoneIcon, ArrowRightIcon,
  ClockIcon, CheckCircleIcon, ExclamationTriangleIcon,
  UserCircleIcon, BellIcon,
} from '@heroicons/react/24/outline'

function StatChip({ label, value, color }) {
  const colors = {
    blue:   'bg-[#0094d9]/10 border-[#0094d9]/20 text-[#0094d9]',
    green:  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber:  'bg-amber-500/10 border-amber-500/20 text-amber-400',
    red:    'bg-red-500/10 border-red-500/20 text-red-400',
  }
  return (
    <div className={`${colors[color]} border rounded-xl px-4 py-3 text-center`}>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-xs mt-0.5 font-medium">{label}</p>
    </div>
  )
}

export default function ConductorDashboard() {
  const { props } = usePage()
  const user = props.auth?.user
  const firstName = user?.name?.split(' ')[0] || 'Conductor'

  const notification = props.solicitudStatus || null

  return (
    <AuthenticatedLayout>
      <Head title="Panel del Conductor" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0094d9]/30 to-[#003f8c]/20 border border-[#0094d9]/30 flex items-center justify-center">
              <UserCircleIcon className="w-8 h-8 text-[#0094d9]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0094d9] uppercase tracking-widest mb-0.5">Conductor</p>
              <h1 className="text-2xl font-extrabold text-white">Hola, {firstName} 👋</h1>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
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
                {notification.status === 'approved' ? '¡Tu solicitud fue aprobada!' : 'Tu solicitud fue revisada'}
              </p>
              {notification.admin_notes && (
                <p className="text-xs mt-1 opacity-80">{notification.admin_notes}</p>
              )}
            </div>
          </div>
        )}

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-3">
          <StatChip label="Fletes activos" value="—" color="blue" />
          <StatChip label="Rendiciones"    value="—" color="green" />
          <StatChip label="Pendientes"     value="—" color="amber" />
        </div>

        {/* Módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: TruckIcon,
              title: 'Mis fletes',
              desc: 'Consulta rutas asignadas, ventanas, datos del equipo y entregas pendientes.',
              href: '/conductor/fletes',
              color: 'blue',
            },
            {
              icon: DocumentTextIcon,
              title: 'Rendiciones',
              desc: 'Sube comprobantes, registra gastos y realiza el cierre del viaje.',
              href: '/conductor/fletes',
              color: 'green',
            },
            {
              icon: PhoneIcon,
              title: 'Soporte',
              desc: 'Contacta al equipo de operaciones ante contingencias, cambios o dudas en ruta.',
              href: 'tel:+56961068999',
              color: 'amber',
              external: true,
            },
          ].map(({ icon: Icon, title, desc, href, color, external }) => {
            const colors = {
              blue:  'from-[#0094d9]/15 to-[#003f8c]/10 border-[#0094d9]/20 hover:border-[#0094d9]/40 text-[#0094d9]',
              green: 'from-emerald-500/15 to-emerald-700/10 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400',
              amber: 'from-amber-500/15 to-amber-700/10 border-amber-500/20 hover:border-amber-500/40 text-amber-400',
            }
            const El = external ? 'a' : Link
            const extra = external ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href }
            return (
              <El key={title} {...extra} className={`group bg-gradient-to-br ${colors[color]} border rounded-2xl p-5 transition-all`}>
                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-current" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{desc}</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-current group-hover:gap-2 transition-all">
                  {external ? 'Llamar ahora' : 'Ir al módulo'} <ArrowRightIcon className="w-3.5 h-3.5" />
                </div>
              </El>
            )
          })}
        </div>

        {/* Info adicional */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-[#0094d9]" />
            Guía rápida de operación
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: CheckCircleIcon, step: '1', label: 'Revisar asignación', desc: 'Confirma destino, ventana, tracto, rampla y datos del servicio.', color: 'text-[#0094d9]' },
              { icon: TruckIcon,       step: '2', label: 'Registrar en ruta',  desc: 'Sube diesel, gastos y documentación durante el viaje.', color: 'text-emerald-400' },
              { icon: ExclamationTriangleIcon, step: '3', label: 'Cerrar respaldo', desc: 'Confirma entrega y cierra el viaje con evidencia documental.', color: 'text-amber-400' },
            ].map(({ icon: Icon, step, label, desc, color }) => (
              <div key={step} className="flex gap-3">
                <div className={`${color} w-8 h-8 rounded-full bg-black/20 border border-current/30 flex items-center justify-center shrink-0 text-xs font-bold`}>
                  {step}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AuthenticatedLayout>
  )
}
