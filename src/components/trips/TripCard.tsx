import { useNavigate } from 'react-router-dom'
import { Trash2, Calendar, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate, tripDuration } from '@/lib/utils'
import type { Trip } from '@/lib/types'

interface TripCardProps {
  trip: Trip
  onDelete: (id: string) => void
}

export function TripCard({ trip, onDelete }: TripCardProps) {
  const navigate = useNavigate()
  const duration = tripDuration(trip.startDate, trip.endDate)

  return (
    <Card
      className="cursor-pointer hover:border-blue-500/50 transition-all duration-200 hover:shadow-blue-500/10 hover:shadow-xl group"
      onClick={() => navigate(`/trip/${trip.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-3xl flex-shrink-0">
            {trip.coverEmoji || '✈️'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-100 text-base truncate group-hover:text-blue-300 transition-colors">
              {trip.name}
            </h3>
            <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{trip.destination}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
              <span className="ml-1 text-blue-400">• {duration}d</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(trip.id)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
