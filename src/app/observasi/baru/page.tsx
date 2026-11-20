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
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <Link href="/observasi" className="hover:underline text-teal-600">
          Observasi
        </Link>
        <span>/</span>
        <span className="text-gray-700">Tambah Observasi</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Observasi</h1>
        <p className="mt-1 text-sm text-gray-500">
          Catat hasil pemeriksaan lapangan untuk suatu lokasi.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ObservasiForm locations={locations} preselectedLocationId={preselectedLocationId} />
      </div>
    </div>
  )
}
