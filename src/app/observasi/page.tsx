import { supabase } from '@/lib/supabase'
import {
  ObservationWithLocation,
  DRAINAGE_CONDITION_LABELS,
  SEDIMENTATION_LEVEL_LABELS,
  WATER_FLOW_LABELS,
  CHANNEL_NARROWING_LABELS,
} from '@/types'
import Link from 'next/link'
import { isAdmin } from '@/lib/auth'

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
  const [observations, adminLoggedIn] = await Promise.all([
    getObservations(),
    isAdmin(),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daftar Observasi Lapangan</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200/60 rounded-full">
              {observations.length} Laporan
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Hasil survei dan pemeriksaan kondisi drainase serta riwayat genangan lapangan di Lowokwaru.
          </p>
        </div>
        {adminLoggedIn && (
          <Link
            href="/observasi/baru"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-teal-500/20 hover:shadow-md hover:shadow-teal-500/25 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Observasi
          </Link>
        )}
      </div>

      {observations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 text-base">Belum ada observasi yang tercatat</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            Catat hasil survei kondisi drainase dan riwayat tinggi genangan di titik lokasi.
          </p>
          {adminLoggedIn && (
            <Link
              href="/observasi/baru"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              + Tambah Observasi Pertama Sekarang →
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 text-left">Tanggal & Waktu</th>
                  <th className="px-5 py-3.5 text-left">Titik Lokasi</th>
                  <th className="px-4 py-3.5 text-left">Drainase</th>
                  <th className="px-4 py-3.5 text-left">Sedimentasi</th>
                  <th className="px-4 py-3.5 text-left">Aliran Air</th>
                  <th className="px-4 py-3.5 text-left">Penyempitan</th>
                  <th className="px-4 py-3.5 text-left">Tinggi (cm)</th>
                  <th className="px-5 py-3.5 text-right whitespace-nowrap min-w-[90px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {observations.map((obs) => (
                  <tr key={obs.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-900">
                      <Link
                        href={`/observasi/${obs.id}`}
                        className="hover:text-teal-600 transition-colors"
                      >
                        {new Date(obs.observed_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Link>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">
                        {new Date(obs.observed_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })} WIB
                      </p>
                    </td>
                    <td className="px-5 py-4 min-w-[200px]">
                      <Link
                        href={`/lokasi/${obs.location?.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 transition-colors block"
                      >
                        {obs.location?.name ?? '—'}
                      </Link>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{obs.location?.address}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${
                        obs.drainage_condition === 'good'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : obs.drainage_condition === 'problematic'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {DRAINAGE_CONDITION_LABELS[obs.drainage_condition]}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600">
                      {SEDIMENTATION_LEVEL_LABELS[obs.sedimentation_level]}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600">
                      {WATER_FLOW_LABELS[obs.water_flow]}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600">
                      {CHANNEL_NARROWING_LABELS[obs.channel_narrowing]}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {obs.water_depth_cm != null ? (
                        <span className="font-semibold text-slate-800">{obs.water_depth_cm} cm</span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        href={`/observasi/${obs.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-800 bg-teal-50/80 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Detail →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
