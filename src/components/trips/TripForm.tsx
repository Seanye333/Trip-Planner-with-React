import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { COVER_EMOJIS } from '@/lib/utils'
import type { Trip } from '@/lib/types'

interface TripFormProps {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<Trip, 'id' | 'createdAt' | 'userId'>) => void
}

export function TripForm({ open, onClose, onSave }: TripFormProps) {
  const today = new Date().toISOString().split('T')[0]
  const [name, setName] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [emoji, setEmoji] = useState('✈️')

  const handleSave = () => {
    if (!name.trim() || !destination.trim()) return
    onSave({ name, destination, startDate, endDate, coverEmoji: emoji })
    setName('')
    setDestination('')
    setStartDate(today)
    setEndDate(today)
    setEmoji('✈️')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Trip</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Trip name</label>
            <Input
              placeholder="e.g. Summer in Japan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Destination</label>
            <Input
              placeholder="e.g. Tokyo, Japan"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Start date</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">End date</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Cover icon</label>
            <div className="flex gap-2 flex-wrap">
              {COVER_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-xl w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    emoji === e
                      ? 'bg-blue-500/30 ring-2 ring-blue-500'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} disabled={!name.trim() || !destination.trim()}>
              Create Trip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
