import { supabase } from '@/lib/supabase'
import { Kelurahan } from '@/types'
import LaporanForm from '@/components/forms/LaporanForm'
import Link from 'next/link'

async function getKelurahans(): Promise<Kelurahan[]> {
  const { data } = await supabase.from('kelurahan').select('*').order('name')
  return data ?? []
}

export default async function LaporanBaruPage() {
  const kelurahans = await getKelurahans()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <Link href="/" className="hover:underline text-blue-600">
          Beranda
        </Link>
        <span>/</span>
        <span className="text-gray-700">Laporkan Titik Genangan</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporkan Titik Genangan</h1>
        <p className="mt-1 text-sm text-gray-500">
          Bantu kami mencatat titik genangan di wilayah Kecamatan Lowokwaru. Laporan Anda akan
          ditinjau oleh tim pengelola sebelum ditampilkan sebagai data terverifikasi.
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-3">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-semibold mb-0.5">Informasi Pelaporan Masyarakat</p>
          <p className="text-xs text-amber-700">
            Laporan ini akan disimpan dengan status <strong>Belum Diperiksa</strong> dan sumber data{' '}
            <strong>Laporan Masyarakat</strong>. Tim pengelola akan melakukan verifikasi lapangan sebelum status diperbarui.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <LaporanForm kelurahans={kelurahans} />
      </div>
    </div>
  )
}
