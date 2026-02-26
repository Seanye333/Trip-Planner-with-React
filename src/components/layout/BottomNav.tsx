import { NavLink } from 'react-router-dom'
import { Map, Wallet, Package, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  tripId: string
}

export function BottomNav({ tripId }: BottomNavProps) {
  const base = `/trip/${tripId}`
  const links = [
    { to: `${base}/itinerary`, icon: Calendar, label: 'Plan' },
    { to: `${base}/map`, icon: Map, label: 'Map' },
    { to: `${base}/budget`, icon: Wallet, label: 'Budget' },
    { to: `${base}/packing`, icon: Package, label: 'Packing' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-700/50 bg-slate-900/90 backdrop-blur-md">
      <div className="flex max-w-2xl mx-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
