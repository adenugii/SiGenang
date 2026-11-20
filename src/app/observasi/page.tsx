import { supabase } from '@/lib/supabase'
import {
  ObservationWithLocation,
  DRAINAGE_CONDITION_LABELS,
  SEDIMENTATION_LEVEL_LABELS,
  WATER_FLOW_LABELS,
  CHANNEL_NARROWING_LABELS,
} from '@/types'
import Link from 'next/link'

async function getObservations(): Promise<ObservationWithLocation[]> {
  const { data } = await supabase
    .from('observations')
    .select(
      '*, location:locations(id, name, address, kelurahan_id, latitude, longitude, source_type, verification_status, notes, created_at, updated_at)'
    )
    .order('observed_at', { ascending: false })

  return (data ?? []) as ObservationWithLocation[]
}

export default async function ObservasiPage() {
  const observations = await getObservations()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Observasi</h1>
          <p className="mt-1 text-sm text-gray-500">{observations.length} observasi tercatat</p>
        </div>
        <Link
          href="/observasi/baru"
          className="inline-flex items-center gap-2 bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          + Tambah Observasi
        </Link>
      </div>

      {observations.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-gray-400 text-sm">Belum ada observasi yang tercatat.</p>
          <Link
            href="/observasi/baru"
            className="mt-3 inline-block text-sm text-teal-600 hover:underline"
          >
            Tambah observasi pertama →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Tanggal</th>
                <th className="px-5 py-3 text-left">Lokasi</th>
                <th className="px-5 py-3 text-left">Drainase</th>
                <th className="px-5 py-3 text-left">Sedimentasi</th>
                <th className="px-5 py-3 text-left">Aliran Air</th>
                <th className="px-5 py-3 text-left">Tinggi (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {observations.map((obs) => (
                <tr key={obs.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <Link
                      href={`/observasi/${obs.id}`}
                      className="font-medium text-teal-700 hover:underline"
                    >
                      {new Date(obs.observed_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/lokasi/${obs.location?.id}`}
                      className="text-blue-700 hover:underline"
                    >
                      {obs.location?.name ?? '—'}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {DRAINAGE_CONDITION_LABELS[obs.drainage_condition]}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {SEDIMENTATION_LEVEL_LABELS[obs.sedimentation_level]}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {WATER_FLOW_LABELS[obs.water_flow]}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {obs.water_depth_cm != null ? obs.water_depth_cm : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
