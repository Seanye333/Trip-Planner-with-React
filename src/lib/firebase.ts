import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
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
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
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
export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider())
export const signOutUser = () => signOut(auth)
export const onAuth = (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb)

// Trips
export async function fetchTrips(userId: string): Promise<Trip[]> {
  const q = query(collection(db, 'trips'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Trip))
}

export async function createTrip(trip: Trip): Promise<void> {
  await setDoc(doc(db, 'trips', trip.id), trip)
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

export async function saveItineraryDay(day: ItineraryDay): Promise<void> {
  await setDoc(doc(db, 'itinerary', day.id), day)
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

export async function addExpense(expense: Expense): Promise<void> {
  await setDoc(doc(db, 'expenses', expense.id), expense)
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

export async function addPackingItem(item: PackingItem): Promise<void> {
  await setDoc(doc(db, 'packing', item.id), item)
}

export async function updatePackingItem(id: string, data: Partial<PackingItem>): Promise<void> {
  await updateDoc(doc(db, 'packing', id), data)
}

export async function deletePackingItem(id: string): Promise<void> {
  await deleteDoc(doc(db, 'packing', id))
}

// Upload all local trips to Firebase after Google sign-in
export async function syncLocalTripsToFirebase(trips: Trip[], userId: string): Promise<void> {
  const writes = trips
    .filter((t) => t.userId === 'local' || t.userId === userId)
    .map((t) => setDoc(doc(db, 'trips', t.id), { ...t, userId }))
  await Promise.all(writes)
}

export { Timestamp }
