'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocationWithKelurahan, SOURCE_TYPE_LABELS, VERIFICATION_STATUS_LABELS } from '@/types'

// Fix default marker icon path issue with Webpack/Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function getMarkerColor(status: string): string {
  switch (status) {
    case 'verified':
      return '#22c55e'
    case 'needs_follow_up':
      return '#eab308'
    default:
      return '#9ca3af'
  }
}

function createColoredIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: ${color};
      border: 2.5px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  })
}

interface LeafletMapProps {
  locations: LocationWithKelurahan[]
}

export default function LeafletMap({ locations }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)

  // Init map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [-7.945, 112.615],
      zoom: 13,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    markersRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return

    markersRef.current.clearLayers()

    for (const loc of locations) {
      if (loc.latitude == null || loc.longitude == null) continue

      const color = getMarkerColor(loc.verification_status)
      const icon = createColoredIcon(color)

      const marker = L.marker([loc.latitude, loc.longitude], { icon })

      const popupContent = `
        <div style="min-width: 200px; font-family: sans-serif; font-size: 13px;">
          <strong style="font-size: 14px;">${loc.name}</strong><br/>
          <span style="color: #555;">${loc.kelurahan?.name ?? '—'}</span><br/>
          <span style="color: #666; font-size: 12px;">${loc.address}</span>
          <hr style="margin: 6px 0; border-color: #eee;"/>
          <div style="font-size: 12px;">
            <b>Sumber:</b> ${SOURCE_TYPE_LABELS[loc.source_type] ?? loc.source_type}<br/>
            <b>Status:</b> ${VERIFICATION_STATUS_LABELS[loc.verification_status] ?? loc.verification_status}
          </div>
          <a href="/lokasi/${loc.id}"
             style="display:inline-block; margin-top:8px; padding: 4px 10px; background:#2563eb; color:white; border-radius:4px; text-decoration:none; font-size:12px;">
            Lihat Detail
          </a>
        </div>
      `

      marker.bindPopup(popupContent)
      markersRef.current.addLayer(marker)
    }
  }, [locations])

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
}
