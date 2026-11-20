import { supabase } from '@/lib/supabase'
import {
  ObservationWithLocation,
  DRAINAGE_CONDITION_LABELS,
  SEDIMENTATION_LEVEL_LABELS,
  WATER_FLOW_LABELS,
  CHANNEL_NARROWING_LABELS,
} from '@/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import DeleteObservasiButton from './DeleteObservasiButton'

async function getObservation(id: string): Promise<ObservationWithLocation | null> {
  const { data } = await supabase
    .from('observations')
    .select(
      '*, location:locations(id, name, address, kelurahan_id, latitude, longitude, source_type, verification_status, notes, created_at, updated_at)'
    )
    .eq('id', id)
    .single()

  return data as ObservationWithLocation | null
}

export default async function ObservasiDetailPage({ params }: PageProps<'/observasi/[id]'>) {
  const { id } = await params
  const observation = await getObservation(id)
  if (!observation) return notFound()

  const fields = [
    { label: 'Kondisi Drainase', value: DRAINAGE_CONDITION_LABELS[observation.drainage_condition] },
    { label: 'Sedimentasi', value: SEDIMENTATION_LEVEL_LABELS[observation.sedimentation_level] },
    { label: 'Kelancaran Aliran', value: WATER_FLOW_LABELS[observation.water_flow] },
    { label: 'Penyempitan Saluran', value: CHANNEL_NARROWING_LABELS[observation.channel_narrowing] },
    {
      label: 'Tinggi Genangan',
      value: observation.water_depth_cm != null ? `${observation.water_depth_cm} cm` : 'Tidak diketahui',
    },
  ]

  return (
    <div className="max-w-2xl space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
        <Link href="/observasi" className="hover:underline text-teal-600">
          Observasi
        </Link>
        <span>/</span>
        <span className="text-gray-700">
          {new Date(observation.observed_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Observasi –{' '}
            {new Date(observation.observed_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <span>Lokasi:</span>
            <Link
              href={`/lokasi/${observation.location?.id}`}
              className="text-blue-600 hover:underline font-medium"
            >
              {observation.location?.name ?? '—'}
            </Link>
          </div>
        </div>

        {/* Riwayat genangan */}
        {observation.flood_history && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
              Riwayat / Kondisi Genangan
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{observation.flood_history}</p>
          </div>
        )}

        {/* Grid kondisi */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {fields.map((f) => (
            <div key={f.label}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                {f.label}
              </p>
              <p className="text-sm text-gray-800">{f.value}</p>
            </div>
          ))}
        </div>

        {/* Catatan */}
        {observation.notes && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
              Catatan
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{observation.notes}</p>
          </div>
        )}

        {/* Foto */}
        {observation.photo_url && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Foto</p>
            <img
              src={observation.photo_url}
              alt="Foto observasi"
              className="rounded-lg max-w-full max-h-64 object-contain border border-gray-200"
            />
          </div>
        )}

        {/* Meta */}
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
          Dicatat:{' '}
          {new Date(observation.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          } as any)}
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap pt-1">
          <Link
            href={`/lokasi/${observation.location?.id}`}
            className="text-sm border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Kembali ke Lokasi
          </Link>
          <DeleteObservasiButton id={observation.id} locationId={observation.location_id} />
        </div>
      </div>
    </div>
  )
}
