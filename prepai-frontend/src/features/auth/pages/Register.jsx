import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Sparkles, User, Mail, Lock, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { loading, error, handleRegister } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await handleRegister({ username, email, password })
    if (ok) navigate('/')
  }

  return (
    <main className="aurora-bg relative flex min-h-screen w-full items-center justify-center bg-page px-4">
      <div className="fade-in-up w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
            style={{
              background:
                'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))',
            }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Create your account
          </h1>
          <p className="text-sm text-muted">
            Start prepping smarter with PrepAI
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-xs font-medium text-muted"
            >
              Username
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                id="username"
                name="username"
                placeholder="ajeembeg"
                className="field pl-10"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-muted">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="field pl-10"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-muted"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className="field pl-10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-accent-alt hover:text-accent-2"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Register
