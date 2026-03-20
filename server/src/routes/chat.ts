import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db/client.js'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

export const chatRouter = Router()
chatRouter.use(requireAuth)

const createMessageSchema = z.object({
  role: z.enum(['user', 'ditto']),
  text: z.string().min(1),
})

chatRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'asc' },
    })
    res.json(messages)
  } catch (err) {
    next(err)
  }
})

chatRouter.post('/', validate(createMessageSchema), async (req: AuthRequest, res, next) => {
  try {
    const { role, text } = req.body as z.infer<typeof createMessageSchema>
    const message = await prisma.chatMessage.create({
      data: { userId: req.user!.userId, role, text },
    })
    res.status(201).json(message)
  } catch (err) {
    next(err)
  }
})
