import { supabase } from '@/lib/supabase'
import { Kelurahan, LocationWithKelurahan } from '@/types'
import LokasiForm from '@/components/forms/LokasiForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getData(id: string) {
  const [{ data: location }, { data: kelurahans }] = await Promise.all([
    supabase.from('locations').select('*, kelurahan(id, name, created_at)').eq('id', id).single(),
    supabase.from('kelurahan').select('*').order('name'),
  ])
  return {
    location: location as LocationWithKelurahan | null,
    kelurahans: (kelurahans ?? []) as Kelurahan[],
  }
}

export default async function LokasiEditPage({ params }: PageProps<'/lokasi/[id]/edit'>) {
  const { id } = await params
  const { location, kelurahans } = await getData(id)
  if (!location) return notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <Link href="/lokasi" className="hover:underline text-blue-600">
          Lokasi
        </Link>
        <span>/</span>
        <Link href={`/lokasi/${id}`} className="hover:underline text-blue-600">
          {location.name}
        </Link>
        <span>/</span>
        <span className="text-gray-700">Edit</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Lokasi</h1>
        <p className="mt-1 text-sm text-gray-500">{location.name}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <LokasiForm kelurahans={kelurahans} location={location} />
      </div>
    </div>
  )
}
