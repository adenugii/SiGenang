import { supabase } from '@/lib/supabase'
import { LocationWithKelurahan, Kelurahan } from '@/types'
import MapClient from '@/components/map/MapClient'

async function getMapData(): Promise<{ locations: LocationWithKelurahan[]; kelurahans: Kelurahan[] }> {
  const [{ data: locations }, { data: kelurahans }] = await Promise.all([
    supabase
      .from('locations')
      .select('*, kelurahan(id, name, created_at)')
      .order('name'),
    supabase.from('kelurahan').select('*').order('name'),
  ])

  return {
    locations: (locations ?? []) as LocationWithKelurahan[],
    kelurahans: kelurahans ?? [],
  }
}

export default async function PetaPage() {
  const { locations, kelurahans } = await getMapData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Peta Genangan</h1>
        <p className="mt-1 text-sm text-gray-500">
          Peta interaktif titik genangan di Kecamatan Lowokwaru · {locations.length} lokasi tercatat
        </p>
      </div>
      <MapClient locations={locations} kelurahans={kelurahans} />
    </div>
  )
}
