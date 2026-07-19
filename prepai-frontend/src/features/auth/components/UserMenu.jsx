import { useEffect, useRef, useState } from 'react'
import { LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const UserMenu = () => {
  const { user, handleLogout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  if (!user) return null

  const initial = user.username?.[0]?.toUpperCase() || '?'

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition-all hover:border-accent/40 hover:bg-white/10"
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{
            background:
              'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))',
          }}
        >
          {initial}
        </span>
        <span className="max-w-25 truncate text-sm font-medium text-ink">
          {user.username}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="fade-in glass absolute right-0 top-[calc(100%+10px)] z-20 w-56 overflow-hidden rounded-2xl p-1.5 shadow-2xl shadow-black/40">
          <div className="px-3 py-2.5">
            <p className="m-0 truncate text-sm font-semibold text-ink">
              {user.username}
            </p>
            <p className="m-0 truncate text-xs text-muted">{user.email}</p>
          </div>
          <div className="my-1 h-px bg-white/10" />
          <button
            onClick={() => {
              setOpen(false)
              handleLogout()
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-bad transition-colors hover:bg-bad/10"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
