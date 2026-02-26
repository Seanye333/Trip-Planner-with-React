import { useState } from 'react'
import { LogOut, User } from 'lucide-react'
import { signOutUser } from '@/lib/firebase'
import { useStore } from '@/lib/store'

export function UserMenu() {
  const { userEmail, userPhoto, setUserId, setUserProfile } = useStore()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    await signOutUser()
    setUserId(null)
    setUserProfile(null, null)
    setOpen(false)
  }

  if (!userEmail) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-slate-700 hover:ring-blue-500 transition-all"
      >
        {userPhoto ? (
          <img src={userPhoto} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-blue-500 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-56 rounded-xl border border-slate-700 bg-slate-900 shadow-xl p-2">
            <div className="px-3 py-2 border-b border-slate-700 mb-1">
              <p className="text-xs font-medium text-slate-200 truncate">{userEmail}</p>
              <p className="text-xs text-slate-500">Syncing across devices</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
