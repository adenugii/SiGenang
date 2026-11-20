'use client'

import { useActionState, useTransition } from 'react'
import { createLocation, updateLocation } from '@/app/actions'
import { Kelurahan, LocationWithKelurahan } from '@/types'
import CustomSelect from '@/components/ui/CustomSelect'

interface LokasiFormProps {
  kelurahans: Kelurahan[]
  location?: LocationWithKelurahan
}

export default function LokasiForm({ kelurahans, location }: LokasiFormProps) {
  const isEdit = !!location

  async function formAction(formData: FormData) {
    if (isEdit) {
      await updateLocation(location!.id, formData)
    } else {
      await createLocation(formData)
    }
  }

  const [error, action, isPending] = useActionState(async (_: unknown, formData: FormData) => {
    try {
      await formAction(formData)
      return null
    } catch (e: unknown) {
      return e instanceof Error ? e.message : 'Terjadi kesalahan.'
    }
  }, null)

  return (
    <form action={action} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Lokasi <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={location?.name}
          placeholder="mis. Jl. Cengkeh depan RT 01"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alamat / Deskripsi <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          required
          defaultValue={location?.address}
          placeholder="mis. RT 01/RW 05, Kelurahan Tulusrejo"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Kelurahan <span className="text-rose-500">*</span>
        </label>
        <CustomSelect
          name="kelurahan_id"
          required
          defaultValue={location?.kelurahan_id ?? ''}
          placeholder="-- Pilih Kelurahan --"
          options={kelurahans.map((k) => ({
            value: k.id,
            label: `Kelurahan ${k.name}`,
          }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="latitude"
            required
            step="any"
            defaultValue={location?.latitude}
            placeholder="-7.945"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="longitude"
            required
            step="any"
            defaultValue={location?.longitude}
            placeholder="112.615"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <p className="text-xs text-gray-400 -mt-3">
        Gunakan koordinat yang terukur (GPS/peta). Jangan menebak koordinat.
      </p>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Sumber Data <span className="text-rose-500">*</span>
        </label>
        <CustomSelect
          name="source_type"
          required
          defaultValue={location?.source_type ?? ''}
          placeholder="-- Pilih Sumber Data --"
          options={[
            { value: 'secondary', label: 'Data Sekunder (dokumen, berita, penelitian)' },
            { value: 'field_observation', label: 'Observasi Lapangan' },
            { value: 'community_report', label: 'Laporan Masyarakat' },
          ]}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Status Pemeriksaan
        </label>
        <CustomSelect
          name="verification_status"
          defaultValue={location?.verification_status ?? 'unverified'}
          options={[
            { value: 'unverified', label: 'Belum Diperiksa' },
            { value: 'verified', label: 'Sudah Diperiksa' },
            { value: 'needs_follow_up', label: 'Perlu Pemeriksaan Lanjutan' },
          ]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={location?.notes ?? ''}
          placeholder="Catatan tambahan tentang lokasi ini..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="pt-2 flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {isPending ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Lokasi'}
        </button>
        <a
          href={isEdit ? `/lokasi/${location!.id}` : '/lokasi'}
          className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
        >
          Batal
        </a>
      </div>
    </form>
  )
}
