import { useCallback } from 'react'
import { useStore } from '@/lib/store'
import * as fb from '@/lib/firebase'
import type { Trip } from '@/lib/types'

export function useTrips() {
  const { userId, trips, setTrips, addTrip, updateTrip, removeTrip } = useStore()

  const loadTrips = useCallback(async () => {
    if (!userId) return
    try {
      const data = await fb.fetchTrips(userId)
      setTrips(data)
    } catch (e) {
      console.error('loadTrips:', e)
    }
  }, [userId, setTrips])

  const createTrip = useCallback(
    async (data: Omit<Trip, 'id' | 'createdAt' | 'userId'>) => {
      if (!userId) return
      const trip: Omit<Trip, 'id'> = { ...data, userId, createdAt: Date.now() }
      const id = await fb.createTrip(trip)
      addTrip({ id, ...trip })
    },
    [userId, addTrip]
  )

  const editTrip = useCallback(
    async (id: string, data: Partial<Trip>) => {
      await fb.updateTrip(id, data)
      updateTrip(id, data)
    },
    [updateTrip]
  )

  const deleteTrip = useCallback(
    async (id: string) => {
      await fb.deleteTrip(id)
      removeTrip(id)
    },
    [removeTrip]
  )

  return { trips, loadTrips, createTrip, editTrip, deleteTrip }
}
