import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app.js'
import { prisma } from '../src/db/client.js'

const testEmail = `traits-test-${Date.now()}@example.com`
let token: string

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: testEmail } })

  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ email: testEmail, password: 'password123', name: 'Traits Tester' })

  token = res.body.token as string
})

describe('Traits API', () => {
  it('GET /api/v1/traits returns empty array initially', async () => {
    const res = await request(app)
      .get('/api/v1/traits')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toHaveLength(0)
  })

  let createdId: string

  it('POST /api/v1/traits creates a trait', async () => {
    const res = await request(app)
      .post('/api/v1/traits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        category: 'communication',
        label: 'Direct',
        detail: 'Prefers direct communication',
        confidence: 85,
      })

    expect(res.status).toBe(201)
    expect(res.body.label).toBe('Direct')
    expect(res.body.category).toBe('communication')
    expect(res.body.confidence).toBe(85)
    expect(res.body.id).toBeDefined()
    createdId = res.body.id as string
  })

  it('GET /api/v1/traits returns created trait', async () => {
    const res = await request(app)
      .get('/api/v1/traits')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].label).toBe('Direct')
  })

  it('DELETE /api/v1/traits/:id removes the trait', async () => {
    const res = await request(app)
      .delete(`/api/v1/traits/${createdId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    const listRes = await request(app)
      .get('/api/v1/traits')
      .set('Authorization', `Bearer ${token}`)

    expect(listRes.body).toHaveLength(0)
  })

  it('POST /api/v1/traits with invalid data returns 400', async () => {
    const res = await request(app)
      .post('/api/v1/traits')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'invalid-category', label: '', confidence: 200 })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Validation failed')
  })
})
