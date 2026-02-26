import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { onAuth, syncLocalTripsToFirebase, fetchTrips } from '@/lib/firebase'
import { useStore } from '@/lib/store'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Home } from '@/pages/Home'
import { TripDetail } from '@/pages/TripDetail'
import { ItineraryPage } from '@/pages/ItineraryPage'
import { MapPage } from '@/pages/MapPage'
import { BudgetPage } from '@/pages/BudgetPage'
import { PackingPage } from '@/pages/PackingPage'
import { AIChatPage } from '@/pages/AIChatPage'
import { RedNotePage } from '@/pages/RedNotePage'
import { LoginPage } from '@/pages/LoginPage'

function TripLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const { id } = useParams<{ id: string }>()
  return (
    <>
      <Header title={title} showBack />
      <main className="flex-1 flex flex-col">{children}</main>
      <BottomNav tripId={id!} />
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header />
            <main className="flex-1 flex flex-col">
              <Home />
            </main>
          </>
        }
      />
      <Route
        path="/trip/:id"
        element={
          <>
            <Header showBack />
            <main className="flex-1 flex flex-col">
              <TripDetail />
            </main>
          </>
        }
      />
      <Route path="/trip/:id/itinerary" element={<TripLayout title="Itinerary"><ItineraryPage /></TripLayout>} />
      <Route path="/trip/:id/map" element={<TripLayout title="Map"><MapPage /></TripLayout>} />
      <Route path="/trip/:id/budget" element={<TripLayout title="Budget"><BudgetPage /></TripLayout>} />
      <Route path="/trip/:id/packing" element={<TripLayout title="Packing List"><PackingPage /></TripLayout>} />
      <Route path="/trip/:id/ai" element={<TripLayout title="AI Assistant"><AIChatPage /></TripLayout>} />
      <Route path="/trip/:id/rednote" element={<TripLayout title="RedNote 小红书"><RedNotePage /></TripLayout>} />
    </Routes>
  )
}

function AuthGate() {
  const { userId, setUserId, setUserProfile, trips, setTrips } = useStore()
  const [authReady, setAuthReady] = useState(false)
  const [skipped, setSkipped] = useState(false)

  useEffect(() => {
    let unsub: (() => void) | undefined
    try {
      unsub = onAuth(async (user) => {
        if (user && !user.isAnonymous) {
          // Real Google account — sync local trips up, then load remote trips
          setUserId(user.uid)
          setUserProfile(user.email, user.photoURL)
          const localTrips = useStore.getState().trips
          if (localTrips.length > 0) {
            await syncLocalTripsToFirebase(localTrips, user.uid).catch(console.warn)
          }
          const remoteTrips = await fetchTrips(user.uid).catch(() => [] as typeof trips)
          if (remoteTrips.length > 0) setTrips(remoteTrips)
        } else if (!user) {
          setUserId(null)
          setUserProfile(null, null)
        }
        setAuthReady(true)
      })
    } catch (e) {
      console.warn('Firebase auth unavailable:', e)
      setAuthReady(true)
    }
    return () => unsub?.()
  }, [setUserId, setUserProfile, setTrips])

  // Not yet decided — show login
  if (!authReady) return null

  // Show login if not signed in and hasn't skipped
  if (!userId && !skipped) {
    return <LoginPage onSkip={() => setSkipped(true)} />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppRoutes />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthGate />
    </BrowserRouter>
  )
}
