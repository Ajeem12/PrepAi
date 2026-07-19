import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import Protected from './Protected'

const { useAuth } = vi.hoisted(() => ({ useAuth: vi.fn() }))

vi.mock('../hooks/useAuth', () => ({ useAuth }))

function renderProtected() {
  return render(
    <MemoryRouter>
      <Protected>
        <p>Private dashboard</p>
      </Protected>
    </MemoryRouter>,
  )
}

describe('Protected', () => {
  it('shows a loading state while the session is being restored', () => {
    useAuth.mockReturnValue({ loading: true, user: null })

    renderProtected()

    expect(screen.getByText('Loading your workspace…')).toBeInTheDocument()
  })

  it('redirects unauthenticated users to the login page', () => {
    useAuth.mockReturnValue({ loading: false, user: null })

    renderProtected()

    expect(screen.queryByText('Private dashboard')).not.toBeInTheDocument()
  })

  it('renders private content for an authenticated user', () => {
    useAuth.mockReturnValue({ loading: false, user: { id: 'user-1' } })

    renderProtected()

    expect(screen.getByText('Private dashboard')).toBeInTheDocument()
  })
})
