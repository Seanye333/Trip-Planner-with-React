import { useParams, useNavigate, NavLink } from 'react-router-dom'
import { Calendar, Map, Wallet, Package, Bot, BookOpen } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, tripDuration } from '@/lib/utils'

export function TripDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const trips = useStore((s) => s.trips)
  const trip = trips.find((t) => t.id === id)

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

  const navItems = [
    { to: `/trip/${id}/itinerary`, icon: Calendar, label: 'Itinerary', color: 'bg-blue-500/20 text-blue-400' },
    { to: `/trip/${id}/map`, icon: Map, label: 'Map', color: 'bg-purple-500/20 text-purple-400' },
    { to: `/trip/${id}/budget`, icon: Wallet, label: 'Budget', color: 'bg-green-500/20 text-green-400' },
    { to: `/trip/${id}/packing`, icon: Package, label: 'Packing', color: 'bg-orange-500/20 text-orange-400' },
    { to: `/trip/${id}/ai`, icon: Bot, label: 'AI Assistant', color: 'bg-teal-500/20 text-teal-400' },
    { to: `/trip/${id}/rednote`, icon: BookOpen, label: 'RedNote 小红书', color: 'bg-red-500/20 text-red-400' },
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

      {/* Section nav */}
      <div className="grid grid-cols-2 gap-3">
        {navItems.map(({ to, icon: Icon, label, color }) => (
          <NavLink key={to} to={to}>
            <Card className="hover:border-blue-500/50 transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color.split(' ')[0]}`}>
                  <Icon className={`h-5 w-5 ${color.split(' ')[1]}`} />
                </div>
                <span className="font-medium text-slate-200 text-sm">{label}</span>
              </CardContent>
            </Card>
          </NavLink>
        ))}
      </div>
    </div>
  )
}
