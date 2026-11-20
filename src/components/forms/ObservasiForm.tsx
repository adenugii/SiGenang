'use client'

import { useActionState } from 'react'
import { createObservation } from '@/app/actions'
import { Location } from '@/types'
import CustomSelect from '@/components/ui/CustomSelect'

interface ObservasiFormProps {
  locations: Location[]
  preselectedLocationId?: string
}

export default function ObservasiForm({ locations, preselectedLocationId }: ObservasiFormProps) {
  const [error, action, isPending] = useActionState(async (_: unknown, formData: FormData) => {
    try {
      await createObservation(formData)
      return null
    } catch (e: unknown) {
      return e instanceof Error ? e.message : 'Terjadi kesalahan.'
    }
  }, null)

  const today = new Date().toISOString().slice(0, 16)

  return (
    <form action={action} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Lokasi <span className="text-rose-500">*</span>
        </label>
        <CustomSelect
          name="location_id"
          required
          accentColor="teal"
          defaultValue={preselectedLocationId ?? ''}
          placeholder="-- Pilih Titik Lokasi --"
          options={locations.map((l) => ({
            value: l.id,
            label: l.name,
            description: l.address,
          }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tanggal & Waktu Observasi <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          name="observed_at"
          required
          defaultValue={today}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Riwayat / Kondisi Genangan
        </label>
        <textarea
          name="flood_history"
          rows={3}
          placeholder="Deskripsikan riwayat atau kondisi genangan yang diamati atau dilaporkan..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tinggi Genangan (cm)
        </label>
        <input
          type="number"
          name="water_depth_cm"
          min={0}
          placeholder="Kosongkan jika tidak diketahui"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <p className="text-xs text-gray-400 mt-1">Isi hanya jika terukur atau diketahui dengan pasti.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kondisi Drainase</label>
          <CustomSelect
            name="drainage_condition"
            accentColor="teal"
            defaultValue="unknown"
            options={[
              { value: 'unknown', label: 'Tidak Diketahui' },
              { value: 'good', label: 'Baik' },
              { value: 'problematic', label: 'Bermasalah' },
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tingkat Sedimentasi</label>
          <CustomSelect
            name="sedimentation_level"
            accentColor="teal"
            defaultValue="unknown"
            options={[
              { value: 'unknown', label: 'Tidak Diketahui' },
              { value: 'low', label: 'Rendah' },
              { value: 'medium', label: 'Sedang' },
              { value: 'high', label: 'Tinggi' },
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kelancaran Aliran Air</label>
          <CustomSelect
            name="water_flow"
            accentColor="teal"
            defaultValue="unknown"
            options={[
              { value: 'unknown', label: 'Tidak Diketahui' },
              { value: 'smooth', label: 'Lancar' },
              { value: 'not_smooth', label: 'Tidak Lancar' },
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Penyempitan Saluran</label>
          <CustomSelect
            name="channel_narrowing"
            accentColor="teal"
            defaultValue="unknown"
            options={[
              { value: 'unknown', label: 'Tidak Diketahui' },
              { value: 'yes', label: 'Ya, ada penyempitan' },
              { value: 'no', label: 'Tidak ada penyempitan' },
            ]}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Catatan lapangan, konteks observasi, sumber informasi, dll..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="pt-2 flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="bg-teal-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-60"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Observasi'}
        </button>
        <a
          href="/observasi"
          className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
        >
          Batal
        </a>
      </div>
    </form>
  )
}
