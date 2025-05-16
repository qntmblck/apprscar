import { useForm } from '@inertiajs/react'
import FlashcardFlete from '@/Components/FlashcardFlete'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { useEffect } from 'react'

export default function Fletes({ auth, fletes, role, filters, conductores, clientes, tractos }) {
  const { data, setData, get } = useForm({
    conductor_id: filters.conductor_id || '',
    cliente_id: filters.cliente_id || '',
    tracto_id: filters.tracto_id || '',
  })

  const hasFilters = data.conductor_id || data.cliente_id || data.tracto_id

  useEffect(() => {
    get(route('fletes.index'), {
      preserveState: true,
      data,
    })
  }, [data.conductor_id, data.cliente_id, data.tracto_id])

  const clearFilters = () => {
    const defaultFilters = {
      conductor_id: '',
      cliente_id: '',
      tracto_id: '',
    }

    setData(defaultFilters)
    get(route('fletes.index'), {
      preserveState: true,
      data: defaultFilters,
    })
  }

  const handleDieselSubmit = (payload) => {
    console.log('Diesel registrado:', payload)
  }

  const handleGastoSubmit = (payload) => {
    console.log('Gasto registrado:', payload)
  }

  const handleFinalizarSubmit = (payload) => {
    console.log('Flete finalizado:', payload)
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Fletes" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4">
        {(role !== 'conductor' && role !== 'cliente') && (
          <div className="mb-4 flex flex-wrap gap-2 items-end">
            <select
              value={data.conductor_id}
              onChange={e => setData('conductor_id', e.target.value)}
              className="rounded-lg shadow-sm p-2 border flex-1 min-w-0"
            >
              <option value="">Conductor</option>
              {conductores.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={data.cliente_id}
              onChange={e => setData('cliente_id', e.target.value)}
              className="rounded-lg shadow-sm p-2 border flex-1 min-w-0"
            >
              <option value="">Cliente</option>
              {clientes.map(cli => (
                <option key={cli.id} value={cli.id}>{cli.razon_social}</option>
              ))}
            </select>

            <select
              value={data.tracto_id}
              onChange={e => setData('tracto_id', e.target.value)}
              className="rounded-lg shadow-sm p-2 border flex-1 min-w-0"
            >
              <option value="">Patente</option>
              {tractos.map(t => (
                <option key={t.id} value={t.id}>{t.patente}</option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow"
              >
                Limpiar
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fletes.map(flete => (
            <FlashcardFlete
              key={flete.id}
              fleteId={flete.id}
              rendicionId={flete.rendicion?.id}
              destino={flete.destino?.nombre || 'Sin destino'}
              cliente={flete.cliente?.razon_social || 'N/A'}
              fechaSalida={flete.fecha_salida || 'N/A'}
              saldoActual={flete.rendicion?.saldo}
              onDieselSubmit={handleDieselSubmit}
              onGastoSubmit={handleGastoSubmit}
              onFinalizarSubmit={handleFinalizarSubmit}
              fletePosteriorEnMismoDia={flete.fletePosteriorEnMismoDia || false}
            />
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
