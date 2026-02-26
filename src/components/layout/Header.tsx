import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserMenu } from './UserMenu'

interface HeaderProps {
  title?: string
  showBack?: boolean
}

export function Header({ title, showBack }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
        {showBack && !isHome ? (
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Plane className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
        <h1 className="font-semibold text-slate-100 text-base flex-1">
          {title || 'TripPlanner'}
        </h1>
        <UserMenu />
      </div>
    </header>
  )
}
