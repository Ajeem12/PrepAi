import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../auth-context'
import { login, register, logout, getMe } from '../services/auth.api'

export const useAuth = () => {
  const context = useContext(AuthContext)
  const {
    user,
    setUser,
    loading,
    setLoading,
    sessionExpired,
    setSessionExpired,
  } = context

  const [error, setError] = useState('')

  const handleLogin = async ({ email, password }) => {
    setLoading(true)
    setError('')
    try {
      const data = await login({ email, password })
      setUser(data.user)
      return true
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password')
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true)
    setError('')
    try {
      const data = await register({ username, email, password })
      setUser(data.user)
      return true
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create account')
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
    } catch {
      // ignore - we clear the user locally regardless
    } finally {
      setUser(null)
      setLoading(false)
    }
  }

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe()
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getAndSetUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    user,
    loading,
    error,
    sessionExpired,
    setSessionExpired,
    handleRegister,
    handleLogin,
    handleLogout,
  }
}
