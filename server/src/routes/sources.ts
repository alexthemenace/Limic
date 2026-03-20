import { Router } from 'express'
import { prisma } from '../db/client.js'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'

export const sourcesRouter = Router()
sourcesRouter.use(requireAuth)

const DEFAULT_SOURCES = [
  { sourceId: 'gmail', name: 'Gmail', icon: '📧', description: 'Learn your email style, contacts & priorities' },
  { sourceId: 'calendar', name: 'Calendar', icon: '📅', description: 'Understand your schedule and energy patterns' },
  { sourceId: 'notes', name: 'Notes / Notion', icon: '📝', description: 'Absorb how you think and organize information' },
  { sourceId: 'canvas', name: 'Canvas LMS', icon: '🎓', description: 'Track academic schedule and deadlines' },
]

async function ensureSources(userId: string) {
  for (const s of DEFAULT_SOURCES) {
    await prisma.userDataSource.upsert({
      where: { userId_sourceId: { userId, sourceId: s.sourceId } },
      update: {},
      create: { userId, sourceId: s.sourceId, connected: false },
    })
  }
}

sourcesRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.userId
    await ensureSources(userId)

    const rows = await prisma.userDataSource.findMany({ where: { userId } })

    const sources = rows.map((r) => {
      const def = DEFAULT_SOURCES.find((d) => d.sourceId === r.sourceId)
      return {
        id: r.sourceId,
        name: def?.name ?? r.sourceId,
        icon: def?.icon ?? '🔌',
        description: def?.description ?? '',
        connected: r.connected,
        connectedAt: r.connectedAt,
      }
    })

    res.json(sources)
  } catch (err) {
    next(err)
  }
})

sourcesRouter.patch('/:sourceId/toggle', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.userId
    const { sourceId } = req.params

    await ensureSources(userId)

    const row = await prisma.userDataSource.findUnique({
      where: { userId_sourceId: { userId, sourceId } },
    })
    if (!row) {
      res.status(404).json({ error: 'Source not found' })
      return
    }

    const updated = await prisma.userDataSource.update({
      where: { userId_sourceId: { userId, sourceId } },
      data: {
        connected: !row.connected,
        connectedAt: !row.connected ? new Date() : null,
      },
    })

    const def = DEFAULT_SOURCES.find((d) => d.sourceId === sourceId)
    res.json({
      id: updated.sourceId,
      name: def?.name ?? sourceId,
      icon: def?.icon ?? '🔌',
      description: def?.description ?? '',
      connected: updated.connected,
      connectedAt: updated.connectedAt,
    })
  } catch (err) {
    next(err)
  }
})
