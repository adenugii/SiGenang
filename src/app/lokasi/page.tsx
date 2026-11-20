import { supabase } from '@/lib/supabase'
import {
  LocationWithKelurahan,
  Kelurahan,
  SOURCE_TYPE_LABELS,
  VERIFICATION_STATUS_LABELS,
  VERIFICATION_STATUS_COLORS,
} from '@/types'
import Link from 'next/link'
import CustomSelect from '@/components/ui/CustomSelect'

async function getLokasiData(kelurahanId?: number, search?: string) {
  let query = supabase
    .from('locations')
    .select('*, kelurahan(id, name, created_at)')
    .order('created_at', { ascending: false })

  if (kelurahanId) {
    query = query.eq('kelurahan_id', kelurahanId)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error } = await query
  return { locations: (data ?? []) as LocationWithKelurahan[], error }
}

async function getKelurahans(): Promise<Kelurahan[]> {
  const { data } = await supabase.from('kelurahan').select('*').order('name')
  return data ?? []
}

export default async function LokasiPage({
  searchParams,
}: PageProps<'/lokasi'>) {
  const params = await searchParams
  const kelurahanId = params.kelurahan ? parseInt(params.kelurahan as string) : undefined
  const search = params.q as string | undefined

  const [{ locations, error }, kelurahans] = await Promise.all([
    getLokasiData(kelurahanId, search),
    getKelurahans(),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Titik Genangan</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full">
              {locations.length} Lokasi
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Daftar titik inventarisasi genangan dan kondisi drainase di wilayah Kecamatan Lowokwaru.
          </p>
        </div>
        <Link
          href="/lokasi/baru"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/25 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Titik Lokasi
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs relative z-20">
        <form method="GET" className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Wilayah Kelurahan</label>
            <CustomSelect
              name="kelurahan"
              defaultValue={kelurahanId ?? ''}
              placeholder="Semua Kelurahan (12 Kelurahan)"
              options={kelurahans.map((k) => ({
                value: k.id,
                label: `Kelurahan ${k.name}`,
              }))}
            />
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Pencarian Nama / Ruas Jalan</label>
            <input
              name="q"
              defaultValue={search ?? ''}
              type="text"
              placeholder="Contoh: Jl. Cengkeh, Kedawung..."
              className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="text-sm font-medium bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-xl transition-all shadow-xs"
          >
            Terapkan
          </button>
          {(kelurahanId || search) && (
            <Link
              href="/lokasi"
              className="text-sm font-medium text-slate-500 hover:text-slate-800 px-3 py-2 transition-colors"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-sm text-amber-900 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold">Koneksi Database: {error.message}</p>
            <p className="text-xs text-amber-700 mt-1">
              Catatan: Pastikan kebijakan RLS (Row Level Security) atau hak akses tabel <code>locations</code> di Supabase SQL Editor telah diaktifkan untuk peran anon.
            </p>
          </div>
        </div>
      )}

      {locations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 text-base">Belum ada lokasi tercatat</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            Mulai inventarisasi titik genangan air dengan menambahkan titik lokasi koordinat baru.
          </p>
          <Link
            href="/lokasi/baru"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            + Tambah Titik Pertama Sekarang →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 text-left">Nama Lokasi & Alamat</th>
                  <th className="px-4 py-3.5 text-left">Kelurahan</th>
                  <th className="px-4 py-3.5 text-left">Sumber Data</th>
                  <th className="px-4 py-3.5 text-left min-w-[190px]">Status Verifikasi</th>
                  <th className="px-4 py-3.5 text-left whitespace-nowrap">Koordinat</th>
                  <th className="px-5 py-3.5 text-right whitespace-nowrap min-w-[90px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 min-w-[220px]">
                      <Link
                        href={`/lokasi/${loc.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 transition-colors block"
                      >
                        {loc.name}
                      </Link>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{loc.address}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                        {loc.kelurahan?.name ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600 whitespace-nowrap">
                      {SOURCE_TYPE_LABELS[loc.source_type] ?? loc.source_type}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium border ${VERIFICATION_STATUS_COLORS[loc.verification_status]}`}
                      >
                        {VERIFICATION_STATUS_LABELS[loc.verification_status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {loc.latitude.toFixed(5)}, {loc.longitude.toFixed(5)}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        href={`/lokasi/${loc.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
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
