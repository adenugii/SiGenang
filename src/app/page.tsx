import { supabase } from '@/lib/supabase'
import {
  LocationWithKelurahan,
  ObservationWithLocation,
  SOURCE_TYPE_LABELS,
  VERIFICATION_STATUS_LABELS,
  VERIFICATION_STATUS_COLORS,
  DRAINAGE_CONDITION_LABELS,
} from '@/types'
import Link from 'next/link'

async function getDashboardData() {
  const [
    { count: totalLocations },
    { count: totalObservations },
    { data: locationsByStatus },
    { data: locationsBySource },
    { data: recentLocations },
    { data: recentObservations },
  ] = await Promise.all([
    supabase.from('locations').select('*', { count: 'exact', head: true }),
    supabase.from('observations').select('*', { count: 'exact', head: true }),
    supabase.from('locations').select('verification_status'),
    supabase.from('locations').select('source_type'),
    supabase
      .from('locations')
      .select('*, kelurahan(id, name, created_at)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('observations')
      .select('*, location:locations(id, name, address, kelurahan_id, latitude, longitude, source_type, verification_status, notes, created_at, updated_at)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // Count by verification_status
  const statusCount: Record<string, number> = {}
  for (const loc of locationsByStatus ?? []) {
    statusCount[loc.verification_status] = (statusCount[loc.verification_status] ?? 0) + 1
  }

  // Count by source_type
  const sourceCount: Record<string, number> = {}
  for (const loc of locationsBySource ?? []) {
    sourceCount[loc.source_type] = (sourceCount[loc.source_type] ?? 0) + 1
  }

  return {
    totalLocations: totalLocations ?? 0,
    totalObservations: totalObservations ?? 0,
    statusCount,
    sourceCount,
    recentLocations: (recentLocations ?? []) as LocationWithKelurahan[],
    recentObservations: (recentObservations ?? []) as ObservationWithLocation[],
  }
}

function StatsCard({
  label,
  value,
  color,
  href,
}: {
  label: string
  value: number
  color: string
  href?: string
}) {
  const inner = (
    <div className={`rounded-2xl border p-5 ${color} flex flex-col justify-between transition-all duration-200 hover:shadow-sm`}>
      <span className="text-3xl font-extrabold tracking-tight">{value}</span>
      <span className="text-xs font-semibold uppercase tracking-wider opacity-90 mt-2">{label}</span>
    </div>
  )
  if (href) return <Link href={href} className="group block">{inner}</Link>
  return inner
}

export default async function DashboardPage() {
  const { totalLocations, totalObservations, statusCount, sourceCount, recentLocations, recentObservations } =
    await getDashboardData()

  return (
    <div className="space-y-8">
      {/* Banner Ringkasan */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Sistem Informasi Genangan Malang · Web GIS
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Inventarisasi & Analisis Drainase Lowokwaru
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Pusat data terintegrasi titik genangan air hujan, pemantauan sedimentasi saluran drainase, dan riwayat observasi faktual di 12 kelurahan.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/peta"
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Buka Peta Interaktif
            </Link>
            <Link
              href="/lokasi/baru"
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
            >
              + Tambah Titik Genangan
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          label="Total Titik Genangan"
          value={totalLocations}
          color="bg-white border-slate-200 text-blue-600 shadow-xs"
          href="/lokasi"
        />
        <StatsCard
          label="Laporan Observasi"
          value={totalObservations}
          color="bg-white border-slate-200 text-cyan-600 shadow-xs"
          href="/observasi"
        />
        <StatsCard
          label="Terverifikasi"
          value={statusCount['verified'] ?? 0}
          color="bg-white border-slate-200 text-emerald-600 shadow-xs"
        />
        <StatsCard
          label="Perlu Tindak Lanjut"
          value={statusCount['needs_follow_up'] ?? 0}
          color="bg-white border-slate-200 text-amber-600 shadow-xs"
        />
      </div>

      {/* Status & Sumber */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Status pemeriksaan */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 text-base">Status Verifikasi Lapangan</h2>
            <span className="text-xs text-slate-400">Distribusi status</span>
          </div>
          <div className="space-y-3">
            {(['unverified', 'verified', 'needs_follow_up'] as const).map((s) => (
              <div key={s} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${VERIFICATION_STATUS_COLORS[s]}`}>
                  {VERIFICATION_STATUS_LABELS[s]}
                </span>
                <span className="font-bold text-slate-800">{statusCount[s] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sumber data */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 text-base">Komposisi Sumber Data</h2>
            <span className="text-xs text-slate-400">Metode input</span>
          </div>
          <div className="space-y-3">
            {(['secondary', 'field_observation', 'community_report'] as const).map((s) => (
              <div key={s} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-700">{SOURCE_TYPE_LABELS[s]}</span>
                <span className="font-bold text-slate-800">{sourceCount[s] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dua Kolom Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lokasi terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base">Titik Genangan Terbaru</h2>
            <Link href="/lokasi" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
              Lihat semua →
            </Link>
          </div>
          {recentLocations.length === 0 ? (
            <p className="p-6 text-sm text-slate-400 text-center">Belum ada titik lokasi genangan.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLocations.map((loc) => (
                <Link
                  key={loc.id}
                  href={`/lokasi/${loc.id}`}
                  className="flex items-start justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{loc.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kel. {loc.kelurahan?.name} · {loc.address}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${VERIFICATION_STATUS_COLORS[loc.verification_status]}`}
                  >
                    {VERIFICATION_STATUS_LABELS[loc.verification_status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Observasi terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base">Observasi Lapangan Terbaru</h2>
            <Link href="/observasi" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
              Lihat semua →
            </Link>
          </div>
          {recentObservations.length === 0 ? (
            <p className="p-6 text-sm text-slate-400 text-center">Belum ada catatan observasi lapangan.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentObservations.map((obs) => (
                <Link
                  key={obs.id}
                  href={`/observasi/${obs.id}`}
                  className="flex items-start justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {obs.location?.name ?? '—'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(obs.observed_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Kondisi: {DRAINAGE_CONDITION_LABELS[obs.drainage_condition]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
