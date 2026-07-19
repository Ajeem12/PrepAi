import { useEffect, useState } from 'react'
import { onSessionExpired } from '../../lib/api'
import { AuthContext } from './auth-context'

export { AuthContext } from './auth-context'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionExpired, setSessionExpired] = useState(false)

  // Whenever any API call comes back 401 (token expired / invalid),
  // clear the user immediately so the whole app reacts (Protected
  // routes redirect to /login) without waiting on a page refresh.
  useEffect(() => {
    const unsubscribe = onSessionExpired(() => {
      setUser(null)
      setSessionExpired(true)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        sessionExpired,
        setSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
