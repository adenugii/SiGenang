'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { LocationWithKelurahan, Kelurahan } from '@/types'
import CustomSelect from '@/components/ui/CustomSelect'

// Dynamically import LeafletMap to avoid SSR issues
const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false })

interface MapClientProps {
  locations: LocationWithKelurahan[]
  kelurahans: Kelurahan[]
}

export default function MapClient({ locations, kelurahans }: MapClientProps) {
  const [selectedKelurahan, setSelectedKelurahan] = useState<number | null>(null)

  const filtered = selectedKelurahan
    ? locations.filter((l) => l.kelurahan_id === selectedKelurahan)
    : locations

  return (
    <div className="space-y-4">
      {/* Control Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 relative z-30">
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Filter Wilayah:
          </label>
          <div className="w-64">
            <CustomSelect
              options={kelurahans.map((k) => {
                const count = locations.filter((l) => l.kelurahan_id === k.id).length
                return {
                  value: k.id,
                  label: `Kelurahan ${k.name} (${count})`,
                }
              })}
              value={selectedKelurahan ?? ''}
              onChange={(val) => setSelectedKelurahan(val ? Number(val) : null)}
              placeholder={`Semua Kelurahan (${locations.length} titik)`}
            />
          </div>
          {selectedKelurahan && (
            <button
              onClick={() => setSelectedKelurahan(null)}
              className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
            >
              Reset filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Menampilkan:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
            {filtered.length} Titik Genangan
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden" style={{ height: '580px' }}>
        <LeafletMap locations={filtered} />
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">Keterangan Warna Marker:</p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-400 inline-block" />
            Belum Diperiksa
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            Sudah Diperiksa
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
            Perlu Pemeriksaan Lanjutan
          </div>
        </div>
      </div>
    </div>
  )
}
