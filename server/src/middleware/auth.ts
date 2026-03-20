import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../services/jwt.js'

export interface AuthRequest extends Request {
  user?: { userId: string; email: string }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const token = authHeader.slice(7)
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
