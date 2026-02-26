import { useCallback } from 'react'
import { useStore } from '@/lib/store'
import * as fb from '@/lib/firebase'
import type { ItineraryDay, Activity } from '@/lib/types'
import { generateId } from '@/lib/utils'

export function useItinerary(tripId: string) {
  const { itinerary, setItinerary, upsertDay, removeDay } = useStore()
  const days = itinerary.filter((d) => d.tripId === tripId)

  const loadItinerary = useCallback(async () => {
    try {
      const data = await fb.fetchItinerary(tripId)
      setItinerary([...useStore.getState().itinerary.filter((d) => d.tripId !== tripId), ...data])
    } catch (e) {
      console.error('loadItinerary:', e)
    }
  }, [tripId, setItinerary])

  const addActivity = useCallback(
    async (date: string, activity: Omit<Activity, 'id'>) => {
      const existingDay = days.find((d) => d.date === date)
      const newActivity: Activity = { ...activity, id: generateId() }
      if (existingDay) {
        const updated = { ...existingDay, activities: [...existingDay.activities, newActivity] }
        await fb.saveItineraryDay(updated)
        upsertDay(updated)
      } else {
        const newDay: Omit<ItineraryDay, 'id'> = { tripId, date, activities: [newActivity] }
        const id = await fb.saveItineraryDay(newDay)
        upsertDay({ id, ...newDay })
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
      await fb.saveItineraryDay(updated)
      upsertDay(updated)
    },
    [days, upsertDay]
  )

  const deleteActivity = useCallback(
    async (dayId: string, activityId: string) => {
      const day = days.find((d) => d.id === dayId)
      if (!day) return
      const activities = day.activities.filter((a) => a.id !== activityId)
      if (activities.length === 0) {
        await fb.deleteItineraryDay(dayId)
        removeDay(dayId)
      } else {
        const updated = { ...day, activities }
        await fb.saveItineraryDay(updated)
        upsertDay(updated)
      }
    },
    [days, upsertDay, removeDay]
  )

  return { days, loadItinerary, addActivity, updateActivity, deleteActivity }
}
