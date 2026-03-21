import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app.js'
import { prisma } from '../src/db/client.js'

const testEmail = `auth-test-${Date.now()}@example.com`
const testPassword = 'password123'
const testName = 'Test User'

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: testEmail } })
})

describe('POST /api/v1/auth/register', () => {
  it('returns 201 + token on valid registration', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: testEmail, password: testPassword, name: testName })

    expect(res.status).toBe(201)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.user.email).toBe(testEmail)
    expect(res.body.user.name).toBe(testName)
    expect(res.body.user.id).toBeDefined()
  })

  it('returns 409 on duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: testEmail, password: testPassword, name: testName })

    expect(res.status).toBe(409)
    expect(res.body.error).toBeDefined()
  })

  it('returns 400 on missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'notanemail' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Validation failed')
  })
})

describe('POST /api/v1/auth/login', () => {
  it('returns 200 + token on valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: testPassword })

    expect(res.status).toBe(200)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.user.email).toBe(testEmail)
  })

  it('returns 401 on wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: 'wrongpassword' })

    expect(res.status).toBe(401)
  })
})

describe('GET /api/v1/auth/me', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/v1/auth/me')
    expect(res.status).toBe(401)
  })

  it('returns user data with valid token', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: testPassword })

    const token = loginRes.body.token as string

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.email).toBe(testEmail)
    expect(res.body.name).toBe(testName)
    expect(res.body.id).toBeDefined()
    expect(res.body.createdAt).toBeDefined()
  })
})
