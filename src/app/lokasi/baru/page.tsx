import { supabase } from '@/lib/supabase'
import { Kelurahan } from '@/types'
import LokasiForm from '@/components/forms/LokasiForm'
import Link from 'next/link'

async function getKelurahans(): Promise<Kelurahan[]> {
  const { data } = await supabase.from('kelurahan').select('*').order('name')
  return data ?? []
}

export default async function LokasiBaruPage() {
  const kelurahans = await getKelurahans()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <Link href="/lokasi" className="hover:underline text-blue-600">
          Lokasi
        </Link>
        <span>/</span>
        <span className="text-gray-700">Tambah Lokasi</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Lokasi Baru</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tambahkan titik genangan atau lokasi yang perlu dipantau.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <LokasiForm kelurahans={kelurahans} />
      </div>
    </div>
  )
}
