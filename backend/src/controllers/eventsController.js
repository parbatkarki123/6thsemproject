import { prisma } from '../lib/prisma.js'

export async function listEvents(req, res) {
  try {
    const events = await prisma.event.findMany({ orderBy: { eventDate: 'asc' }, include: { createdBy: { select: { id: true, name: true } } } })
    return res.json({ events })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createEvent(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const { title, description, eventDate, venue } = req.body
    if (!title || !eventDate) return res.status(400).json({ error: 'Title and eventDate are required' })

    const event = await prisma.event.create({ data: { title, description: description || '', eventDate: new Date(eventDate), venue: venue || '', createdById: user.id } })
    return res.status(201).json({ event })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deleteEvent(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const id = Number(req.params.id)
    await prisma.event.delete({ where: { id } })
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function registerForEvent(req, res) {
  try {
    const user = req.user
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const eventId = Number(req.params.id)
    // prevent duplicate registration
    const existing = await prisma.registration.findUnique({ where: { userId_eventId: { userId: user.id, eventId } } }).catch(()=>null)
    if (existing) return res.status(409).json({ error: 'Already registered' })

    const registration = await prisma.registration.create({ data: { userId: user.id, eventId } })
    return res.status(201).json({ registration })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
