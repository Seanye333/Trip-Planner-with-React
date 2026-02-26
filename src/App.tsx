import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { signInAnon, onAuth } from '@/lib/firebase'
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
      <Route
        path="/trip/:id/itinerary"
        element={
          <TripLayout title="Itinerary">
            <ItineraryPage />
          </TripLayout>
        }
      />
      <Route
        path="/trip/:id/map"
        element={
          <TripLayout title="Map">
            <MapPage />
          </TripLayout>
        }
      />
      <Route
        path="/trip/:id/budget"
        element={
          <TripLayout title="Budget">
            <BudgetPage />
          </TripLayout>
        }
      />
      <Route
        path="/trip/:id/packing"
        element={
          <TripLayout title="Packing List">
            <PackingPage />
          </TripLayout>
        }
      />
      <Route
        path="/trip/:id/ai"
        element={
          <TripLayout title="AI Assistant">
            <AIChatPage />
          </TripLayout>
        }
      />
      <Route
        path="/trip/:id/rednote"
        element={
          <TripLayout title="RedNote 小红书">
            <RedNotePage />
          </TripLayout>
        }
      />
    </Routes>
  )
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUserId = useStore((s) => s.setUserId)

  useEffect(() => {
    let unsub: (() => void) | undefined
    try {
      unsub = onAuth((user) => {
        if (user) {
          setUserId(user.uid)
        } else {
          signInAnon().catch((e) => console.warn('Anonymous sign-in failed:', e))
        }
      })
    } catch (e) {
      console.warn('Firebase auth unavailable, running in local mode:', e)
    }
    return () => unsub?.()
  }, [setUserId])

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
