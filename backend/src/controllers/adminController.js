import { prisma } from '../lib/prisma.js'
import bcrypt from 'bcryptjs'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import ExcelJS from 'exceljs'

// ========== Event Management (Admin) ==========
export async function adminListEvents(req, res) {
  try {
    const events = await prisma.event.findMany({ orderBy: { eventDate: 'asc' }, include: { createdBy: { select: { id: true, name: true, role: true } } } })
    return res.json({ events })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function adminCreateEvent(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const { title, description, eventDate, venue } = req.body
    if (!title || !eventDate) return res.status(400).json({ error: 'Title and eventDate are required' })

    const event = await prisma.event.create({ data: { title, description: description || '', eventDate: new Date(eventDate), venue: venue || '', createdById: user.id, status: 'APPROVED' } })
    return res.status(201).json({ event })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function adminUpdateEvent(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const id = Number(req.params.id)
    const { title, description, eventDate, venue, status } = req.body
    if (!title || !eventDate) return res.status(400).json({ error: 'Title and eventDate are required' })

    const event = await prisma.event.update({ where: { id }, data: { title, description: description || '', eventDate: new Date(eventDate), venue: venue || '', status } })
    return res.json({ event })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function adminDeleteEvent(req, res) {
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

export async function adminApproveEvent(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const id = Number(req.params.id)
    const event = await prisma.event.update({ where: { id }, data: { status: 'APPROVED' } })
    return res.json({ event })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function adminRejectEvent(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const id = Number(req.params.id)
    const event = await prisma.event.update({ where: { id }, data: { status: 'REJECTED' } })
    return res.json({ event })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function adminCompleteEvent(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const id = Number(req.params.id)
    const event = await prisma.event.update({ where: { id }, data: { isCompleted: true } })

    // Automatically generate certificates for all registered students
    const registrations = await prisma.registration.findMany({ where: { eventId: id }, include: { user: true } })
    
    if (registrations.length > 0) {
      const outDir = path.join(process.cwd(), 'uploads', 'certificates')
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

      for (const reg of registrations) {
        const doc = new PDFDocument({ size: 'A4', margin: 50 })
        const filename = `certificate_event_${id}_user_${reg.userId}.pdf`
        const filePath = path.join(outDir, filename)
        const stream = fs.createWriteStream(filePath)
        doc.pipe(stream)

        doc.fontSize(24).text('Certificate of Participation', { align: 'center' })
        doc.moveDown(2)
        doc.fontSize(18).text(`This is to certify that`, { align: 'center' })
        doc.moveDown()
        doc.fontSize(22).text(reg.user.name, { align: 'center', underline: true })
        doc.moveDown()
        doc.fontSize(16).text(`has participated in ${event.title} on ${new Date(event.eventDate).toLocaleDateString()}`, { align: 'center' })
        doc.moveDown(4)
        doc.fontSize(12).text(`Issued by Admin`, { align: 'right' })

        doc.end()

        await new Promise((resolve, reject) => {
          stream.on('finish', resolve)
          stream.on('error', reject)
        })

        const fileUrl = `/uploads/certificates/${filename}`
        await prisma.certificate.upsert({ 
          where: { userId_eventId: { userId: reg.userId, eventId: id } }, 
          update: { fileUrl, issuedAt: new Date() }, 
          create: { userId: reg.userId, eventId: id, fileUrl } 
        })
      }
    }

    return res.json({ event, certificatesGenerated: registrations.length })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ========== User Management (Admin) ==========
export async function createTeacherAccount(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const { name, email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'User already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const teacher = await prisma.user.create({ data: { name, email, password: hashed, role: 'TEACHER' } })
    return res.status(201).json({ teacher })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deleteTeacherAccount(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const id = Number(req.params.id)
    const t = await prisma.user.findUnique({ where: { id } })
    if (!t || t.role !== 'TEACHER') return res.status(404).json({ error: 'Teacher not found' })

    await prisma.user.delete({ where: { id } })
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function blockStudent(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const id = Number(req.params.id)
    const u = await prisma.user.findUnique({ where: { id } })
    if (!u || u.role !== 'STUDENT') return res.status(404).json({ error: 'Student not found' })

    await prisma.user.update({ where: { id }, data: { isBlocked: true } })
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function unblockStudent(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const id = Number(req.params.id)
    const u = await prisma.user.findUnique({ where: { id } })
    if (!u || u.role !== 'STUDENT') return res.status(404).json({ error: 'Student not found' })

    await prisma.user.update({ where: { id }, data: { isBlocked: false } })
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function resetUserPassword(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const id = Number(req.params.id)
    const { password } = req.body
    if (!password) return res.status(400).json({ error: 'Password required' })

    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.update({ where: { id }, data: { password: hashed } })
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ========== Analytics (Admin) ==========
export async function analyticsSummary(req, res) {
  try {
    const totalEvents = await prisma.event.count()
    const totalRegistrations = await prisma.registration.count()

    const eventCounts = await prisma.registration.groupBy({ by: ['eventId'], _count: { eventId: true }, orderBy: { _count: { eventId: 'desc' } }, take: 5 })

    const mostPopular = eventCounts.length ? await prisma.event.findUnique({ where: { id: eventCounts[0].eventId }, select: { id: true, title: true } }) : null

    const eventWise = await prisma.registration.groupBy({ by: ['eventId'], _count: { eventId: true } })

    return res.json({ totalEvents, totalRegistrations, mostPopular, eventWise })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ========== Certificate Template Upload (Admin) ==========
export async function uploadCertificateTemplate(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })
    if (!req.file) return res.status(400).json({ error: 'File required' })

    const fileUrl = `/uploads/${req.file.filename}`
    const tpl = await prisma.certificateTemplate.create({ data: { fileUrl, name: req.file.originalname, uploadedBy: user.id } })
    return res.status(201).json({ template: tpl })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ========== Notifications (Admin) ==========
export async function sendNotification(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const { title, message, eventId, targetAll } = req.body
    const note = await prisma.notification.create({ data: { title, message, eventId: eventId || null, targetAll: !!targetAll } })
    return res.status(201).json({ notification: note })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getNotificationsForUser(req, res) {
  try {
    const user = req.user
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    // Fetch notifications that are targetAll or specific to events the user is registered to
    const regs = await prisma.registration.findMany({ where: { userId: user.id }, select: { eventId: true } })
    const eventIds = regs.map(r => r.eventId)

    const notes = await prisma.notification.findMany({ where: { OR: [ { targetAll: true }, { eventId: { in: eventIds } } ] }, orderBy: { createdAt: 'desc' } })
    return res.json({ notifications: notes })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ========== Attendance Management ==========
export async function markAttendance(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const { eventId, userId, status } = req.body
    if (!eventId || !userId || !status) return res.status(400).json({ error: 'eventId, userId and status required' })

    const att = await prisma.attendance.upsert({ where: { userId_eventId: { userId, eventId } }, update: { status }, create: { userId, eventId, status } })
    return res.json({ attendance: att })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ========== Reports (Admin) ==========
export async function eventParticipationReport(req, res) {
  try {
    const eventId = Number(req.params.id)
    const regs = await prisma.registration.findMany({ where: { eventId }, include: { user: { select: { id: true, name: true, email: true } } } })
    return res.json({ registrations: regs })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function studentParticipationReport(req, res) {
  try {
    const userId = Number(req.params.id)
    const regs = await prisma.registration.findMany({ where: { userId }, include: { event: true } })
    return res.json({ registrations: regs })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ========== Report Exports (PDF / Excel) ==========
export async function exportEventReportExcel(req, res) {
  try {
    const id = Number(req.params.id)
    const regs = await prisma.registration.findMany({ where: { eventId: id }, include: { user: { select: { id: true, name: true, email: true } }, event: { select: { title: true, eventDate: true } } } })

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Registrations')
    sheet.columns = [
      { header: 'User ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Registered At', key: 'createdAt', width: 30 }
    ]
    regs.forEach(r => sheet.addRow({ id: r.user.id, name: r.user.name, email: r.user.email, createdAt: r.createdAt.toISOString() }))

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="event_${id}_registrations.xlsx"`)
    await workbook.xlsx.write(res)
    res.end()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function exportEventReportPDF(req, res) {
  try {
    const id = Number(req.params.id)
    const regs = await prisma.registration.findMany({ where: { eventId: id }, include: { user: { select: { id: true, name: true, email: true } }, event: { select: { title: true, eventDate: true } } } })

    const doc = new PDFDocument({ margin: 40 })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="event_${id}_registrations.pdf"`)
    doc.pipe(res)

    const title = regs[0]?.event?.title || `Event ${id}`
    doc.fontSize(20).text(`Registrations for: ${title}`, { align: 'center' })
    doc.moveDown()

    regs.forEach((r, i) => {
      doc.fontSize(12).text(`${i+1}. ${r.user.name} <${r.user.email}> (ID: ${r.user.id})`) 
    })

    doc.end()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ========== Certificate Generation ==========
export async function generateCertificatesForEvent(req, res) {
  try {
    const user = req.user
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

    const eventId = Number(req.params.id)
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true, title: true, eventDate: true } })
    if (!event) return res.status(404).json({ error: 'Event not found' })

    // Get all students registered for this event
    const registrations = await prisma.registration.findMany({ where: { eventId }, include: { user: true } })

    if (!registrations.length) return res.status(200).json({ message: 'No registered students to generate certificates for', generated: [] })

    const outDir = path.join(process.cwd(), 'uploads', 'certificates')
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

    const generated = []
    for (const reg of registrations) {
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const filename = `certificate_event_${eventId}_user_${reg.userId}.pdf`
      const filePath = path.join(outDir, filename)
      const stream = fs.createWriteStream(filePath)
      doc.pipe(stream)

      doc.fontSize(24).text('Certificate of Participation', { align: 'center' })
      doc.moveDown(2)
      doc.fontSize(18).text(`This is to certify that`, { align: 'center' })
      doc.moveDown()
      doc.fontSize(22).text(reg.user.name, { align: 'center', underline: true })
      doc.moveDown()
      doc.fontSize(16).text(`has participated in ${event.title} on ${new Date(event.eventDate).toLocaleDateString()}`, { align: 'center' })
      doc.moveDown(4)
      doc.fontSize(12).text(`Issued by Admin`, { align: 'right' })

      doc.end()

      // wait for write finish
      await new Promise((resolve, reject) => {
        stream.on('finish', resolve)
        stream.on('error', reject)
      })

      const fileUrl = `/uploads/certificates/${filename}`
      const cert = await prisma.certificate.upsert({ where: { userId_eventId: { userId: reg.userId, eventId } }, update: { fileUrl, issuedAt: new Date() }, create: { userId: reg.userId, eventId, fileUrl } })
      generated.push(cert)
    }

    return res.json({ generated })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ========== Gallery Image Management ==========
export async function uploadGalleryImage(req, res) {
  try {
    const user = req.user
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return res.status(403).json({ error: 'Forbidden - Only admins and teachers can upload images' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' })
    }

    const { title, description } = req.body
    const filename = `${Date.now()}-${req.file.originalname}`
    const galleryDir = path.join(process.cwd(), 'uploads', 'gallery')
    
    // Ensure gallery directory exists
    if (!fs.existsSync(galleryDir)) {
      fs.mkdirSync(galleryDir, { recursive: true })
    }

    const uploadPath = path.join(galleryDir, filename)
    
    // Move file to gallery directory
    try {
      fs.renameSync(req.file.path, uploadPath)
    } catch (err) {
      console.error('File move error:', err)
      // Fallback: copy the file if rename fails
      fs.copyFileSync(req.file.path, uploadPath)
      fs.unlinkSync(req.file.path)
    }

    // Create database entry
    const image = await prisma.galleryImage.create({
      data: {
        imageUrl: `/uploads/gallery/${filename}`,
        title: title || 'Untitled',
        description: description || '',
        uploadedBy: user.id
      },
      include: {
        uploadedByUser: {
          select: { id: true, name: true, role: true }
        }
      }
    })

    return res.status(201).json({ image })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error: ' + err.message })
  }
}

export async function getGalleryImages(req, res) {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return res.json({ images })
  } catch (err) {
    console.error('Gallery Fetch Error:', err)
    return res.status(500).json({ error: 'Internal server error', details: err.message })
  }
}

export async function deleteGalleryImage(req, res) {
  try {
    const user = req.user
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const id = Number(req.params.id)
    const image = await prisma.galleryImage.findUnique({ where: { id } })

    if (!image) {
      return res.status(404).json({ error: 'Image not found' })
    }

    // Only allow admins or the uploader to delete
    if (user.role !== 'ADMIN' && image.uploadedBy !== user.id) {
      return res.status(403).json({ error: 'Forbidden - You can only delete your own images' })
    }

    // Delete file from filesystem
    const filePath = path.join(image.imageUrl.replace(/^\//, ''))
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Delete from database
    await prisma.galleryImage.delete({ where: { id } })

    return res.json({ message: 'Image deleted successfully' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
