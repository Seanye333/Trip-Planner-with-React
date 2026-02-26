import { useParams } from 'react-router-dom'
import { ExternalLink, Search } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const SEARCH_TOPICS = [
  { label: 'Travel tips', emoji: '🗺️', query: 'travel tips' },
  { label: 'Food & restaurants', emoji: '🍜', query: 'food guide' },
  { label: 'Hidden gems', emoji: '💎', query: 'hidden gems' },
  { label: 'Budget travel', emoji: '💰', query: 'budget travel' },
  { label: 'Hotels & stays', emoji: '🏨', query: 'accommodation' },
  { label: 'Day trips', emoji: '🚌', query: 'day trip' },
]

export function RedNotePage() {
  const { id: tripId } = useParams<{ id: string }>()
  const trips = useStore((s) => s.trips)
  const trip = trips.find((t) => t.id === tripId)
  const destination = trip?.destination ?? ''

  const openSearch = (extra?: string) => {
    const keyword = extra ? `${destination} ${extra}` : destination
    const url = `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(keyword)}`
    // Open in same tab so user can press back to return
    window.location.href = url
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-24 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-2xl">📕</div>
        <div>
          <h2 className="font-bold text-slate-100">RedNote 小红书</h2>
          <p className="text-sm text-slate-400">Real traveller photos &amp; tips</p>
        </div>
      </div>

      {/* Destination search */}
      {destination && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4 space-y-3">
            <p className="text-sm text-slate-300">
              Search <span className="font-semibold text-red-300">{destination}</span> on RedNote
            </p>
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              onClick={() => openSearch()}
            >
              <Search className="h-4 w-4 mr-2" />
              Search {destination}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Topic shortcuts */}
      {destination && (
        <div>
          <p className="text-xs text-slate-500 mb-3 uppercase tracking-wide font-medium">Search by topic</p>
          <div className="grid grid-cols-2 gap-2">
            {SEARCH_TOPICS.map(({ label, emoji, query }) => (
              <button
                key={label}
                onClick={() => openSearch(query)}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-red-500/40 hover:bg-red-500/5 transition-all text-left group"
              >
                <span className="text-xl">{emoji}</span>
                <div>
                  <p className="text-sm font-medium text-slate-200 group-hover:text-red-300 transition-colors">{label}</p>
                  <p className="text-xs text-slate-500 truncate">{destination} {query}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">About RedNote</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            RedNote (小红书) is a popular Chinese lifestyle platform full of real travel photos, restaurant reviews, itineraries, and local tips shared by millions of travellers.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { window.location.href = 'https://www.xiaohongshu.com' }}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Open RedNote homepage
            </button>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-600 text-center">
        Tap any button above to open RedNote. Press the back button to return to your trip.
      </p>
    </div>
  )
}
