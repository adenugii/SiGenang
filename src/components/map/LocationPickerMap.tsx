'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Perbaiki icon default Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface LocationPickerMapProps {
  initialLat?: number | null
  initialLng?: number | null
  onChange: (lat: number, lng: number) => void
}

export default function LocationPickerMap({
  initialLat,
  initialLng,
  onChange,
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [geoLocating, setGeoLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  // Default ke pusat Lowokwaru / Kota Malang jika belum ada titik awal
  const defaultLat = -7.945
  const defaultLng = 112.615

  const currentLat = initialLat ?? (initialLng ? defaultLat : null)
  const currentLng = initialLng ?? (initialLat ? defaultLng : null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const centerLat = initialLat ?? defaultLat
    const centerLng = initialLng ?? defaultLng
    const initialZoom = initialLat && initialLng ? 16 : 13

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: initialZoom,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    // Helper untuk set marker
    const updateMarkerPosition = (lat: number, lng: number) => {
      if (!markerRef.current) {
        const marker = L.marker([lat, lng], { draggable: true }).addTo(map)
        marker.on('dragend', () => {
          const pos = marker.getLatLng()
          onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)))
        })
        markerRef.current = marker
      } else {
        markerRef.current.setLatLng([lat, lng])
      }
      onChange(Number(lat.toFixed(6)), Number(lng.toFixed(6)))
    }

    // Jika sudah ada koordinat awal (misal saat edit), buat marker
    if (initialLat != null && initialLng != null) {
      updateMarkerPosition(initialLat, initialLng)
    }

    // Event klik pada peta untuk memindahkan / membuat marker
    map.on('click', (e: L.LeafletMouseEvent) => {
      updateMarkerPosition(e.latlng.lat, e.latlng.lng)
    })

    // Pastikan ukuran Leaflet map invalidate dengan benar
    setTimeout(() => {
      map.invalidateSize()
    }, 200)

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Browser Anda tidak mendukung geolokasi.')
      return
    }

    setGeoLocating(true)
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false)
        const { latitude, longitude } = pos.coords
        const lat = Number(latitude.toFixed(6))
        const lng = Number(longitude.toFixed(6))

        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 17)

          if (!markerRef.current) {
            const marker = L.marker([lat, lng], { draggable: true }).addTo(mapRef.current)
            marker.on('dragend', () => {
              const p = marker.getLatLng()
              onChange(Number(p.lat.toFixed(6)), Number(p.lng.toFixed(6)))
            })
            markerRef.current = marker
          } else {
            markerRef.current.setLatLng([lat, lng])
          }
        }
        onChange(lat, lng)
      },
      (err) => {
        setGeoLocating(false)
        setGeoError('Gagal mendeteksi lokasi: ' + (err.message || 'Izin ditolak'))
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Klik pada peta atau geser pin merah untuk menandai titik genangan.
        </span>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={geoLocating}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors border border-blue-200"
        >
          <svg
            className="w-3.5 h-3.5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {geoLocating ? 'Mencari lokasi...' : 'Gunakan GPS Saya'}
        </button>
      </div>

      {geoError && (
        <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
          {geoError}
        </p>
      )}

      <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-slate-300 shadow-inner z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  )
}
