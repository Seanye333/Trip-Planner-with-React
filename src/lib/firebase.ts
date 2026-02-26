import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import type { Trip, ItineraryDay, Expense, PackingItem, TripBudget } from './types'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

// Auth helpers
export const signInAnon = () => signInAnonymously(auth)
export const onAuth = (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb)

// Trips
export async function fetchTrips(userId: string): Promise<Trip[]> {
  const q = query(collection(db, 'trips'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Trip))
}

export async function createTrip(trip: Omit<Trip, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'trips'), trip)
  return ref.id
}

export async function updateTrip(id: string, data: Partial<Trip>): Promise<void> {
  await updateDoc(doc(db, 'trips', id), data)
}

export async function deleteTrip(id: string): Promise<void> {
  await deleteDoc(doc(db, 'trips', id))
}

// Itinerary
export async function fetchItinerary(tripId: string): Promise<ItineraryDay[]> {
  const q = query(collection(db, 'itinerary'), where('tripId', '==', tripId), orderBy('date', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ItineraryDay))
}

export async function saveItineraryDay(day: Omit<ItineraryDay, 'id'> & { id?: string }): Promise<string> {
  if (day.id) {
    await setDoc(doc(db, 'itinerary', day.id), day)
    return day.id
  }
  const ref = await addDoc(collection(db, 'itinerary'), day)
  return ref.id
}

export async function deleteItineraryDay(id: string): Promise<void> {
  await deleteDoc(doc(db, 'itinerary', id))
}

// Budget
export async function fetchExpenses(tripId: string): Promise<Expense[]> {
  const q = query(collection(db, 'expenses'), where('tripId', '==', tripId), orderBy('date', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Expense))
}

export async function addExpense(expense: Omit<Expense, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'expenses'), expense)
  return ref.id
}

export async function deleteExpense(id: string): Promise<void> {
  await deleteDoc(doc(db, 'expenses', id))
}

export async function fetchBudget(tripId: string): Promise<TripBudget | null> {
  const snap = await getDoc(doc(db, 'budgets', tripId))
  return snap.exists() ? (snap.data() as TripBudget) : null
}

export async function saveBudget(budget: TripBudget): Promise<void> {
  await setDoc(doc(db, 'budgets', budget.tripId), budget)
}

// Packing
export async function fetchPackingItems(tripId: string): Promise<PackingItem[]> {
  const q = query(collection(db, 'packing'), where('tripId', '==', tripId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PackingItem))
}

export async function addPackingItem(item: Omit<PackingItem, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'packing'), item)
  return ref.id
}

export async function updatePackingItem(id: string, data: Partial<PackingItem>): Promise<void> {
  await updateDoc(doc(db, 'packing', id), data)
}

export async function deletePackingItem(id: string): Promise<void> {
  await deleteDoc(doc(db, 'packing', id))
}

export { Timestamp }
