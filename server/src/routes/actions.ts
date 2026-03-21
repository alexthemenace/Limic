import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { simulateDraft, simulateResearch } from '../services/dittoAI.js'

export const actionsRouter = Router()
actionsRouter.use(requireAuth)

const draftSchema = z.object({
  context: z.string().default(''),
  recipient: z.string().optional().default(''),
  tone: z.enum(['professional', 'casual', 'assertive']).default('professional'),
})

const researchSchema = z.object({
  topic: z.string().default(''),
  preferences: z.string().optional(),
})

actionsRouter.post('/draft', validate(draftSchema), async (req, res, next) => {
  try {
    const { context, recipient, tone } = req.body as z.infer<typeof draftSchema>
    const result = simulateDraft(context, recipient ?? '', tone)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

actionsRouter.post('/research', validate(researchSchema), async (req, res, next) => {
  try {
    const { topic } = req.body as z.infer<typeof researchSchema>
    const result = simulateResearch(topic)
    res.json(result)
  } catch (err) {
    next(err)
  }
})
