'use client'

import { useState, useRef } from 'react'
import { useActionState } from 'react'
import dynamic from 'next/dynamic'
import { createLocation, updateLocation } from '@/app/actions'
import { Kelurahan, LocationWithKelurahan } from '@/types'
import CustomSelect from '@/components/ui/CustomSelect'

// Dynamically import LocationPickerMap to prevent SSR leaflet errors
const LocationPickerMap = dynamic(() => import('@/components/map/LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[320px] bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm animate-pulse border border-slate-200">
      Memuat peta penunjuk lokasi...
    </div>
  ),
})

interface LokasiFormProps {
  kelurahans: Kelurahan[]
  location?: LocationWithKelurahan
}

export default function LokasiForm({ kelurahans, location }: LokasiFormProps) {
  const isEdit = !!location

  const [lat, setLat] = useState<number | string>(location?.latitude ?? '')
  const [lng, setLng] = useState<number | string>(location?.longitude ?? '')

  // Foto state
  const [photoPreview, setPhotoPreview] = useState<string | null>(location?.photo_url ?? null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCoordinatesChange = (newLat: number, newLng: number) => {
    setLat(newLat)
    setLng(newLng)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null)
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError('Ukuran file foto maksimal adalah 5MB.')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      const previewUrl = URL.createObjectURL(file)
      setPhotoPreview(previewUrl)
      setRemovePhoto(false)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setRemovePhoto(true)
    setPhotoError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function formAction(formData: FormData) {
    if (removePhoto) {
      formData.set('remove_photo', 'true')
    }
    if (location?.photo_url) {
      formData.set('existing_photo_url', location.photo_url)
    }

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

      {/* Map Location Picker */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          Titik Koordinat Lokasi <span className="text-rose-500">*</span>
        </label>
        
        <LocationPickerMap
          initialLat={location?.latitude ?? null}
          initialLng={location?.longitude ?? null}
          onChange={handleCoordinatesChange}
        />

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Latitude
            </label>
            <input
              type="number"
              name="latitude"
              required
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="-7.945"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Longitude
            </label>
            <input
              type="number"
              name="longitude"
              required
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="112.615"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>
        <p className="text-xs text-slate-400">
          * Koordinat otomatis terisi saat Anda mengklik atau menggeser pin pada peta di atas. Anda juga masih bisa mengeditnya manual jika diperlukan.
        </p>
      </div>

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

      {/* Foto Lokasi (Opsional) */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Foto Gambaran Titik Lokasi (Opsional)
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Unggah foto kenampakan jalan, patokan landmark, atau gambaran area lokasi (maks. 5MB, format JPG/PNG/WebP).
        </p>

        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-200 rounded-xl p-1 bg-white"
          />

          {photoError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{photoError}</span>
            </div>
          )}

          {photoPreview && (
            <div className="relative inline-block border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <img
                src={photoPreview}
                alt="Pratinjau foto lokasi"
                className="max-h-60 max-w-full object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-full shadow-md text-xs transition-colors"
                title="Hapus Foto"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
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
