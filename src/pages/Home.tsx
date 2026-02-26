import { useEffect, useState } from 'react'
import { Plus, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TripCard } from '@/components/trips/TripCard'
import { TripForm } from '@/components/trips/TripForm'
import { useTrips } from '@/hooks/useTrips'

export function Home() {
  const { trips, loadTrips, createTrip, deleteTrip } = useTrips()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { loadTrips() }, [loadTrips])

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
      {/* Hero */}
      <div className="text-center py-2">
        <h2 className="text-2xl font-bold text-slate-100">My Trips</h2>
        <p className="text-slate-400 text-sm mt-1">Plan your next adventure</p>
      </div>

      {/* AI & RedNote shortcuts */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href="https://chatgpt.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="hover:border-green-500/50 transition-all cursor-pointer">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-xl flex-shrink-0">
                🤖
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">ChatGPT</p>
                <p className="text-xs text-slate-500">AI travel ideas</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-600 ml-auto" />
            </CardContent>
          </Card>
        </a>
        <a
          href="https://www.xiaohongshu.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="hover:border-red-500/50 transition-all cursor-pointer">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-xl flex-shrink-0">
                📕
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">RedNote</p>
                <p className="text-xs text-slate-500">小红书 tips</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-600 ml-auto" />
            </CardContent>
          </Card>
        </a>
      </div>

      {/* Trips list */}
      <div className="space-y-3">
        {trips.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="text-6xl">🗺️</div>
            <p className="text-slate-400">No trips yet. Plan your first adventure!</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              New Trip
            </Button>
          </div>
        ) : (
          trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={deleteTrip} />
          ))
        )}
      </div>

      {/* FAB */}
      {trips.length > 0 && (
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl shadow-blue-500/20 z-50"
          size="icon"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      <TripForm open={showForm} onClose={() => setShowForm(false)} onSave={createTrip} />
    </div>
  )
}
