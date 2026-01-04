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

export async function updateEvent(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const id = Number(req.params.id)
    const { title, description, eventDate, venue } = req.body
    if (!title || !eventDate) return res.status(400).json({ error: 'Title and eventDate are required' })

    const event = await prisma.event.update({
      where: { id },
      data: { title, description: description || '', eventDate: new Date(eventDate), venue: venue || '' }
    })
    return res.json({ event })
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

export async function getEventRegistrations(req, res) {
  try {
    const eventId = Number(req.params.id)
    const registrations = await prisma.registration.findMany({
      where: { eventId },
      include: { user: { select: { id: true, name: true, email: true } } }
    })
    return res.json({ registrations })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function removeStudentFromEvent(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const eventId = Number(req.params.eventId)
    const userId = Number(req.params.userId)
    
    await prisma.registration.delete({
      where: { userId_eventId: { userId, eventId } }
    })
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Teacher: submit event request (status PENDING)
export async function submitEventRequest(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'TEACHER') return res.status(403).json({ error: 'Forbidden' })

    const { title, description, eventDate, venue } = req.body
    if (!title || !eventDate) return res.status(400).json({ error: 'Title and eventDate are required' })

    // Events created by teachers should start with PENDING status.
    const event = await prisma.event.create({
      data: {
        title,
        description: description || '',
        eventDate: new Date(eventDate),
        venue: venue || '',
        createdById: user.id,
        status: 'PENDING'
      }
    })
    return res.status(201).json({ event })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Teacher: list their requests (view approval status)
export async function listTeacherRequests(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'TEACHER') return res.status(403).json({ error: 'Forbidden' })

    const requests = await prisma.event.findMany({
      where: { createdById: user.id },
      orderBy: { eventDate: 'asc' },
      select: { id: true, title: true, description: true, eventDate: true, venue: true, status: true, createdAt: true }
    })
    return res.json({ requests })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Teacher: view approved events only (their approved events)
export async function listTeacherApprovedEvents(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'TEACHER') return res.status(403).json({ error: 'Forbidden' })

    const events = await prisma.event.findMany({
      where: { createdById: user.id, status: 'APPROVED' },
      orderBy: { eventDate: 'asc' }
    })
    return res.json({ events })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Teacher: get registrations for their event (ensures ownership)
export async function getEventRegistrationsForTeacher(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'TEACHER') return res.status(403).json({ error: 'Forbidden' })

    const eventId = Number(req.params.id)
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true, createdById: true } })
    if (!event) return res.status(404).json({ error: 'Event not found' })
    if (event.createdById !== user.id) return res.status(403).json({ error: 'Forbidden' })

    const registrations = await prisma.registration.findMany({
      where: { eventId },
      include: { user: { select: { id: true, name: true, email: true } } }
    })
    return res.json({ registrations })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Teacher: download participant list as CSV for their event
export async function downloadParticipantList(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'TEACHER') return res.status(403).json({ error: 'Forbidden' })

    const eventId = Number(req.params.id)
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true, title: true, createdById: true } })
    if (!event) return res.status(404).json({ error: 'Event not found' })
    if (event.createdById !== user.id) return res.status(403).json({ error: 'Forbidden' })

    const registrations = await prisma.registration.findMany({
      where: { eventId },
      include: { user: { select: { id: true, name: true, email: true } } }
    })

    // build CSV
    const rows = []
    rows.push(['User ID', 'Name', 'Email', 'Registered At'])
    for (const r of registrations) {
      rows.push([String(r.user.id), r.user.name || '', r.user.email || '', r.createdAt.toISOString()])
    }
    const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n')

    const filename = `${event.title.replace(/[^a-z0-9]/gi, '_').slice(0,50)}_participants.csv`
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    return res.send(csv)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
