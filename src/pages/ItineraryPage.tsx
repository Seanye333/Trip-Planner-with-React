import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Clock, MapPin, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useItinerary } from '@/hooks/useItinerary'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { getDatesInRange, ACTIVITY_ICONS } from '@/lib/utils'
import type { Activity } from '@/lib/types'

const CATEGORIES = ['food', 'attraction', 'transport', 'accommodation', 'other'] as const

export function ItineraryPage() {
  const { id: tripId } = useParams<{ id: string }>()
  const trips = useStore((s) => s.trips)
  const trip = trips.find((t) => t.id === tripId)
  const { days, loadItinerary, addActivity, deleteActivity } = useItinerary(tripId!)
  const [openDay, setOpenDay] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [form, setForm] = useState({ title: '', time: '', location: '', notes: '', category: 'other' as Activity['category'] })

  useEffect(() => { loadItinerary() }, [loadItinerary])

  const dates = trip ? getDatesInRange(trip.startDate, trip.endDate) : []
  const dayMap = Object.fromEntries(days.map((d) => [d.date, d]))

  const handleAdd = async () => {
    if (!form.title.trim() || !selectedDate) return
    await addActivity(selectedDate, { ...form })
    setForm({ title: '', time: '', location: '', notes: '', category: 'other' })
    setShowForm(false)
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-24 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-200">Itinerary</h2>
        <Button size="sm" onClick={() => { setSelectedDate(dates[0] || ''); setShowForm(true) }}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {dates.map((date) => {
        const day = dayMap[date]
        const isOpen = openDay === date
        return (
          <Card key={date}>
            <button
              className="w-full p-4 flex items-center justify-between text-left"
              onClick={() => setOpenDay(isOpen ? null : date)}
            >
              <div>
                <span className="font-medium text-slate-200 text-sm">
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
                {day && (
                  <span className="ml-2 text-xs text-slate-500">{day.activities.length} activities</span>
                )}
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
            </button>
            {isOpen && (
              <CardContent className="pt-0 space-y-2">
                {day?.activities.length ? (
                  day.activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 group">
                      <span className="text-xl flex-shrink-0 mt-0.5">
                        {ACTIVITY_ICONS[act.category || 'other']}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200">{act.title}</p>
                        {act.time && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {act.time}
                          </div>
                        )}
                        {act.location && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3" />
                            {act.location}
                          </div>
                        )}
                        {act.notes && <p className="text-xs text-slate-500 mt-1">{act.notes}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 h-7 w-7 text-red-400"
                        onClick={() => day && deleteActivity(day.id, act.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-3">No activities yet</p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-blue-400 hover:text-blue-300"
                  onClick={() => { setSelectedDate(date); setShowForm(true) }}
                >
                  <Plus className="h-3.5 w-3.5" /> Add activity
                </Button>
              </CardContent>
            )}
          </Card>
        )
      })}

      {/* Add activity dialog */}
      <Dialog open={showForm} onOpenChange={(v) => !v && setShowForm(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Day</label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {dates.map((d) => (
                    <SelectItem key={d} value={d}>
                      {new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Activity title *"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as Activity['category'] }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{ACTIVITY_ICONS[c]} {c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Location (optional)"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
            <Input
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleAdd} disabled={!form.title.trim()}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
