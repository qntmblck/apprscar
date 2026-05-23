import { Head, usePage } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { TruckIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

/* ─── Helpers ─────────────────────────────────────────────────── */
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'

const STATUS = {
  'En curso': { label: 'En curso',  pill: 'bg-[#0094d9]/15 text-[#0094d9] border-[#0094d9]/30' },
  'Rendido':  { label: 'Rendido',   pill: 'bg-amber-500/15 text-amber-300 border-amber-400/30' },
  'Aprobado': { label: 'Aprobado',  pill: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' },
  'Pagado':   { label: 'Pagado',    pill: 'bg-violet-500/15 text-violet-300 border-violet-400/30' },
}

/* ─── Stats bar ───────────────────────────────────────────────── */
function StatsBar({ totales }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'En curso',  value: totales.en_curso,  color: 'text-[#0094d9] bg-[#0094d9]/10 border-[#0094d9]/20' },
        { label: 'Rendidos',  value: totales.rendidos,  color: 'text-amber-300 bg-amber-500/10 border-amber-500/20' },
        { label: 'Aprobados', value: totales.aprobados, color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' },
        { label: 'Pagados',   value: totales.pagados,   color: 'text-violet-300 bg-violet-500/10 border-violet-500/20' },
      ].map(({ label, value, color }) => (
        <div key={label} className={`${color} border rounded-xl px-4 py-3 text-center`}>
          <p className="text-xl font-extrabold text-white">{value}</p>
          <p className="text-[10px] font-medium mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}

/* ─── Servicio card (read-only) ───────────────────────────────── */
function ServicioCard({ flete }) {
  const st = STATUS[flete.estado] ?? STATUS['En curso']
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:border-white/15 transition-colors">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#0094d9]/10 border border-[#0094d9]/20 flex items-center justify-center shrink-0">
            <TruckIcon className="w-4.5 h-4.5 text-[#0094d9]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs text-slate-500 font-mono">#{flete.id}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${st.pill}`}>
                {st.label}
              </span>
            </div>
            <p className="text-base font-bold text-white truncate">
              {flete.destino?.nombre ?? '—'}
            </p>
            {flete.conductor?.name && (
              <p className="text-xs text-slate-400 mt-0.5">
                Conductor: <span className="text-slate-300">{flete.conductor.name}</span>
              </p>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[10px] text-slate-500">Salida</p>
          <p className="text-xs font-semibold text-slate-300">{fmtDate(flete.fecha_salida)}</p>
          {flete.fecha_llegada && (
            <>
              <p className="text-[10px] text-slate-500 mt-1">Llegada</p>
              <p className="text-xs font-semibold text-slate-300">{fmtDate(flete.fecha_llegada)}</p>
            </>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        {flete.tracto?.patente && (
          <span className="text-[10px] bg-white/5 border border-white/10 rounded px-2 py-0.5 text-slate-400 font-mono">
            {flete.tracto.patente}
          </span>
        )}
      </div>
    </div>
  )
}

/* ─── Main ────────────────────────────────────────────────────── */
export default function ClienteServicios() {
  const { props } = usePage()
  const { fletes, totales } = props
  const lista = fletes?.data ?? fletes ?? []

  return (
    <AuthenticatedLayout>
      <Head title="Mis Fletes" />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <TruckIcon className="w-3.5 h-3.5" />
            Cliente
          </p>
          <h1 className="text-2xl font-extrabold text-white">Mis Fletes</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Historial de fletes contratados. Vista de solo lectura.
          </p>
        </div>

        {/* Stats */}
        {totales && <StatsBar totales={totales} />}

        {/* Lista */}
        {lista.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mb-4">
              <ArrowPathIcon className="w-8 h-8 text-emerald-400/40" />
            </div>
            <p className="text-slate-300 font-semibold">Sin fletes registrados</p>
            <p className="text-slate-500 text-sm mt-1">Los fletes asociados a tu empresa aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lista.map(flete => (
              <ServicioCard key={flete.id} flete={flete} />
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
