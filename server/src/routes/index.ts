import { Router } from 'express'
import { authRouter } from './auth.js'
import { traitsRouter } from './traits.js'
import { sourcesRouter } from './sources.js'
import { chatRouter } from './chat.js'
import { messagesRouter } from './messages.js'
import { negotiationsRouter } from './negotiations.js'
import { actionsRouter } from './actions.js'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/traits', traitsRouter)
apiRouter.use('/sources', sourcesRouter)
apiRouter.use('/chat', chatRouter)
apiRouter.use('/messages', messagesRouter)
apiRouter.use('/negotiations', negotiationsRouter)
apiRouter.use('/actions', actionsRouter)
