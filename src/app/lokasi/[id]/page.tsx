import { supabase } from '@/lib/supabase'
import {
  LocationWithKelurahan,
  Observation,
  SOURCE_TYPE_LABELS,
  VERIFICATION_STATUS_LABELS,
  VERIFICATION_STATUS_COLORS,
  DRAINAGE_CONDITION_LABELS,
  SEDIMENTATION_LEVEL_LABELS,
  WATER_FLOW_LABELS,
  CHANNEL_NARROWING_LABELS,
} from '@/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import DeleteLocationButton from './DeleteLocationButton'
import { isAdmin } from '@/lib/auth'

async function getLocationDetail(id: string) {
  const [{ data: location }, { data: observations }] = await Promise.all([
    supabase
      .from('locations')
      .select('*, kelurahan(id, name, created_at)')
      .eq('id', id)
      .single(),
    supabase
      .from('observations')
      .select('*')
      .eq('location_id', id)
      .order('observed_at', { ascending: false }),
  ])

  return {
    location: location as LocationWithKelurahan | null,
    observations: (observations ?? []) as Observation[],
  }
}

export default async function LokasiDetailPage({ params }: PageProps<'/lokasi/[id]'>) {
  const { id } = await params
  const [{ location, observations }, adminLoggedIn] = await Promise.all([
    getLocationDetail(id),
    isAdmin(),
  ])

  if (!location) return notFound()

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <Link href="/lokasi" className="hover:underline text-blue-600">
          Lokasi
        </Link>
        <span>/</span>
        <span className="text-gray-700">{location.name}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{location.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{location.address}</p>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${VERIFICATION_STATUS_COLORS[location.verification_status]}`}
          >
            {VERIFICATION_STATUS_LABELS[location.verification_status]}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Kelurahan</p>
            <p className="text-gray-800 mt-0.5">{location.kelurahan?.name ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Koordinat</p>
            <p className="text-gray-800 mt-0.5">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Sumber Data</p>
            <p className="text-gray-800 mt-0.5">
              {SOURCE_TYPE_LABELS[location.source_type] ?? location.source_type}
            </p>
          </div>
          {location.notes && (
            <div className="col-span-full">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Catatan</p>
              <p className="text-gray-800 mt-0.5 whitespace-pre-wrap">{location.notes}</p>
            </div>
          )}
          {location.photo_url && (
            <div className="col-span-full pt-2">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
                Foto Gambaran Titik Lokasi
              </p>
              <div className="rounded-xl overflow-hidden border border-gray-200 inline-block bg-slate-50">
                <img
                  src={location.photo_url}
                  alt={`Foto ${location.name}`}
                  className="max-w-full max-h-72 object-contain rounded-lg"
                />
              </div>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Ditambahkan</p>
            <p className="text-gray-800 mt-0.5">
              {new Date(location.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Diperbarui</p>
            <p className="text-gray-800 mt-0.5">
              {new Date(location.updated_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="pt-2 flex gap-3 flex-wrap">
          {adminLoggedIn && (
            <>
              <Link
                href={`/lokasi/${location.id}/edit`}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Lokasi
              </Link>
              <Link
                href={`/observasi/baru?location_id=${location.id}`}
                className="text-sm bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                + Tambah Observasi
              </Link>
            </>
          )}
          <Link
            href={`/peta`}
            className="text-sm border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Lihat di Peta
          </Link>
          {adminLoggedIn && <DeleteLocationButton id={location.id} />}
        </div>
      </div>

      {/* Daftar observasi */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Riwayat Observasi ({observations.length})
          </h2>
        </div>

        {observations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-400 text-sm">Belum ada observasi untuk lokasi ini.</p>
            {adminLoggedIn && (
              <Link
                href={`/observasi/baru?location_id=${location.id}`}
                className="mt-2 inline-block text-sm text-blue-600 hover:underline"
              >
                Tambah observasi pertama →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {observations.map((obs) => (
              <Link
                key={obs.id}
                href={`/observasi/${obs.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {new Date(obs.observed_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    {obs.flood_history && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{obs.flood_history}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    Drainase: {DRAINAGE_CONDITION_LABELS[obs.drainage_condition]}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                  {obs.water_depth_cm != null && (
                    <span>Tinggi genangan: {obs.water_depth_cm} cm</span>
                  )}
                  <span>Sedimentasi: {SEDIMENTATION_LEVEL_LABELS[obs.sedimentation_level]}</span>
                  <span>Aliran: {WATER_FLOW_LABELS[obs.water_flow]}</span>
                  <span>Penyempitan: {CHANNEL_NARROWING_LABELS[obs.channel_narrowing]}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
