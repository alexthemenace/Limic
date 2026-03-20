import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '../db/client.js'
import { signToken } from '../services/jwt.js'
import { validate } from '../middleware/validate.js'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'

export const authRouter = Router()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

authRouter.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, name } = req.body as z.infer<typeof registerSchema>

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      res.status(409).json({ error: 'Email already registered' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
    })

    const token = signToken({ userId: user.id, email: user.email })
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    next(err)
  }
})

authRouter.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body as z.infer<typeof loginSchema>

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const token = signToken({ userId: user.id, email: user.email })
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    next(err)
  }
})

authRouter.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({ id: user.id, email: user.email, name: user.name, createdAt: user.createdAt })
  } catch (err) {
    next(err)
  }
})
