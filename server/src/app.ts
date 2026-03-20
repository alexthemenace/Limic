import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { config } from './config.js'
import { apiRouter } from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

app.use(helmet())
app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json())

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(globalLimiter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/v1', apiRouter)

app.use(errorHandler)
