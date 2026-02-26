import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Trip, ItineraryDay, Expense, PackingItem, TripBudget } from './types'

interface AppState {
  userId: string | null
  trips: Trip[]
  itinerary: ItineraryDay[]
  expenses: Expense[]
  packingItems: PackingItem[]
  budgets: Record<string, TripBudget>
  // Setters
  setUserId: (id: string | null) => void
  setTrips: (trips: Trip[]) => void
  addTrip: (trip: Trip) => void
  updateTrip: (id: string, data: Partial<Trip>) => void
  removeTrip: (id: string) => void
  setItinerary: (days: ItineraryDay[]) => void
  upsertDay: (day: ItineraryDay) => void
  removeDay: (id: string) => void
  setExpenses: (expenses: Expense[]) => void
  addExpense: (expense: Expense) => void
  removeExpense: (id: string) => void
  setPackingItems: (items: PackingItem[]) => void
  addPackingItem: (item: PackingItem) => void
  updatePackingItem: (id: string, data: Partial<PackingItem>) => void
  removePackingItem: (id: string) => void
  setBudget: (tripId: string, budget: TripBudget) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      userId: null,
      trips: [],
      itinerary: [],
      expenses: [],
      packingItems: [],
      budgets: {},

      setUserId: (id) => set({ userId: id }),
      setTrips: (trips) => set({ trips }),
      addTrip: (trip) => set((s) => ({ trips: [trip, ...s.trips] })),
      updateTrip: (id, data) =>
        set((s) => ({ trips: s.trips.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
      removeTrip: (id) => set((s) => ({ trips: s.trips.filter((t) => t.id !== id) })),

      setItinerary: (days) => set({ itinerary: days }),
      upsertDay: (day) =>
        set((s) => {
          const exists = s.itinerary.find((d) => d.id === day.id)
          if (exists) return { itinerary: s.itinerary.map((d) => (d.id === day.id ? day : d)) }
          return { itinerary: [...s.itinerary, day].sort((a, b) => a.date.localeCompare(b.date)) }
        }),
      removeDay: (id) => set((s) => ({ itinerary: s.itinerary.filter((d) => d.id !== id) })),

      setExpenses: (expenses) => set({ expenses }),
      addExpense: (expense) => set((s) => ({ expenses: [expense, ...s.expenses] })),
      removeExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      setPackingItems: (items) => set({ packingItems: items }),
      addPackingItem: (item) => set((s) => ({ packingItems: [...s.packingItems, item] })),
      updatePackingItem: (id, data) =>
        set((s) => ({ packingItems: s.packingItems.map((p) => (p.id === id ? { ...p, ...data } : p)) })),
      removePackingItem: (id) => set((s) => ({ packingItems: s.packingItems.filter((p) => p.id !== id) })),

      setBudget: (tripId, budget) => set((s) => ({ budgets: { ...s.budgets, [tripId]: budget } })),
    }),
    {
      name: 'tripplanner-store',
      // Persist everything to localStorage so the app works without Firebase
      partialize: (s) => ({
        userId: s.userId,
        trips: s.trips,
        itinerary: s.itinerary,
        expenses: s.expenses,
        packingItems: s.packingItems,
        budgets: s.budgets,
      }),
    }
  )
)
