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
import { isAdmin } from '@/lib/auth'

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
  const [observation, adminLoggedIn] = await Promise.all([
    getObservation(id),
    isAdmin(),
  ])
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
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 flex items-center gap-1.5 flex-wrap font-medium">
        <Link href="/observasi" className="hover:underline text-teal-600">
          Observasi
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-700">
          {new Date(observation.observed_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60 rounded-full">
                Laporan Observasi
              </span>
              <span className="text-xs text-slate-400">
                {new Date(observation.observed_at).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} WIB
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Pemeriksaan – {new Date(observation.observed_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <span>Lokasi Terkait:</span>
              <Link
                href={`/lokasi/${observation.location?.id}`}
                className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
              >
                {observation.location?.name ?? '—'}
              </Link>
            </div>
          </div>
        </div>

        {/* Riwayat genangan */}
        {observation.flood_history && (
          <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Riwayat / Kondisi Genangan
            </p>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{observation.flood_history}</p>
          </div>
        )}

        {/* Grid kondisi */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Parameter Kondisi Fisik Drainase
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fields.map((f) => (
              <div key={f.label} className="bg-slate-50/70 border border-slate-100/80 rounded-xl p-3.5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  {f.label}
                </p>
                <p className="text-sm font-semibold text-slate-800">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Catatan */}
        {observation.notes && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
              Catatan Tambahan
            </p>
            <p className="text-sm text-slate-700 bg-slate-50/50 border border-slate-100 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
              {observation.notes}
            </p>
          </div>
        )}

        {/* Foto */}
        {observation.photo_url && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Foto Dokumentasi</p>
            <div className="rounded-xl overflow-hidden border border-slate-200 inline-block bg-slate-50">
              <img
                src={observation.photo_url}
                alt="Foto observasi"
                className="max-w-full max-h-80 object-contain"
              />
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="text-xs text-slate-400 pt-3 border-t border-slate-100">
          Dicatat ke dalam sistem pada:{' '}
          <span className="font-medium text-slate-600">
            {new Date(observation.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })} WIB
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap pt-2 border-t border-slate-100 items-center">
          <Link
            href={`/lokasi/${observation.location?.id}`}
            className="text-sm font-semibold border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            ← Kembali ke Detail Lokasi
          </Link>
          <Link
            href="/observasi"
            className="text-sm font-medium text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Daftar Observasi
          </Link>
          {adminLoggedIn && (
            <div className="ml-auto">
              <DeleteObservasiButton id={observation.id} locationId={observation.location_id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
