import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { config } from './config.js'
import { apiRouter } from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

app.use(helmet())
app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/v1', apiRouter)

app.use(errorHandler)
