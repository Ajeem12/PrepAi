import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from '../src/app.js'

describe('application middleware', () => {
  it('allows the configured frontend origin and credentials', async () => {
    const response = await request(app)
      .options('/api/auth/login')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')

    expect(response.status).toBe(204)
    expect(response.headers['access-control-allow-origin']).toBe(
      'http://localhost:5173',
    )
    expect(response.headers['access-control-allow-credentials']).toBe('true')
  })
})
