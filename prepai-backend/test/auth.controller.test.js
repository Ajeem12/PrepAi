import { beforeEach, describe, expect, it, vi } from 'vitest'

const findOne = vi.fn()
const create = vi.fn()
const hash = vi.fn()
const sign = vi.fn()

vi.mock('../src/models/user.model.js', () => ({
  default: { findOne, create },
}))
vi.mock('../src/models/blacklist.model.js', () => ({
  default: { create: vi.fn() },
}))
vi.mock('bcryptjs', () => ({ default: { hash, compare: vi.fn() } }))
vi.mock('jsonwebtoken', () => ({ default: { sign } }))

function response() {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  res.cookie = vi.fn().mockReturnValue(res)
  return res
}

describe('registerUserController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test-secret'
  })

  it('rejects incomplete registration data', async () => {
    const { registerUserController } =
      await import('../src/controllers/auth.controller.js')
    const res = response()

    await registerUserController({ body: { username: 'sam' } }, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Please provide username, email and password',
    })
  })

  it('creates a user, sets a token cookie, and returns safe user data', async () => {
    findOne.mockResolvedValue(null)
    hash.mockResolvedValue('hashed-password')
    sign.mockReturnValue('signed-token')
    create.mockResolvedValue({
      _id: 'user-1',
      username: 'sam',
      email: 'sam@example.com',
    })
    const { registerUserController } =
      await import('../src/controllers/auth.controller.js')
    const res = response()

    await registerUserController(
      {
        body: { username: 'sam', email: 'sam@example.com', password: 'secret' },
      },
      res,
    )

    expect(hash).toHaveBeenCalledWith('secret', 10)
    expect(create).toHaveBeenCalledWith({
      username: 'sam',
      email: 'sam@example.com',
      password: 'hashed-password',
    })
    expect(res.cookie).toHaveBeenCalledWith('token', 'signed-token')
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User registered successfully',
      user: { id: 'user-1', username: 'sam', email: 'sam@example.com' },
    })
  })
})
