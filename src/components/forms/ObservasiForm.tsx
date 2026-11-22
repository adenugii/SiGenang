'use client'

import { useState, useRef } from 'react'
import { useActionState } from 'react'
import { createObservation } from '@/app/actions'
import { Location } from '@/types'
import CustomSelect from '@/components/ui/CustomSelect'
import Link from 'next/link'

interface ObservasiFormProps {
  locations: Location[]
  preselectedLocationId?: string
}

export default function ObservasiForm({ locations, preselectedLocationId }: ObservasiFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [error, action, isPending] = useActionState(async (_: unknown, formData: FormData) => {
    try {
      await createObservation(formData)
      return null
    } catch (e: unknown) {
      return e instanceof Error ? e.message : 'Terjadi kesalahan.'
    }
  }, null)

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
    } else {
      setPhotoPreview(null)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setPhotoError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const today = new Date().toISOString().slice(0, 16)

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-700 flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Titik Lokasi Terkait <span className="text-rose-500">*</span>
        </label>
        <CustomSelect
          name="location_id"
          required
          accentColor="teal"
          defaultValue={preselectedLocationId ?? ''}
          placeholder="-- Pilih Titik Genangan --"
          options={locations.map((l) => ({
            value: l.id,
            label: l.name,
            description: l.address,
          }))}
        />
        <p className="text-xs text-slate-400 mt-1.5">
          Pilih titik lokasi genangan yang diobservasi atau diverifikasi.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Tanggal &amp; Waktu Observasi <span className="text-rose-500">*</span>
        </label>
        <input
          type="datetime-local"
          name="observed_at"
          required
          defaultValue={today}
          className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-xs"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Riwayat / Kondisi Genangan
        </label>
        <textarea
          name="flood_history"
          rows={3}
          placeholder="Contoh: Terjadi genangan setinggi mata kaki saat hujan deras lebih dari 1 jam..."
          className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-xs"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Tinggi Genangan (cm)
        </label>
        <input
          type="number"
          name="water_depth_cm"
          min={0}
          placeholder="Kosongkan jika tidak diketahui/tidak terukur"
          className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-xs"
        />
        <p className="text-xs text-slate-400 mt-1.5">Isi hanya jika terukur atau diketahui dengan pasti.</p>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Parameter Kondisi Fisik Drainase</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kondisi Drainase</label>
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
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tingkat Sedimentasi</label>
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
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kelancaran Aliran Air</label>
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
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Penyempitan Saluran</label>
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
      </div>

      {/* Foto Dokumentasi */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Foto Dokumentasi Lapangan (Opsional)
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Unggah foto dokumentasi kondisi genangan atau saluran drainase (maks. 5MB, format JPG/PNG/WebP).
        </p>

        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer border border-slate-200 rounded-xl p-1 bg-white"
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
                alt="Pratinjau foto observasi"
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
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Catatan Tambahan</label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Catatan lapangan, narasumber warga setempat, konteks observasi, dll..."
          className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-xs"
        />
      </div>

      <div className="pt-4 flex items-center gap-3 border-t border-slate-100">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm shadow-teal-500/20 hover:shadow-md hover:shadow-teal-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Observasi'}
        </button>
        <Link
          href="/observasi"
          className="text-sm font-medium text-slate-500 hover:text-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          Batal
        </Link>
      </div>
    </form>
  )
}
