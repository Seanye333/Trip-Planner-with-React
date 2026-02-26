import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useItinerary } from '@/hooks/useItinerary'
import type { Activity } from '@/lib/types'

// Leaflet import
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export function MapPage() {
  const { id: tripId } = useParams<{ id: string }>()
  const trips = useStore((s) => s.trips)
  const trip = trips.find((t) => t.id === tripId)
  const { days, loadItinerary } = useItinerary(tripId!)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)

  useEffect(() => { loadItinerary() }, [loadItinerary])

  // Gather all activities with lat/lng
  const pinned: (Activity & { date: string })[] = []
  days.forEach((day) => {
    day.activities.forEach((act) => {
      if (act.lat != null && act.lng != null) {
        pinned.push({ ...act, date: day.date })
      }
    })
  })

  useEffect(() => {
    if (!mapRef.current) return
    if (mapInstance.current) {
      mapInstance.current.remove()
      mapInstance.current = null
    }

    const defaultCenter: [number, number] = [20, 0]
    const map = L.map(mapRef.current, {
      center: defaultCenter,
      zoom: 2,
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    if (pinned.length > 0) {
      const bounds: [number, number][] = pinned.map((p) => [p.lat!, p.lng!])
      pinned.forEach((p) => {
        L.marker([p.lat!, p.lng!])
          .addTo(map)
          .bindPopup(`<b>${p.title}</b><br/>${p.location || ''}`)
      })
      map.fitBounds(bounds, { padding: [40, 40] })
    }

    mapInstance.current = map
    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [pinned.length])

  return (
    <div className="flex-1 flex flex-col pb-16">
      <div className="px-4 py-3 border-b border-slate-700/50">
        <h2 className="font-semibold text-slate-200 text-sm">
          Map — {trip?.destination}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Add lat/lng to activities to see them pinned here
        </p>
      </div>

      {pinned.length === 0 && (
        <div className="absolute top-20 left-0 right-0 z-10 flex justify-center pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-slate-400 mx-4 border border-slate-700/50">
            <MapPin className="h-4 w-4" />
            Add activities with coordinates to see pins
          </div>
        </div>
      )}

      <div ref={mapRef} className="flex-1 w-full" style={{ minHeight: '60vh' }} />
    </div>
  )
}
