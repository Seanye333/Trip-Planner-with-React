import { useCallback } from 'react'
import { useStore } from '@/lib/store'
import * as fb from '@/lib/firebase'
import type { Trip } from '@/lib/types'
import { generateId } from '@/lib/utils'

export function useTrips() {
  const { userId, trips, setTrips, addTrip, updateTrip, removeTrip } = useStore()

  const loadTrips = useCallback(async () => {
    // Local trips already restored from localStorage on startup.
    // Only fetch from Firebase when auth is ready to merge remote data.
    if (!userId) return
    try {
      const data = await fb.fetchTrips(userId)
      if (data.length > 0) setTrips(data)
    } catch (e) {
      console.warn('Firebase loadTrips failed, using local data:', e)
    }
  }, [userId, setTrips])

  const createTrip = useCallback(
    async (data: Omit<Trip, 'id' | 'createdAt' | 'userId'>) => {
      // Save locally immediately — no userId needed
      const id = generateId()
      const trip: Trip = { ...data, id, userId: userId ?? 'local', createdAt: Date.now() }
      addTrip(trip)
      // Sync to Firebase in background once auth is ready
      if (userId) {
        fb.createTrip(trip).catch((e) => console.warn('Firebase sync failed:', e))
      }
    },
    [userId, addTrip]
  )

  const editTrip = useCallback(
    async (tripId: string, data: Partial<Trip>) => {
      updateTrip(tripId, data)
      if (userId) {
        fb.updateTrip(tripId, data).catch((e) => console.warn('Firebase sync failed:', e))
      }
    },
    [userId, updateTrip]
  )

  const deleteTrip = useCallback(
    async (tripId: string) => {
      removeTrip(tripId)
      if (userId) {
        fb.deleteTrip(tripId).catch((e) => console.warn('Firebase sync failed:', e))
      }
    },
    [userId, removeTrip]
  )

  return { trips, loadTrips, createTrip, editTrip, deleteTrip }
}
