import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'
import { Loader2 } from 'lucide-react'

const Protected = ({ children }) => {
  const { loading, user } = useAuth()

  if (loading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-page">
        <div className="flex flex-col items-center gap-3 text-muted">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <p className="text-sm">Loading your workspace…</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default Protected
