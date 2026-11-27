'use client'

import { useState, useRef, useActionState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { createPublicReport } from '@/app/laporan/actions'
import { Kelurahan } from '@/types'
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

interface LaporanFormProps {
  kelurahans: Kelurahan[]
}

export default function LaporanForm({ kelurahans }: LaporanFormProps) {
  const [lat, setLat] = useState<number | string>('')
  const [lng, setLng] = useState<number | string>('')

  // Foto state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formRef = useRef<HTMLFormElement>(null)

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
        setPhotoPreview(null)
        return
      }
      const previewUrl = URL.createObjectURL(file)
      setPhotoPreview(previewUrl)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setPhotoError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const [state, action, isPending] = useActionState(createPublicReport, null)

  // Jika sukses, tampilkan halaman konfirmasi
  if (state?.success) {
    return (
      <div className="text-center space-y-5 py-6">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Laporan Terkirim!</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
            {state.message}
          </p>
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          {state.locationId && (
            <Link
              href={`/lokasi/${state.locationId}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
            >
              Lihat Detail Laporan →
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form ref={formRef} action={action} className="space-y-5">
      {/* Error state */}
      {state && !state.success && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-start gap-2">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{state.message}</span>
        </div>
      )}

      {/* Nama Lokasi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama / Deskripsi Titik Genangan <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="mis. Jl. Cengkeh depan warung Pak Budi, pertigaan Jl. Cempaka"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-slate-400 mt-1">
          Nama jalan, gang, atau patokan yang mudah dikenali.
        </p>
      </div>

      {/* Alamat */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alamat Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          required
          placeholder="mis. RT 03/RW 02, Kelurahan Tulusrejo"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Kelurahan */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Kelurahan <span className="text-rose-500">*</span>
        </label>
        <CustomSelect
          name="kelurahan_id"
          required
          defaultValue=""
          placeholder="-- Pilih Kelurahan --"
          options={kelurahans.map((k) => ({
            value: k.id,
            label: `Kelurahan ${k.name}`,
          }))}
        />
      </div>

      {/* Peta */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          Titik Koordinat Lokasi <span className="text-rose-500">*</span>
        </label>
        <p className="text-xs text-slate-500">
          Klik pada peta untuk menandai lokasi genangan yang Anda laporkan. Pin dapat digeser untuk menyesuaikan posisi.
        </p>

        <LocationPickerMap
          initialLat={null}
          initialLng={null}
          onChange={handleCoordinatesChange}
        />

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Latitude</label>
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
            <label className="block text-xs font-medium text-slate-500 mb-1">Longitude</label>
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
          * Koordinat otomatis terisi saat Anda mengklik atau menggeser pin pada peta di atas.
        </p>
      </div>

      {/* Foto (Opsional) */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Foto Titik Genangan (Opsional)
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Unggah foto kondisi genangan, jalan, atau patokan lokasi agar tim pengelola lebih mudah
          memverifikasi laporan Anda (maks. 5MB, format JPG/PNG/WebP).
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
                alt="Pratinjau foto laporan"
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

      {/* Catatan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Keterangan Tambahan
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Contoh: Genangan terjadi saat hujan lebat lebih dari 1 jam, kedalaman sekitar 30 cm, sering terjadi sejak 2023..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-slate-400 mt-1">
          Tambahkan informasi seperti frekuensi genangan, perkiraan kedalaman, atau kondisi yang sering terjadi.
        </p>
      </div>

      {/* Submit */}
      <div className="pt-2 flex gap-3 items-center">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Mengirim...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Kirim Laporan
            </>
          )}
        </button>
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors"
        >
          Batal
        </Link>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 border-t border-slate-100 pt-4">
        Laporan Anda akan disimpan sebagai <strong>Laporan Masyarakat (Belum Diperiksa)</strong> dan 
        akan ditinjau oleh tim pengelola. Data akan muncul di peta setelah disimpan, dan status verifikasi 
        dapat berubah setelah pemeriksaan lapangan.
      </p>
    </form>
  )
}
