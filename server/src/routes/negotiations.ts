import { Router } from 'express'
import { prisma } from '../db/client.js'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'

export const negotiationsRouter = Router()
negotiationsRouter.use(requireAuth)

negotiationsRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const rows = await prisma.negotiationThread.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    })
    const threads = rows.map((r) => ({
      ...r,
      participants: JSON.parse(r.participants) as string[],
      messages: JSON.parse(r.messages) as string[],
    }))
    res.json(threads)
  } catch (err) {
    next(err)
  }
})

negotiationsRouter.patch('/:id/resolve', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const thread = await prisma.negotiationThread.findFirst({
      where: { id, userId: req.user!.userId },
    })
    if (!thread) {
      res.status(404).json({ error: 'Negotiation not found' })
      return
    }

    const outcome = (req.body as { outcome?: string })?.outcome ?? 'Resolved by Ditto'
    const updated = await prisma.negotiationThread.update({
      where: { id },
      data: { resolved: true, status: 'resolved', outcome },
    })

    res.json({
      ...updated,
      participants: JSON.parse(updated.participants) as string[],
      messages: JSON.parse(updated.messages) as string[],
    })
  } catch (err) {
    next(err)
  }
})
