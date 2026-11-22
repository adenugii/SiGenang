import { supabase } from '@/lib/supabase'
import { Location } from '@/types'
import ObservasiForm from '@/components/forms/ObservasiForm'
import Link from 'next/link'

async function getLocations(): Promise<Location[]> {
  const { data } = await supabase
    .from('locations')
    .select('id, name, address, kelurahan_id, latitude, longitude, source_type, verification_status, notes, created_at, updated_at')
    .order('name')
  return data ?? []
}

export default async function ObservasiBaruPage({
  searchParams,
}: PageProps<'/observasi/baru'>) {
  const params = await searchParams
  const preselectedLocationId = params.location_id as string | undefined
  const locations = await getLocations()

  return (
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
        <Link href="/observasi" className="hover:underline text-teal-600">
          Observasi
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-700">Tambah Observasi</span>
      </div>

      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tambah Hasil Observasi Lapangan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Catat data hasil verifikasi, tinggi genangan, kondisi aliran, dan sedimentasi drainase.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <ObservasiForm locations={locations} preselectedLocationId={preselectedLocationId} />
      </div>
    </div>
  )
}
