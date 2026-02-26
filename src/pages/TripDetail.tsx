import { useState } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import { Calendar, Map, Wallet, Package, Check } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, tripDuration } from '@/lib/utils'

export function TripDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const trips = useStore((s) => s.trips)
  const trip = trips.find((t) => t.id === id)
  const [copied, setCopied] = useState(false)

  if (!trip) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Trip not found.{' '}
        <button className="text-blue-400 ml-1" onClick={() => navigate('/')}>
          Go home
        </button>
      </div>
    )
  }

  const duration = tripDuration(trip.startDate, trip.endDate)

  const copyPrompt = () => {
    const prompt = `Plan a detailed trip to ${trip.destination} from ${formatDate(trip.startDate)} to ${formatDate(trip.endDate)} (${duration} days). Suggest daily activities, must-try restaurants, local transportation tips, cultural etiquette, and budget estimates. Format as a day-by-day itinerary.`
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const rednoteUrl = `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(trip.destination)}`

  const navItems = [
    { to: `/trip/${id}/itinerary`, icon: Calendar, label: 'Itinerary' },
    { to: `/trip/${id}/map`, icon: Map, label: 'Map' },
    { to: `/trip/${id}/budget`, icon: Wallet, label: 'Budget' },
    { to: `/trip/${id}/packing`, icon: Package, label: 'Packing' },
  ]

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
      {/* Trip hero */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-4xl">
              {trip.coverEmoji || '✈️'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{trip.name}</h2>
              <p className="text-slate-400 text-sm">{trip.destination}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge>{duration} days</Badge>
                <span className="text-slate-500 text-xs">
                  {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI & RedNote */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          className="h-auto py-3 flex-col gap-1 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20"
          onClick={() => {
            copyPrompt()
            window.open('https://chatgpt.com', '_blank')
          }}
        >
          <span className="text-xl">🤖</span>
          <span className="text-xs text-green-300">
            {copied ? (
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" /> Copied!
              </span>
            ) : (
              'Ask ChatGPT'
            )}
          </span>
        </Button>
        <a href={rednoteUrl} target="_blank" rel="noopener noreferrer">
          <Button
            variant="secondary"
            className="h-auto py-3 flex-col gap-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 w-full"
          >
            <span className="text-xl">📕</span>
            <span className="text-xs text-red-300">RedNote Tips</span>
          </Button>
        </a>
      </div>

      {/* Section nav */}
      <div className="grid grid-cols-2 gap-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            <Card className="hover:border-blue-500/50 transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <span className="font-medium text-slate-200">{label}</span>
              </CardContent>
            </Card>
          </NavLink>
        ))}
      </div>
    </div>
  )
}
