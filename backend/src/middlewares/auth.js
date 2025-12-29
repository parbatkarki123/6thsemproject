import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'

const JWT_SECRET = process.env.JWT_SECRET || 'please_change_me'

export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })

    const token = auth.split(' ')[1]
    const payload = jwt.verify(token, JWT_SECRET)
    if (!payload?.userId) return res.status(401).json({ error: 'Unauthorized' })

    const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, name: true, email: true } })
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    req.user = user
    return next()
  } catch (err) {
    console.error(err)
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
