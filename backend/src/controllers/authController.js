import { prisma } from '../lib/prisma.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'please_change_me'

export async function register(req, res) {
  try {
    const { name, email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'User already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, password: hashed } })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function signin(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    return res.json({ user: { id: user.id, name: user.name, email: user.email }, token })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function me(req, res) {
  try {
    const userId = req.user?.id || null
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    return res.json({ user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
