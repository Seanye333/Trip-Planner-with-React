export interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  coverEmoji?: string
  description?: string
  userId?: string
  createdAt: number
}

export interface Activity {
  id: string
  time: string
  title: string
  location?: string
  notes?: string
  lat?: number
  lng?: number
  category?: 'food' | 'attraction' | 'transport' | 'accommodation' | 'other'
}

export interface ItineraryDay {
  id: string
  tripId: string
  date: string
  activities: Activity[]
}

export interface Expense {
  id: string
  tripId: string
  category: 'accommodation' | 'food' | 'transport' | 'activities' | 'shopping' | 'other'
  description: string
  amount: number
  date: string
  currency?: string
}

export interface PackingItem {
  id: string
  tripId: string
  category: string
  name: string
  checked: boolean
}

export interface TripBudget {
  tripId: string
  totalBudget: number
  currency: string
}
