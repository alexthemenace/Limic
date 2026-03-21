import { Router } from 'express'
import { prisma } from '../db/client.js'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { summarizeMessage } from '../services/dittoAI.js'

export const messagesRouter = Router()
messagesRouter.use(requireAuth)

messagesRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const rows = await prisma.incomingMessage.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    })
    const messages = rows.map((r) => ({
      ...r,
      responseChips: r.responseChips ? (JSON.parse(r.responseChips) as string[]) : undefined,
    }))
    res.json(messages)
  } catch (err) {
    next(err)
  }
})

messagesRouter.post('/:id/summarize', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const msg = await prisma.incomingMessage.findFirst({
      where: { id, userId: req.user!.userId },
    })
    if (!msg) {
      res.status(404).json({ error: 'Message not found' })
      return
    }

    const { summary, responseChips } = summarizeMessage(msg.fullText, msg.sender)
    const updated = await prisma.incomingMessage.update({
      where: { id },
      data: { summary, responseChips: JSON.stringify(responseChips) },
    })

    res.json({ ...updated, responseChips })
  } catch (err) {
    next(err)
  }
})

messagesRouter.patch('/:id/dismiss', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const msg = await prisma.incomingMessage.findFirst({
      where: { id, userId: req.user!.userId },
    })
    if (!msg) {
      res.status(404).json({ error: 'Message not found' })
      return
    }

    const updated = await prisma.incomingMessage.update({
      where: { id },
      data: { handled: true },
    })
    const responseChips = updated.responseChips
      ? (JSON.parse(updated.responseChips) as string[])
      : undefined
    res.json({ ...updated, responseChips })
  } catch (err) {
    next(err)
  }
})
