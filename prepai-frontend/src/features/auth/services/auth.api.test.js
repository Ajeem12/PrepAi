import { beforeEach, describe, expect, it, vi } from 'vitest'

const api = {
  get: vi.fn(),
  post: vi.fn(),
}

vi.mock('../../../lib/api', () => ({ api }))

describe('auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends registration details and returns the API payload', async () => {
    api.post.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    const { register } = await import('./auth.api')

    await expect(
      register({
        username: 'sam',
        email: 'sam@example.com',
        password: 'secret',
      }),
    ).resolves.toEqual({ user: { id: 'user-1' } })

    expect(api.post).toHaveBeenCalledWith('/api/auth/register', {
      username: 'sam',
      email: 'sam@example.com',
      password: 'secret',
    })
  })

  it('fetches the current user', async () => {
    api.get.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    const { getMe } = await import('./auth.api')

    await expect(getMe()).resolves.toEqual({ user: { id: 'user-1' } })
    expect(api.get).toHaveBeenCalledWith('/api/auth/get-me')
  })
})
