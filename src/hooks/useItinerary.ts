import { useCallback } from 'react'
import { useStore } from '@/lib/store'
import * as fb from '@/lib/firebase'
import type { ItineraryDay, Activity } from '@/lib/types'
import { generateId } from '@/lib/utils'

export function useItinerary(tripId: string) {
  const { itinerary, setItinerary, upsertDay, removeDay } = useStore()
  const days = itinerary.filter((d) => d.tripId === tripId)

  const loadItinerary = useCallback(async () => {
    // Local data already restored from localStorage — only merge Firebase data
    try {
      const data = await fb.fetchItinerary(tripId)
      if (data.length > 0) {
        setItinerary([...useStore.getState().itinerary.filter((d) => d.tripId !== tripId), ...data])
      }
    } catch (e) {
      console.warn('Firebase loadItinerary failed, using local data:', e)
    }
  }, [tripId, setItinerary])

  const addActivity = useCallback(
    async (date: string, activity: Omit<Activity, 'id'>) => {
      const newActivity: Activity = { ...activity, id: generateId() }
      const existingDay = days.find((d) => d.date === date)

      if (existingDay) {
        const updated = { ...existingDay, activities: [...existingDay.activities, newActivity] }
        upsertDay(updated)
        fb.saveItineraryDay(updated).catch((e) => console.warn('Firebase sync failed:', e))
      } else {
        const newDay: ItineraryDay = { id: generateId(), tripId, date, activities: [newActivity] }
        upsertDay(newDay)
        fb.saveItineraryDay(newDay).catch((e) => console.warn('Firebase sync failed:', e))
      }
    },
    [days, tripId, upsertDay]
  )

  const updateActivity = useCallback(
    async (dayId: string, activityId: string, data: Partial<Activity>) => {
      const day = days.find((d) => d.id === dayId)
      if (!day) return
      const updated = {
        ...day,
        activities: day.activities.map((a) => (a.id === activityId ? { ...a, ...data } : a)),
      }
      upsertDay(updated)
      fb.saveItineraryDay(updated).catch((e) => console.warn('Firebase sync failed:', e))
    },
    [days, upsertDay]
  )

  const deleteActivity = useCallback(
    async (dayId: string, activityId: string) => {
      const day = days.find((d) => d.id === dayId)
      if (!day) return
      const activities = day.activities.filter((a) => a.id !== activityId)
      if (activities.length === 0) {
        removeDay(dayId)
        fb.deleteItineraryDay(dayId).catch((e) => console.warn('Firebase sync failed:', e))
      } else {
        const updated = { ...day, activities }
        upsertDay(updated)
        fb.saveItineraryDay(updated).catch((e) => console.warn('Firebase sync failed:', e))
      }
    },
    [days, upsertDay, removeDay]
  )

  return { days, loadItinerary, addActivity, updateActivity, deleteActivity }
}
