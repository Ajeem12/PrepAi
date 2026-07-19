import axios from 'axios'

// Toggle base URL for local dev vs production.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

/**
 * A tiny pub/sub so anything outside React (like this axios interceptor)
 * can tell AuthContext "the token died, log the user out".
 */
const listeners = new Set()

export function onSessionExpired(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function notifySessionExpired() {
  listeners.forEach((cb) => cb())
}

const PUBLIC_PATHS = ['/login', '/register']

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const onPublicPage = PUBLIC_PATHS.includes(window.location.pathname)

    if (status === 401 && !onPublicPage) {
      notifySessionExpired()
    }

    return Promise.reject(error)
  },
)
