import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db/client.js'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

export const traitsRouter = Router()
traitsRouter.use(requireAuth)

const createTraitSchema = z.object({
  category: z.enum(['communication', 'schedule', 'preference', 'habit']),
  label: z.string().min(1),
  detail: z.string().min(1),
  confidence: z.number().int().min(0).max(100),
})

traitsRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const traits = await prisma.behavioralTrait.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    })
    res.json(traits)
  } catch (err) {
    next(err)
  }
})

traitsRouter.post('/', validate(createTraitSchema), async (req: AuthRequest, res, next) => {
  try {
    const data = req.body as z.infer<typeof createTraitSchema>
    const trait = await prisma.behavioralTrait.create({
      data: { ...data, userId: req.user!.userId },
    })
    res.status(201).json(trait)
  } catch (err) {
    next(err)
  }
})

traitsRouter.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const trait = await prisma.behavioralTrait.findFirst({
      where: { id, userId: req.user!.userId },
    })
    if (!trait) {
      res.status(404).json({ error: 'Trait not found' })
      return
    }
    await prisma.behavioralTrait.delete({ where: { id } })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})
