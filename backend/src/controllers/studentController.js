import { prisma } from '../lib/prisma.js'

// ============ Event Registration System ============

// Student: View approved events only (exclude completed events)
export async function getApprovedEvents(req, res) {
  try {
    const events = await prisma.event.findMany({
      where: { status: 'APPROVED', isCompleted: false },
      orderBy: { eventDate: 'asc' },
      include: { createdBy: { select: { id: true, name: true } } }
    })
    return res.json({ events })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Student: Register for event
export async function registerForApprovedEvent(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'STUDENT') return res.status(403).json({ error: 'Forbidden' })

    const eventId = Number(req.params.id)
    
    // Check event exists and is approved
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true, status: true } })
    if (!event) return res.status(404).json({ error: 'Event not found' })
    if (event.status !== 'APPROVED') return res.status(400).json({ error: 'Event is not approved for registration' })

    // Prevent duplicate registration
    const existing = await prisma.registration.findUnique({ 
      where: { userId_eventId: { userId: user.id, eventId } } 
    }).catch(() => null)
    if (existing) return res.status(409).json({ error: 'Already registered for this event' })

    const registration = await prisma.registration.create({ 
      data: { userId: user.id, eventId, status: 'REGISTERED' }
    })
    return res.status(201).json({ registration })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Student: Cancel registration
export async function cancelRegistration(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'STUDENT') return res.status(403).json({ error: 'Forbidden' })

    const eventId = Number(req.params.id)
    
    const registration = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } }
    })
    if (!registration) return res.status(404).json({ error: 'Registration not found' })

    await prisma.registration.delete({
      where: { userId_eventId: { userId: user.id, eventId } }
    })
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Student: Get registration status
export async function getRegistrationStatus(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'STUDENT') return res.status(403).json({ error: 'Forbidden' })

    const eventId = Number(req.params.id)
    
    const registration = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } },
      include: { event: { select: { id: true, title: true, eventDate: true, status: true } } }
    })
    
    if (!registration) return res.json({ registered: false, registration: null })
    return res.json({ registered: true, registration })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ============ Profile & Certificates ============

// Student: View registered events
export async function getStudentRegisteredEvents(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'STUDENT') return res.status(403).json({ error: 'Forbidden' })

    const registrations = await prisma.registration.findMany({
      where: { userId: user.id },
      include: { 
        event: { 
          select: { 
            id: true, 
            title: true, 
            description: true, 
            eventDate: true, 
            venue: true, 
            isCompleted: true,
            createdBy: { select: { id: true, name: true } }
          } 
        } 
      },
      orderBy: { event: { eventDate: 'asc' } }
    })
    return res.json({ registrations })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Student: View completed events
export async function getStudentCompletedEvents(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'STUDENT') return res.status(403).json({ error: 'Forbidden' })

    const registrations = await prisma.registration.findMany({
      where: { userId: user.id },
      include: { 
        event: { 
          select: { 
            id: true, 
            title: true, 
            description: true, 
            eventDate: true, 
            venue: true,
            isCompleted: true,
            createdBy: { select: { id: true, name: true } }
          } 
        } 
      }
    })
    
    // Filter for completed events on client side
    const completed = registrations.filter(r => r.event.isCompleted)
    return res.json({ registrations: completed })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Student: Get certificates
export async function getStudentCertificates(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'STUDENT') return res.status(403).json({ error: 'Forbidden' })

    const certificates = await prisma.certificate.findMany({
      where: { userId: user.id },
      include: { 
        event: { 
          select: { id: true, title: true, eventDate: true } 
        } 
      },
      orderBy: { issuedAt: 'desc' }
    })
    return res.json({ certificates })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Student: Download certificate (mock - return file URL)
export async function downloadCertificate(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'STUDENT') return res.status(403).json({ error: 'Forbidden' })

    const certId = Number(req.params.id)
    const cert = await prisma.certificate.findUnique({
      where: { id: certId },
      select: { userId: true, fileUrl: true, event: { select: { title: true } } }
    })
    
    if (!cert) return res.status(404).json({ error: 'Certificate not found' })
    if (cert.userId !== user.id) return res.status(403).json({ error: 'Forbidden' })

    // In production, download the file from fileUrl or storage service
    return res.json({ downloadUrl: cert.fileUrl, eventTitle: cert.event.title })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ============ Feedback System ============

// Student: Submit feedback
export async function submitFeedback(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'STUDENT') return res.status(403).json({ error: 'Forbidden' })

    const { eventId, rating, comment } = req.body
    if (!eventId || !rating || !comment) {
      return res.status(400).json({ error: 'eventId, rating, and comment are required' })
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    }

    // Check registration exists
    const registration = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: user.id, eventId: Number(eventId) } }
    }).catch(() => null)
    if (!registration) return res.status(404).json({ error: 'You are not registered for this event' })

    const feedback = await prisma.feedback.create({
      data: {
        userId: user.id,
        eventId: Number(eventId),
        rating: Number(rating),
        comment
      },
      include: { user: { select: { id: true, name: true } }, event: { select: { id: true, title: true } } }
    })
    return res.status(201).json({ feedback })
  } catch (err) {
    console.error(err)
    if (err.code === 'P2002') return res.status(409).json({ error: 'Feedback already exists for this event' })
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Student: Get feedback for their registered events
export async function getStudentFeedback(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'STUDENT') return res.status(403).json({ error: 'Forbidden' })

    const feedback = await prisma.feedback.findMany({
      where: { userId: user.id },
      include: { event: { select: { id: true, title: true, eventDate: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return res.json({ feedback })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Teacher/Admin: Get feedback for event
export async function getEventFeedback(req, res) {
  try {
    const user = req.user
    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const eventId = Number(req.params.id)
    
    // Teachers can only see feedback for their own events
    if (user.role === 'TEACHER') {
      const event = await prisma.event.findUnique({ where: { id: eventId }, select: { createdById: true } })
      if (!event) return res.status(404).json({ error: 'Event not found' })
      if (event.createdById !== user.id) return res.status(403).json({ error: 'Forbidden' })
    }

    const feedback = await prisma.feedback.findMany({
      where: { eventId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return res.json({ feedback })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Admin: Get all feedback
export async function getAllFeedback(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const feedback = await prisma.feedback.findMany({
      include: { 
        user: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return res.json({ feedback })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
